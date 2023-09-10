// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "../utils/Log.sol";

import "./Fallback.sol";

import "hardhat/console.sol";

contract FallbackFactory is Level, Log {
    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        _player;
        Fallback instance = new Fallback();

        emit GetInstanceAddress(address(instance));

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player)
        public
        view
        override
        returns (bool)
    {
        Fallback instance = Fallback(_instance);

        console.log("instance owner: ", instance.owner());
        console.log("player:         ", _player);

        return instance.owner() == _player && address(instance).balance == 0;
    }
}
