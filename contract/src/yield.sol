// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

// Aave V3 Interfaces
interface IAavePool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
    function getReserveData(address asset) external view returns (
        uint256 configuration,
        uint256 liquidityIndex,
        uint256 variableBorrowIndex,
        uint256 currentLiquidityRate,
        uint256 currentVariableBorrowRate,
        uint256 currentStableBorrowRate,
        uint256 lastUpdateTimestamp,
        address aTokenAddress,
        address stableDebtTokenAddress,
        address variableDebtTokenAddress,
        address interestRateStrategyAddress,
        uint256 id
    );
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract AaveYieldCaptureProtocol is Ownable, ReentrancyGuard {
    // Mainnet addresses (replace with appropriate network addresses)
    address public constant AAVE_POOL_ADDRESS = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address public constant WETH_ADDRESS = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // Aave Pool contract
    IAavePool public aavePool;
    IWETH public weth;

    // Staking tracking
    mapping(address => uint256) public userStakes;
    uint256 public totalStaked;

    // Yield recipient
    address public yieldRecipient;

    // Staking parameters
    uint256 public constant MINIMUM_STAKE = 0.01 ether;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event YieldCaptured(uint256 totalYield);

    constructor(address _yieldRecipient) {
        require(_yieldRecipient != address(0), "Invalid yield recipient");
        yieldRecipient = _yieldRecipient;
        
        // Initialize Aave Pool and WETH contracts
        aavePool = IAavePool(AAVE_POOL_ADDRESS);
        weth = IWETH(WETH_ADDRESS);
    }

    // Stake function with Aave integration
    function stake() external payable nonReentrant {
        require(msg.value >= MINIMUM_STAKE, "Stake below minimum");
        
        // Convert ETH to WETH
        weth.deposit{value: msg.value}();
        
        // Approve Aave Pool to spend WETH
        IERC20(WETH_ADDRESS).approve(AAVE_POOL_ADDRESS, msg.value);
        
        // Supply to Aave Pool
        aavePool.supply(WETH_ADDRESS, msg.value, address(this), 0);
        
        // Track user stake
        userStakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    // Unstake function
    function unstake(uint256 amount) external nonReentrant {
        require(userStakes[msg.sender] >= amount, "Insufficient stake");

        // Update stake tracking
        userStakes[msg.sender] -= amount;
        totalStaked -= amount;

        // Withdraw from Aave Pool
        uint256 withdrawnAmount = aavePool.withdraw(WETH_ADDRESS, amount, address(this));
        
        // Convert WETH back to ETH
        weth.withdraw(withdrawnAmount);

        // Transfer back to user
        payable(msg.sender).transfer(withdrawnAmount);

        emit Unstaked(msg.sender, amount);
    }

    // Capture yield from Aave
    function captureYield() external nonReentrant {
        // Get current reserve data for WETH
        (,,,uint256 liquidityRate,,,,,,,,) = aavePool.getReserveData(WETH_ADDRESS);
        
        // Calculate potential yield (liquidityRate is in RAY units, divide accordingly)
        uint256 totalStakedInWETH = IERC20(WETH_ADDRESS).balanceOf(address(this));
        uint256 potentialYield = (totalStakedInWETH * liquidityRate) / 1e27;

        // Withdraw yield (if any)
        if (potentialYield > 0) {
            aavePool.withdraw(WETH_ADDRESS, potentialYield, address(this));
            
            // Convert WETH yield to ETH
            weth.withdraw(potentialYield);

            // Send yield to recipient
            payable(yieldRecipient).transfer(potentialYield);

            emit YieldCaptured(potentialYield);
        }
    }

    // View current yield rate
    function getCurrentYieldRate() external view returns (uint256) {
        (,,,uint256 liquidityRate,,,,,,,,) = aavePool.getReserveData(WETH_ADDRESS);
        return liquidityRate / 1e9; // Convert to more readable format
    }

    // Change yield recipient
    function changeYieldRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid recipient");
        yieldRecipient = _newRecipient;
    }

    // Allow receiving ETH
    receive() external payable {
        stake();
    }

    // Fallback function
    fallback() external payable {
        stake();
    }

    // Withdraw stuck funds (emergency)
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}