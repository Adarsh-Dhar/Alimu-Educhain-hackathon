// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Yield {
    struct YieldInfo {
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public yieldBalance;
    mapping(address => YieldInfo[]) public userYields;
    string public name = "AlimuYield";

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);
    event Buy(address indexed buyer, uint256 principal, uint256 yieldGenerated);

    function stake() public payable {
        require(msg.value > 0, "You cannot stake zero tokens");

        if(isStaking[msg.sender]) {
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            yieldBalance[msg.sender] += toTransfer;
        }

        stakingBalance[msg.sender] += msg.value;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;

        emit Stake(msg.sender, msg.value);
    }

    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] == true && 
            stakingBalance[msg.sender] >= amount,
            "Nothing to unstake"
        );

        uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        startTime[msg.sender] = block.timestamp;
        uint256 balTransfer = amount;
        stakingBalance[msg.sender] -= balTransfer;
        
        // Transfer ETH back to sender
        (bool sent, ) = payable(msg.sender).call{value: balTransfer}("");
        require(sent, "Failed to send ETH");

        yieldBalance[msg.sender] += yieldTransfer;

        if(stakingBalance[msg.sender] == 0) {
            isStaking[msg.sender] = false;
        }

        emit Unstake(msg.sender, balTransfer);
    }

    function calculateYieldTime(address user) public view returns(uint256) {
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400; // This represents a daily rate
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    }

    function withdrawYield() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);
        require(
            toTransfer > 0 || yieldBalance[msg.sender] > 0,
            "Nothing to withdraw"
        );

        if(yieldBalance[msg.sender] != 0) {
            uint256 oldBalance = yieldBalance[msg.sender];
            yieldBalance[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        
        // Transfer yield in ETH
        (bool sent, ) = payable(msg.sender).call{value: toTransfer}("");
        require(sent, "Failed to send yield");

        emit YieldWithdraw(msg.sender, toTransfer);
    }

    function buy() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Temporarily stake the amount
        stakingBalance[msg.sender] = msg.value;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        
        // Let it generate yield for 1 block
        uint256 generatedYield = calculateYieldTotal(msg.sender);
        
        // Store yield information
        userYields[msg.sender].push(YieldInfo({
            amount: generatedYield,
            timestamp: block.timestamp
        }));
        
        // Reset staking status
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
        
        // Transfer principal back to sender
        (bool sent, ) = payable(msg.sender).call{value: msg.value}("");
        require(sent, "Failed to return principal");
        
        emit Buy(msg.sender, msg.value, generatedYield);
    }

    function getUserYields(address user) public view returns (YieldInfo[] memory) {
        return userYields[user];
    }

    function getTotalAccumulatedYield(address user) public view returns (uint256) {
        YieldInfo[] memory yields = userYields[user];
        uint256 total = 0;
        
        for(uint256 i = 0; i < yields.length; i++) {
            total += yields[i].amount;
        }
        
        return total;
    }

    function withdrawBuyYields() public {
        uint256 totalYield = getTotalAccumulatedYield(msg.sender);
        require(totalYield > 0, "No yields to withdraw");
        
        // Clear the yields array
        delete userYields[msg.sender];
        
        // Transfer yield in ETH
        (bool sent, ) = payable(msg.sender).call{value: totalYield}("");
        require(sent, "Failed to send yield");
        
        emit YieldWithdraw(msg.sender, totalYield);
    }

    // Function to receive ETH
    receive() external payable {}
}