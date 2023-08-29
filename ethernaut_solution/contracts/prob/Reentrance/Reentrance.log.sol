// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "openzeppelin-contracts-06/math/SafeMath.sol";

import "hardhat/console.sol";

contract ReentranceLog {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;

    constructor() public {
        console.log(
            "[Reentrance:constructor] 1111 contract balance: ",
            address(this).balance
        );
    }

    function donate(address _to) public payable {
        console.log(
            "[Reentrance:donate] contract received balance: ",
            msg.value
        );

        console.log(
            "[Reentrance:donate] 1111 attacker balance: ",
            balances[msg.sender]
        );

        console.log(
            "[Reentrance:donate] 1111 contract balance: ",
            address(this).balance
        );

        balances[_to] = balances[_to].add(msg.value);

        console.log(
            "[Reentrance:donate] 2222 attacker balance: ",
            balances[msg.sender]
        );

        console.log(
            "[Reentrance:donate] 2222 contract balance: ",
            address(this).balance
        );
    }

    function balanceOf(address _who) public view returns (uint256 balance) {
        return balances[_who];
    }

    function withdraw(uint256 _amount) public {
        console.log("\n[Reentrance:withdraw] withdraw, ", _amount, "wei");
        if (balances[msg.sender] >= _amount) {
            console.log("[Reentrance:withdraw] check, balance >= amount");

            (bool result, ) = msg.sender.call{value: _amount}("");

            console.log("\n[Reentrance:withdraw] result:", result);

            if (result) {
                _amount;
            }

            console.log("[Reentrance:withdraw] substraction!!!");

            console.log(
                "[Reentrance:withdraw] 1111 attacker balance: ",
                balances[msg.sender]
            );

            console.log(
                "[Reentrance:withdraw] 1111 contract balance: ",
                address(this).balance
            );

            balances[msg.sender] -= _amount;

            console.log(
                "[Reentrance:withdraw] 2222 attacker balance: ",
                balances[msg.sender]
            );

            console.log(
                "[Reentrance:withdraw] 2222 contract balance: ",
                address(this).balance
            );
        }
    }

    receive() external payable {
        console.log(
            "[Reentrance:receive] contract received balance: ",
            msg.value
        );
    }
}
