// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../base/Level.sol';
import './Telephone.sol';
import "hardhat/console.sol";

contract TelephoneFactory is Level {

  function createInstance(address) override public payable returns (address) {
    address res = address(new Telephone());

    emit GetInstanceAddress(res);

    return address(res);
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    Telephone instance = Telephone(_instance);
    return instance.owner() == _player;
  }
}
