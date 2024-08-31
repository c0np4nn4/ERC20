// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../base/Level-06.sol";
import "../utils/Log-06.sol";
import "./Token.sol";

import "hardhat/console.sol";

contract TokenFactory is Level, Log {
    // emit result of validateInstance
    event IsSolved(bool indexed isSolved);

    uint256 supply = 21000000;
    uint256 playerSupply = 20;

    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        Token token = new Token(supply);
        token.transfer(_player, playerSupply);

        emit GetInstanceAddress(address(token));

        return address(token);
    }

    function validateInstance(address payable _instance, address _player)
        public
        override
        returns (bool)
    {
        Token token = Token(_instance);

        // this line is added by c0np4nn4
        emit IsSolved(token.balanceOf(_player) > playerSupply);

        return token.balanceOf(_player) > playerSupply;
    }
}
