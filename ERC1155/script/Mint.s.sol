// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { WarlusERC1155NFT  } from "src/MyToken.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        WarlusERC1155NFT nft = WarlusERC1155NFT(address(0x98eDDadCfde04dC22a0e62119617e74a6Bc77313));

        // address account, 
        // uint256 id, 
        // uint256 amount, 
        // string memory tokenURI


        nft.mint(
          msg.sender,
          1,
          1,
          "whoami"
        );

        vm.stopBroadcast();
    }
}
