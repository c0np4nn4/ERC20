pragma solidity >=0.4.22 <0.7.0;

contract Auction {
    address payable public beneficiary;
    address public highestBidder;
    
    uint public auctionEndTime;
    uint public highestBid;

    mapping(address => uint) pendingReturns;

    // added
    mapping(address => uint) curBid;
    mapping(address => uint) maxBid;

    bool ended;

    // added
    address[] autoBidder;

    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

 
    constructor(
        uint _biddingTime,
        address payable _beneficiary
    ) public {
        beneficiary = _beneficiary;

        auctionEndTime = now + _biddingTime;
    }

 
    function bid() public payable {
      require(
        now <= auctionEndTime,
        "Auction already ended."
      );

      require(
        msg.value > highestBid,
        "There already is a higher bid."
      );

      // (2) extending auctionEndTime
      if (auctionEndTime - now < 10) {
        // plus 30 seconds
        auctionEndTime += 30;
      }


      if (highestBid != 0) {
        pendingReturns[highestBidder] += highestBid;
      }

      highestBidder = msg.sender;
      highestBid = msg.value;

      // leave it for debugging
      emit HighestBidIncreased(msg.sender, msg.value);

      // (1) trigger auto bidding

      autoBidding();
    }

    // (1) another bid function supporting auto bidding
    function bid(uint _initBid, uint _maxBid) public payable {
      // (1) added
      require(
        msg.value == _maxBid,
        "Sent value should be same with _maxBid"
      );

      // (1) added
      require(
        autoBidder.length <= 10,
        "Auto Bidders are limited to 10."
      );

      require(
        now <= auctionEndTime,
        "Auction already ended."
      );

      require(
        _initBid > highestBid,
        "There already is a higher bid."
      );

      // (2) extending auctionEndTime
      if (auctionEndTime - now < 10) {
        // plus 30 seconds
        auctionEndTime += 30;
      }

      // for withdraw
      if (highestBid != 0) {
        pendingReturns[highestBidder] += highestBid;
      }

      highestBidder = msg.sender;
      highestBid = _initBid;

      curBid[msg.sender] = _initBid;
      maxBid[msg.sender] = _maxBid;

      autoBidder.push(msg.sender);

      emit HighestBidIncreased(msg.sender, msg.value);
      
      // (1) trigger auto bidding
      autoBidding();
    }

    // (1) auto bidding feature
    function autoBidding() internal {
      for (uint i = 0; i < autoBidder.length; i++) {
        if (highestBidder != autoBidder[i]) {
          if (maxBid[autoBidder[i]] >= highestBid + 1 wei) {
            pendingReturns[highestBidder] += highestBid;

            highestBidder = autoBidder[i];
            highestBid = highestBid + 1 wei;

            emit HighestBidIncreased(highestBidder, highestBid);
          }
        }
      }
    }

    /// Withdraw a bid that was overbid.
    function withdraw() public returns (bool) {

      // (1) added for checking auto bidder
      bool isAutoBidder = false;

      for (uint i = 0; i < autoBidder.length; i++) {
        if (autoBidder[i] == msg.sender) {
          isAutoBidder = true;
        }
      }

      if (isAutoBidder) {
        uint amount;
        if (highestBidder == msg.sender) {
          amount = maxBid[msg.sender] - highestBid;
        } else {
          amount = maxBid[msg.sender];
        }

        if (amount > 0) {
          pendingReturns[msg.sender] = 0;

          if (!msg.sender.send(amount)) {
            pendingReturns[msg.sender] = amount;

            return false;
          }
        }

      } else {
        uint amount = pendingReturns[msg.sender];

        if (amount > 0) {
          pendingReturns[msg.sender] = 0;

          if (!msg.sender.send(amount)) {
            pendingReturns[msg.sender] = amount;

            return false;
          }
        }

      }

      return true;
    }

    function auctionEnd() public {
        require(now >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "auctionEnd has already been called.");

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }
}
