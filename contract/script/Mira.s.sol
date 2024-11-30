// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console} from "forge-std/Script.sol";
import {Mira} from "../src/Mira.sol";
contract MiraScript is Script {
    Mira public miraContract;
    function setUp() public {
        // If you need to set up any prerequisites before deployment
    }
    function run() public {
        // Replace these with actual addresses of deployed contracts
        address wpTokenAddress = address(0x6558800901ecd6242bd76AE054eE602ED5E2E65b);
        address lpTokenAddress = address(0x0FF543c2E1cf1cD52AEbbF24f84E83dEC335cb72);
        address oracleAddress = address(0xa09AeD8Ca8e3a2cC85590d242C76b65402ec0589);
        // Start broadcasting transactions
        vm.startBroadcast();
        // Deploy the Mira contract
        miraContract = new Mira(
            wpTokenAddress,
            lpTokenAddress,
            oracleAddress
        );
        // Log the deployed contract address
        console.log("Mira Contract deployed at:", address(miraContract));
        // Stop broadcasting
        vm.stopBroadcast();
    }
}