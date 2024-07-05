// SPDX-License-Identifier: UNLICENSED
pragma experimental ABIEncoderV2;
pragma solidity ^0.6.12;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "src/AutoBid.sol";

contract AutoBidTest is Test {
    Auction auction;

    address payable owner = address(0x11111111);
    address payable brian = address(0x22222222);
    address payable chris = address(0x33333333);
    address payable denny = address(0x44444444);

    function setUp() public {
        // new Token with cap: 100
        vm.deal(owner, 100 wei);
        vm.deal(brian, 100 wei);
        vm.deal(chris, 100 wei);
        vm.deal(denny, 100 wei);

        // caller: alice
        vm.prank(owner);

        auction = new Auction(100, owner);
    }

    function testBidding() public {
      vm.prank(brian);
      auction.bid{value: 1 wei}();

      vm.prank(chris);
      auction.bid{value: 2 wei}();
    }

    function testAuctionEnd() public {
      vm.prank(brian);
      auction.bid{value: 1 wei}();

      vm.prank(chris);
      auction.bid{value: 2 wei}();

      vm.warp(101);
      vm.prank(owner);
      auction.auctionEnd();
    }

    function testWithdraw() public {
      vm.prank(brian);
      auction.bid{value: 1 wei}();

      vm.prank(chris);
      auction.bid{value: 2 wei}();

      vm.warp(101);
      vm.prank(owner);
      auction.auctionEnd();


      console.log("Balance of brian before withdraw: %i", address(brian).balance);

      vm.prank(brian);
      auction.withdraw();

      console.log("Balance of brian after  withdraw: %i", address(brian).balance);
    }

    function testAutoBid() public {
      vm.prank(brian);
      auction.bid{value: 30 wei}(10 wei, 30 wei);

      vm.prank(chris);
      auction.bid{value: 20 wei}();

      vm.prank(denny);
      auction.bid{value: 28 wei}(28 wei, 28 wei);

      vm.warp(101);
      vm.prank(owner);

      // highest bidder: brian(0x22222222)
      // highest bid: 29 wei
      auction.auctionEnd();

      // should be refunded 1 wei
      vm.prank(brian);
      auction.withdraw();

      // should be refunded 20 wei
      vm.prank(chris);
      auction.withdraw();

      // should be refunded 28 wei
      vm.prank(denny);
      auction.withdraw();
    }

    function testBidTimeExtension() public {
      console.log("auction end time: ", auction.auctionEndTime());
      vm.warp(99);

      vm.prank(brian);
      auction.bid{value: 100 wei}();

      console.log("auction end time: ", auction.auctionEndTime());
    }

}
