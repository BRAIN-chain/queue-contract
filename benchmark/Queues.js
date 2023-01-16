const { expect } = require("chai");

const ITER = 819;
const SIZE = 1000; // random priority: 1~SIZE
const sample = "0xde263896c9466aa7aa6da0b1a41c77a277e4eb3bd01a111e7803f64fe2d8602c";


var SJS = Sampling = require('discrete-sampling');

// https://stackoverflow.com/questions/56960704/how-to-generate-an-inclusively-bounded-pareto-random-integer-from-javascripts-m
function getRandomIntInclusivePareto(min, max, alpha = 1.16) {
    var probabilities = []; // probabilities 
    for (var k = min; k <= max; ++k) {
        probabilities.push(1.0 / Math.pow(k, alpha)); // computed according to Paretto
    } // would be normalized by SJS

    var disc = SJS.Discrete(probabilities); // discrete sampler, returns value in the [0...probabilities.length-1] range
    q = disc.draw() + min; // back to [min...max] interval

    return q;
}

describe("Queues", function () {
    let signer = {
        "tester": null
    };
    let contract = {
        "queue": null,
        "priorityQueue": null,
    };

    async function set(verbose = true) {
        [signer.tester] = await ethers.getSigners();

        let balanceOfTestter = await signer.tester.getBalance() / (10 ** 18);
        console.log("Tester:\t", signer.tester.address, `(${balanceOfTestter} ETH)`);
    }

    async function deploy() {
        process.stdout.write("Deploy Queue");
        const Queue = await ethers.getContractFactory("CircularQueue", signer.tester);
        contract.queue = await Queue.deploy();
        await contract.queue.deployed();
        console.log(":\t", contract.queue.address);

        process.stdout.write("Deploy PriorityQueue");
        const PriorityQueue = await ethers.getContractFactory("PriorityQueue", signer.tester);
        contract.priorityQueue = await PriorityQueue.deploy();
        await contract.priorityQueue.deployed();
        console.log(":\t", contract.priorityQueue.address);
    }

    describe("Queue", function () {
        it("Push", async function () {
            await set();
            await deploy();

            for (i = 0; i < ITER; i++) {
                let txRes = await contract.queue.push(sample);
                await txRes.wait();
            }
        });
        it("Pop", async function () {
            for (i = 0; i < ITER; i++) {
                let txRes = await contract.queue.pop();
                await txRes.wait();
            }
        });
    });

    describe("PriorityQueue", function () {
        it("Push", async function () {
            // await set();
            // await deploy();

            for (i = 0; i < ITER; i++) {
                let txRes = await contract.priorityQueue.push(
                    getRandomIntInclusivePareto(1, SIZE),
                    sample
                );
                await txRes.wait();
            }
        });
        it("Pop", async function () {
            for (i = 0; i < ITER; i++) {
                let txRes = await contract.priorityQueue.pop();
                await txRes.wait();
            }
        });
    });
});
