// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import {CircularQueue} from "./Queue.sol";

contract QueueHelper is CircularQueue {
    uint256 public gasUsed;

    function push(bytes32 hashedValue) public override {
        uint256 startGas = gasleft();

        super.push(hashedValue);

        gasUsed = startGas - gasleft();
    }

    function pop() public override returns (bytes32) {
        uint256 startGas = gasleft();

        super.pop();

        gasUsed = startGas - gasleft();
    }
}
