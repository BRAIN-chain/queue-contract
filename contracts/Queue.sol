// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

contract CircularQueue {
    uint256 constant SIZE = 1000;
    bytes32[SIZE] data;
    uint256 front;
    uint256 back;

    function length() external view returns (uint256) {
        return back - front;
    }

    function size() external pure returns (uint256) {
        return SIZE;
    }

    function push(bytes32 hashedValue) external {
        if ((back + 1) % SIZE == front) return;
        data[back] = hashedValue;
        back = (back + 1) % SIZE;
    }

    function top() external view returns (bytes32) {
        if (back == front) {
            return 0;
        }
        return data[front];
    }

    function pop() external returns (bytes32) {
        require(back != front, "CircularQueue::pop: No elements.");
        bytes32 r = data[front];
        delete data[front];
        front = (front + 1) % data.length;
        return r;
    }
}
