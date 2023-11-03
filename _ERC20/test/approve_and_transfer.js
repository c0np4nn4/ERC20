const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Approve and Transfer", function() {
  let MyToken, myToken, dev, owner, addr1, addr2;

  beforeEach(async function() {
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    myToken = await MyToken.deploy(100);
    await myToken.deployed();
  });

  describe("Deployment", function() {
    it("Should approve and transfer tokens between accounts using transferFrom", async function() {
      await myToken.mint(owner.address, "50");

      let ownerBalance = await myToken.balanceOf(owner.address);

      expect(ownerBalance).to.equal("50");

      await myToken.connect(owner).approve(addr1.address, "10");
      await myToken.connect(addr1).transferFrom(owner.address, addr2.address, "10");

      ownerBalance = await myToken.balanceOf(owner.address);
      let addr2Balance = await myToken.balanceOf(addr2.address);

      expect(ownerBalance).to.equal("40");
      expect(addr2Balance).to.equal("10");
    });
  });
});

