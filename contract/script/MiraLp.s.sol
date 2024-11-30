// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MiraLP} from "../src/MiraLP.sol";

contract DeployMiraLP is Script {
    MiraLP public miraLPToken;

    function setUp() public {
        // If you need to set up any prerequisites before deployment
    }

    function run() public {
        // Assume sUSDe token address is needed as a constructor parameter
        // Replace with actual sUSDe token address
        address sUSDe = address(0x1B6877c6Dac4b6De4c5817925DC40E2BfdAFc01b);

        // Start broadcasting transactions
        vm.startBroadcast();
        
        // Deploy the MiraLP token contract
        miraLPToken = new MiraLP(sUSDe);
        
        // Log the deployed contract address
        console.log("MiraLP Token deployed at:", address(miraLPToken));
        
        // Stop broadcasting
        vm.stopBroadcast();
    }
}