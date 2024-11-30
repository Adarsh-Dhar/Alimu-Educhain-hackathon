// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MiraWP} from "../src/MiraWP.sol";

contract DeployMiraWP is Script {
    MiraWP public miraWPToken;

    function setUp() public {}

    function run() public {
        // Start broadcasting transactions
        vm.startBroadcast();
        
        // Deploy the MiraWP token contract
        miraWPToken = new MiraWP();
        
        // Log the deployed contract address
        console.log("MiraWP Token deployed at:", address(miraWPToken));
        
        // Stop broadcasting
        vm.stopBroadcast();
    }
}