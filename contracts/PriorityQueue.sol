// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./SafeMath.sol";

/**
 * References:
 *
 * - https://github.com/omgnetwork/plasma-mvp/blob/master/plasma/root_chain/contracts/PriorityQueue.sol
 * - https://github.com/zmitton/eth-heap
 *
 * @notice Now top() returns the highest priority. No owner, Remove unnecessary check. Solc version 0.5 -> 0.6 migrated.
 * @dev Treat priority and value as uint128;
 */
contract PriorityQueue {
    using SafeMath for uint256;

    uint256 constant MAX_PRIORITY = uint256(uint128(-1));
    uint256 constant MAX_PRIORITY_MINUS_ONE = MAX_PRIORITY - 1;

    uint256[] heapList;
    uint256 public currentSize;

    mapping(uint128 => bytes32) private data;
    uint128 dataCount;

    constructor() public {
        heapList = [0];
        // currentSize = 0;
    }

    function push(uint256 priority, bytes32 hashedValue) public virtual {
        require(
            priority < MAX_PRIORITY_MINUS_ONE,
            "PriorityQueue::push: Invalid priority."
        );

        uint256 element = ((MAX_PRIORITY - priority) << 128) |
            uint256(dataCount);
        heapList.push(element);
        currentSize = currentSize + 1; // currentSize = currentSize.add(1);
        _percUp(currentSize);
        data[dataCount] = hashedValue;
        dataCount++;
    }

    function top() external view returns (uint256, bytes32) {
        (uint256 prioirity, uint128 position) = _splitElement(heapList[1]);
        return (prioirity, data[position]);
    }

    function pop() public virtual returns (uint256, bytes32) {
        uint256 retVal = heapList[1];
        heapList[1] = heapList[currentSize];
        delete heapList[currentSize];
        currentSize = currentSize.sub(1);
        _percDown(1);
        heapList.pop();
        (uint256 prioirity, uint128 position) = _splitElement(retVal);
        bytes32 ret = data[position];
        delete data[position];
        return (prioirity, ret);
    }

    function _minChild(uint256 _index) private view returns (uint256) {
        if (_index * 2 + 1 > currentSize) {
            return _index * 2;
        } else {
            if (heapList[_index * 2] < heapList[_index * 2 + 1]) {
                return _index * 2;
            } else {
                return _index * 2 + 1;
            }
        }
    }

    function _percUp(uint256 _index) private {
        uint256 index = _index;
        uint256 j = index;
        uint256 newVal = heapList[index];
        while (newVal < heapList[index.div(2)]) {
            heapList[index] = heapList[index.div(2)];
            index = index.div(2);
        }
        if (index != j) heapList[index] = newVal;
    }

    function _percDown(uint256 _index) private {
        uint256 index = _index;
        uint256 j = index;
        uint256 newVal = heapList[index];
        uint256 mc = _minChild(index);
        while (mc <= currentSize && newVal > heapList[mc]) {
            heapList[index] = heapList[mc];
            index = mc;
            mc = _minChild(index);
        }
        if (index != j) heapList[index] = newVal;
    }

    function _splitElement(
        uint256 _element
    ) private pure returns (uint256, uint128) {
        uint256 priority = _element >> 128;
        uint128 value = uint128(_element);
        return (MAX_PRIORITY - priority, value);
    }
}
