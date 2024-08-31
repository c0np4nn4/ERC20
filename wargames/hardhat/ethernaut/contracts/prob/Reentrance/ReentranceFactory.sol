// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../base/Level-06.sol";
import "../utils/Log-06.sol";
import "./Reentrance.sol";

contract ReentranceFactory is Level, Log {
    uint256 public insertCoin = 0.001 ether;

    function createInstance(address _player)
        public
        payable
        override
        returns (address)
    {
        _player;
        require(msg.value >= insertCoin, "Insert at least 0.001 ether");

        Reentrance instance = new Reentrance();

        require(
            address(this).balance >= insertCoin,
            "balance should be more than 0.001 ether"
        );

        emit GetInstanceAddress(address(instance));

        address(instance).transfer(insertCoin);

        return address(instance);
    }

    function validateInstance(address payable _instance, address _player)
        public
        override
        returns (bool)
    {
        _player;
        Reentrance instance = Reentrance(_instance);

        emit GetResult(address(instance).balance == 0);

        return address(instance).balance == 0;
    }

    receive() external payable {}
}
