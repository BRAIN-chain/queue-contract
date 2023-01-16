const { expect } = require("chai");

const ITER = 169; // one ROUND // TODO
const SIZE = 500; // random priority: 1~SIZE // TODO
const sample = "0xde263896c9466aa7aa6da0b1a41c77a277e4eb3bd01a111e7803f64fe2d8602c";

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
            for (i = 0; i < ITER; i++) {
                let txRes = await contract.priorityQueue.push(
                    Math.floor(Math.random() * SIZE + 1),
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
