// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Faucet {
    uint256 public balance;

    constructor() {
        balance = 0;
    }

    function withdraw(uint256 amount) public payable {
        payable(tx.origin).transfer(amount);
        balance -= amount;
    }

    receive() external payable {
        balance += msg.value;
    }
}
