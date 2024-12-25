// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console} from "forge-std/Script.sol";
import {Learn} from "../src/Learn.sol";
contract LearnScript is Script {
    Learn public learnContract;
    function setUp() public {
        // If you need to set up any prerequisites before deployment
    }
    function run() public {
        // Replace these with actual addresses of deployed contracts
        address learnAddress = address(0xD7e15b361c435602087332f883387Ad84a74D71D);
       
        // Start broadcasting transactions
        vm.startBroadcast();
        // Deploy the Instructor contract
        learnContract = new Learn(learnAddress);
        // Log the deployed contract address
        console.log("Instructor Contract deployed at:", address(learnContract));
        // Stop broadcasting
        vm.stopBroadcast();
    }
}