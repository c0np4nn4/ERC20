// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface Building {
    function isLastFloor(uint256) external returns (bool);
}

contract Elevator {
    bool public top;
    uint256 public floor;

    function goTo(uint256 _floor) public {
        Building building = Building(msg.sender);

        console.log("++++ Building address:", address(building));

        if (!building.isLastFloor(_floor)) {
            console.log("++++ building.isLastFloor() == false");
            floor = _floor;
            top = building.isLastFloor(floor);
            console.log("++++ building.isLastFloor() == true");
        }
    }
}
