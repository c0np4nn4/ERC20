// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "../utils/Log.sol";
import "./GatekeeperOne.sol";

contract GatekeeperOneFactory is Level, Log {
    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        _player;
        GatekeeperOne instance = new GatekeeperOne();

        emit GetInstanceAddress(address(instance));

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player)
        public
        view
        override
        returns (bool)
    {
        GatekeeperOne instance = GatekeeperOne(_instance);
        return instance.entrant() == _player;
    }
}
