// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "../utils/Log.sol";
import "./CoinFlip.sol";

import "hardhat/console.sol";

contract CoinFlipFactory is Level, Log {
    function createInstance(address) public payable override returns (address) {
        address res = address(new CoinFlip());

        emit GetInstanceAddress(res);

        return res;
    }

    function validateInstance(address payable _instance, address)
        public
        view
        override
        returns (bool)
    {
        CoinFlip instance = CoinFlip(_instance);
        return instance.consecutiveWins() >= 10;
    }
}
