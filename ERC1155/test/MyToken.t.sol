// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken myToken;

    address alice = address(0x1);
    address brian = address(0x2);
    address sofia = address(0x3);

    function setUp() public {
        // new Token with cap: 100
        vm.deal(alice, 100);

        // caller: alice
        vm.prank(alice);

        myToken = new MyToken(100);
    }

    function testSetMint() public {
        vm.prank(alice);
        myToken.setMinter(brian, true);
    }

    function testMint() public {
        vm.startPrank(alice);
        myToken.setMinter(brian, true);
        vm.stopPrank();

        vm.startPrank(brian);

        // after 1 day and 1 second
        vm.warp(1 days + 1 seconds);

        myToken.mint(sofia, 50);
        vm.stopPrank();

        assertEq(myToken.balanceOf(sofia), 50);
    }

    function testBurn() public {
        vm.startPrank(alice);
        myToken.setMinter(brian, true);
        vm.stopPrank();

        vm.startPrank(brian);

        // after 1 day and 1 second
        vm.warp(1 days + 1 seconds);

        myToken.mint(sofia, 50);
        vm.stopPrank();

        vm.startPrank(alice);
        myToken.burn(sofia, 20);

        assertEq(myToken.balanceOf(sofia), 30);
    }
}
