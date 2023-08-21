// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '../base/Level.sol';
import './Delegation.sol';

import "hardhat/console.sol";

contract DelegationFactory is Level {

  address delegateAddress;

  constructor() {
    console.log("++++ `DelegationFactory` has been deployed");

    Delegate newDelegate = new Delegate(address(0));

    delegateAddress = address(newDelegate);
  }

  function createInstance(address _player) override public payable returns (address) {
    console.log("++++ createInstace() has been called");

    _player;

    Delegation parity = new Delegation(delegateAddress);

    emit GetInstanceAddress(address(parity));

    return address(parity);
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    Delegation parity = Delegation(_instance);
    return parity.owner() == _player;
  }
}

