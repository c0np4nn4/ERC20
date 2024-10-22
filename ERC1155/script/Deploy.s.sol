// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { WarlusERC1155NFT  } from "src/MyToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // uint256 cap = 1000;

        // new MyToken(cap);

        WarlusERC1155NFT nft = new WarlusERC1155NFT();

        vm.stopBroadcast();
    }
}
