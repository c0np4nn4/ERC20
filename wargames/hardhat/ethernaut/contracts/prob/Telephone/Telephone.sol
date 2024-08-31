// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Telephone {
    address public owner;

    constructor() {
        console.log("++++[Telephone constructor()] tx.origin:  ", tx.origin);
        console.log("++++[Telephone constructor()] msg.sender: ", msg.sender);
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        console.log("++++(2) [Telephone changeOwner()] tx.origin:  ", tx.origin);
        console.log("++++(2) [Telephone changeOwner()] msg.sender: ", msg.sender);

        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}
