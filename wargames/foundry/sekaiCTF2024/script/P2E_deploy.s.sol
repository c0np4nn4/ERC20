// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// import {ArcadeMachine} from "../src/play-to-earn/ArcadeMachine.sol";
// import {Coin} from "../src/play-to-earn/Coin.sol";
import {Setup} from "../src/play-to-earn/Setup.sol";

import {Script} from "forge-std/Script.sol";

contract P2EScript is Script {
    // ArcadeMachine public arcadeMachine;
    // Coin public coin;
    Setup public setup;

    function run() public {
        vm.startBroadcast();


        setup = new Setup{value: 20 ether}();

        vm.stopBroadcast();
    }
}

