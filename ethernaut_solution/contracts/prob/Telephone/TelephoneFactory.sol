// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "../utils/Log.sol";

import "./Telephone.sol";

import "hardhat/console.sol";

contract TelephoneFactory is Level, Log {
    function createInstance(address) public payable override returns (address) {
        address res = address(new Telephone());

        emit GetInstanceAddress(res);

        return address(res);
    }

    function validateInstance(address payable _instance, address _player)
        public
        view
        override
        returns (bool)
    {
        Telephone instance = Telephone(_instance);
        return instance.owner() == _player;
    }
}
