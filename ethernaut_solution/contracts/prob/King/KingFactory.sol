// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "../utils/Log.sol";
import "./King.sol";

contract KingFactory is Level, Log {
    uint256 public insertCoin = 0.001 ether;

    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        // _player;
        // require(msg.value >= insertCoin, "Must send at least 0.001 ETH");
        // return address((new King){value: msg.value}());

        _player;
        require(msg.value >= insertCoin, "Must send at least 0.001 ETH");

        King king = (new King){value: msg.value}();

        emit GetInstanceAddress(address(king));

        return address(king);
    }

    function validateInstance(address payable _instance, address _player)
        public
        override
        returns (bool)
    {
        _player;
        King instance = King(_instance);
        (bool result, ) = address(instance).call{value: 0}("");
        !result;

        emit GetResult(instance._king() != address(this));

        return instance._king() != address(this);
    }

    receive() external payable {}
}
