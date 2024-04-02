// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import {PriorityQueue} from "./PriorityQueue.sol";

contract PriorityQueueHelper is PriorityQueue {
    uint256 public gasUsed;

    function push(uint256 priority, bytes32 hashedValue) public override {
        uint256 startGas = gasleft();

        super.push(priority, hashedValue);

        gasUsed = startGas - gasleft();
    }

    function pop() public override returns (uint256, bytes32) {
        uint256 startGas = gasleft();

        super.pop();

        gasUsed = startGas - gasleft();
    }
}
