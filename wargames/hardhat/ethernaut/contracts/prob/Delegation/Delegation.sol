// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Delegate {
    address public owner;

    constructor(address _owner) {
        owner = _owner;

        // line below is added by c0np4nn4
        console.log("++++ `Delegate` has been deployed");
    }

    function pwn() public {
        owner = msg.sender;

        // line below is added by c0np4nn4
        console.log("\n++[Delegate pwn()]");
        console.log("++++(2) pwn() has been called");
        console.log("++++(2) msg.data: ", string(msg.data));
        console.log("++++(2) msg.sender: ", msg.sender);
    }
}

contract Delegation {
    address public owner;
    Delegate delegate;

    constructor(address _delegateAddress) {
        delegate = Delegate(_delegateAddress);
        owner = msg.sender;

        // lines below are added by c0np4nn4
        console.log("++++ `Delegation` has been deployed");
        console.log("++++ Address of `delegate`: ", address(delegate));
    }

    fallback() external {
        // lines below are added by c0np4nn4
        console.log("\n++[Delegation pwn()]");
        console.log("++++(1) fallback() has been called");
        console.log("++++(1) msg.data: ", string(msg.data));
        console.log("++++(1) msg.sender: ", msg.sender);

        (bool result, ) = address(delegate).delegatecall(msg.data);

        if (result) {
            this;
        }
    }
}
