// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../base/Level.sol";
import "./Vault.sol";

import "hardhat/console.sol";

contract VaultFactory is Level {
    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        _player;
        bytes32 password = "A very strong secret password :)";

        string memory conv = bytes32ToString(password);
        console.log("++++ password: ", conv);

        Vault instance = new Vault(password);

        emit GetInstanceAddress(address(instance));

        return address(instance);
    }

    function validateInstance(address payable _instance, address)
        public
        view
        override
        returns (bool)
    {
        Vault instance = Vault(_instance);
        return !instance.locked();
    }
}
