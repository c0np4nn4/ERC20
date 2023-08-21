// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../base/Level.sol';
import './CoinFlip.sol';

import "hardhat/console.sol";

contract CoinFlipFactory is Level {
  function createInstance(address) override public payable returns (address) {
    address res = address(new CoinFlip());

    emit GetInstanceAddress(res);

    return res;
  }

  function validateInstance(address payable _instance, address) override public view returns (bool) {
    CoinFlip instance = CoinFlip(_instance);
    return instance.consecutiveWins() >= 10;
  }
}
