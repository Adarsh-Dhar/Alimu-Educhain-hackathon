// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console} from "forge-std/Script.sol";
import {Yield} from "../src/Yield.sol";
contract YieldScript is Script {
    Yield public yieldContract;
    function setUp() public {
        // If you need to set up any prerequisites before deployment
    }
    function run() public {
        // Replace these with actual addresses of deployed contracts
        
        // Start broadcasting transactions
        vm.startBroadcast();
        // Deploy the Instructor contract
        yieldContract = new Yield();
        // Log the deployed contract address
        console.log("Instructor Contract deployed at:", address(yieldContract));
        // Stop broadcasting
        vm.stopBroadcast();
    }
}