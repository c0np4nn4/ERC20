// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "../utils/Log.sol";
import "./GatekeeperTwo.sol";

contract GatekeeperTwoFactory is Level, Log {
    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        _player;
        GatekeeperTwo instance = new GatekeeperTwo();

        emit GetInstanceAddress(address(instance));

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player)
        public
        view
        override
        returns (bool)
    {
        GatekeeperTwo instance = GatekeeperTwo(_instance);
        return instance.entrant() == _player;
    }
}
