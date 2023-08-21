// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import '../base/Level-06.sol';
import './Token.sol';

import "hardhat/console.sol";

contract TokenFactory is Level {
  
  // emit result of validateInstance
  event IsSolved(bool indexed isSolved);

  uint supply = 21000000;
  uint playerSupply = 20;

  function createInstance(address _player) override public payable returns (address) {
    Token token = new Token(supply);
    token.transfer(_player, playerSupply);

    emit GetInstanceAddress(address(token));

    return address(token);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    Token token = Token(_instance);

    emit IsSolved(token.balanceOf(_player) > playerSupply);

    return token.balanceOf(_player) > playerSupply;
  }
}

