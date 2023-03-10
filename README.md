# Queue

PriorityQueue and CircularQueue.

- solc: 0.6.12

# Test

```bash
$ npx hardhat node
# or
$ ganachi-cli
```

```bash
$ npx hardhat test benchmark/Queues.js --network localhost

  Queues
    Queue
Tester:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Deploy Queue:    0x129955157BE2622EbB0a7bEBC990216C63069973
Deploy PriorityQueue:    0x2E80eF24fA1938D4e2F01A564CaC98c77AaAfaa2
      ✓ Push (43314229 gas)
      ✓ Pop (23830071 gas)
    PriorityQueue
      ✓ Push (75137628 gas)
      ✓ Pop (82689318 gas)

·----------------------------|---------------------------|-------------|----------------------------·
|    Solc version: 0.6.12    ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·····························|···························|·············|·····························
|  Methods                                                                                          │
··················|··········|·············|·············|·············|··············|··············
|  Contract       ·  Method  ·  Min        ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
··················|··········|·············|·············|·············|··············|··············
|  CircularQueue  ·  pop     ·      29013  ·      46113  ·      29034  ·         820  ·          -  │
··················|··········|·············|·············|·············|··············|··············
|  CircularQueue  ·  push    ·      51324  ·      68424  ·      51345  ·         820  ·          -  │
··················|··········|·············|·············|·············|··············|··············
|  PriorityQueue  ·  pop     ·      34909  ·     116942  ·     100861  ·         819  ·          -  │
··················|··········|·············|·············|·············|··············|··············
|  PriorityQueue  ·  push    ·      84353  ·     137955  ·      91699  ·         820  ·          -  │
··················|··········|·············|·············|·············|··············|··············
|  Deployments               ·                                         ·  % of limit  ·             │
·····························|·············|·············|·············|··············|··············
|  CircularQueue             ·          -  ·          -  ·     165973  ·       2.5 %  ·          -  │
·····························|·············|·············|·············|··············|··············
|  PriorityQueue             ·          -  ·          -  ·     379664  ·       5.7 %  ·          -  │
·----------------------------|-------------|-------------|-------------|--------------|-------------·

  4 passing (8m)
```

# References

- https://github.com/omgnetwork/plasma-mvp/blob/master/plasma/root_chain/contracts/PriorityQueue.sol
- https://github.com/zmitton/eth-heap
