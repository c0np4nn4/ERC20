const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Transfer Test", function() {
  let MyToken, myToken, owner, addr1, addr2;

  beforeEach(async function() {
    MyToken = await ethers.getContractFactory("MyToken");

    [owner, addr1, addr2, _] = await ethers.getSigners();

    myToken = await MyToken.deploy(100);
    await myToken.deployed();
  });

  describe("Transfer", function() {
    it("Should transfer tokens between accounts", async function() {
      await myToken.mint(owner.address, "10");

      let ownerBalance = await myToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal("10");

      await myToken.connect(owner).transfer(addr1.address, "6");

      ownerBalance = await myToken.balanceOf(owner.address);
      let addr1Balance = await myToken.balanceOf(addr1.address);

      expect(ownerBalance).to.equal("4");
      expect(addr1Balance).to.equal("6");
    });
  });
});

