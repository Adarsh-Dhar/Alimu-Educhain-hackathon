// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {OracleMira} from "../src/Oracle.sol";

contract OracleMiraScript is Script {
    OracleMira public oracleMiraContract;

    function setUp() public {
        // Optional setup steps if needed
    }

    function run() public {
        // Pyth Network contract address (mainnet)
        // Note: Replace with the correct Pyth contract address for your target network
        address pythContractAddress = 0xDd24F84d36BF92C65F92307595335bdFab5Bbd21; // Ethereum Mainnet Pyth Network address

        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy the OracleMira contract
        oracleMiraContract = new OracleMira(
            pythContractAddress
        );

        // Log the deployed contract address
        console.log("OracleMira Contract deployed at:", address(oracleMiraContract));

        // Stop broadcasting
        vm.stopBroadcast();
    }
}