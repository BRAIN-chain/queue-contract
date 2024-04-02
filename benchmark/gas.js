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
        const Queue = await ethers.getContractFactory("QueueHelper", signer.tester);
        contract.queue = await Queue.deploy();
        await contract.queue.deployed();
        console.log(":\t", contract.queue.address);

        process.stdout.write("Deploy PriorityQueue");
        const PriorityQueue = await ethers.getContractFactory("PriorityQueueHelper", signer.tester);
        contract.priorityQueue = await PriorityQueue.deploy();
        await contract.priorityQueue.deployed();
        console.log(":\t", contract.priorityQueue.address);
    }

    async function result(gasUsed) {
        let gasUsedFloat = gasUsed.map((e) => {
            return ethers.FixedNumber.fromString(e.toString());
        })

        let sum = new ethers.BigNumber.from(0);
        let minGasUsed = gasUsed[0];
        let maxGasUsed = gasUsed[0];
        let averageGasUsed;
        let sdGasUsed;
        let medianGasUsed;

        // Calculate min, max, and sum
        for (let num of gasUsed) {
            if (num.lt(minGasUsed)) minGasUsed = num;
            if (num.gt(maxGasUsed)) maxGasUsed = num;
            sum = sum.add(num);
        }

        // Calculate average
        averageGasUsed =
            ethers.FixedNumber.fromString(sum.toString())
                .divUnsafe(ethers.FixedNumber.from(gasUsed.length));

        // Calculate standard deviation
        const ONE = ethers.FixedNumber.from(1);
        const TWO = ethers.FixedNumber.from(2);
        function sqrt(value) {
            x = ethers.FixedNumber.from(value);
            let z = x.addUnsafe(ONE).divUnsafe(TWO);
            let y = x;
            while (z.subUnsafe(y).isNegative()) {
                y = z;
                z = x.divUnsafe(z).addUnsafe(z).divUnsafe(TWO);
            }
            return y.divUnsafe(ethers.FixedNumber.from(10 ** 9));
        }

        const varGasUsed = (gasUsedFloat.reduce(
            (p, c) => {
                return p.addUnsafe(
                    (c.subUnsafe(averageGasUsed))
                        .mulUnsafe(c.subUnsafe(averageGasUsed))
                )
            },
            new ethers.FixedNumber.from(0)
        )).divUnsafe(ethers.FixedNumber.from(gasUsedFloat.length));
        sdGasUsed = sqrt(varGasUsed);

        // Calculate median
        function compareBigNumbers(a, b) {
            if (a.gt(b)) {
                return 1;
            } else if (a.lt(b)) {
                return -1;
            } else {
                return 0;
            }
        }
        gasUsed.sort(compareBigNumbers);
        if (gasUsed.length % 2 === 0) {
            let mid1 = gasUsed[gasUsed.length / 2 - 1];
            let mid2 = gasUsed[gasUsed.length / 2];
            medianGasUsed =
                ethers.FixedNumber.fromString(mid1.toString())
                    .addUnsafe(ethers.FixedNumber.fromString(mid2.toString()))
                    .divUnsafe(ethers.FixedNumber.from(2));
        } else {
            medianGasUsed = gasUsed[Math.floor(gasUsed.length / 2)];
        }

        // console.log(gasUsed);
        console.log(`Min: ${minGasUsed}`);
        console.log(`Max: ${maxGasUsed}`);
        console.log(`Average (std): ${averageGasUsed} (${sdGasUsed} = sqrt(${varGasUsed}))`);
        console.log(`Median: ${medianGasUsed}`);
    }

    describe("Queue", function () {
        it("Push", async function () {
            await set();
            await deploy();

            let gasUsed = [];

            for (i = 0; i < ITER; i++) {
                let txRes = await contract.queue.push(sample);
                await txRes.wait();

                gasUsed.push(await contract.queue.gasUsed());
            }

            result(gasUsed);
        });
        it("Pop", async function () {
            let gasUsed = [];

            for (i = 0; i < ITER; i++) {
                let txRes = await contract.queue.pop();
                await txRes.wait();

                gasUsed.push(await contract.queue.gasUsed());
            }

            result(gasUsed);
        });
    });

    describe("PriorityQueue", function () {
        it("Push", async function () {
            // await set();
            // await deploy();

            let gasUsed = [];

            for (i = 0; i < ITER; i++) {
                let txRes = await contract.priorityQueue.push(
                    getRandomIntInclusivePareto(1, SIZE),
                    sample
                );
                await txRes.wait();

                gasUsed.push(await contract.priorityQueue.gasUsed());
            }

            result(gasUsed);
        });
        it("Pop", async function () {
            let gasUsed = [];

            for (i = 0; i < ITER; i++) {
                let txRes = await contract.priorityQueue.pop();
                await txRes.wait();

                gasUsed.push(await contract.priorityQueue.gasUsed());
            }

            result(gasUsed);
        });
    });
});
