// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title IYield
 * @dev Interface for interacting with the Yield contract
 */
interface IYield {
    function stake() external payable;
    function unstake(uint256 amount) external;
    function withdrawYield() external;
    function calculateYieldTotal(address user) external view returns (uint256);
    function calculateYieldTime(address user) external view returns (uint256);
}