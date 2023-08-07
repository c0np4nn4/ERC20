const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("MyNFT", function() {
  let MyNFT, myNFT, owner, addr1;

  beforeEach(async function() {
    [owner, addr1] = await ethers.getSigners();

    MyNFT = await ethers.getContractFactory("MyNFT");

    myNFT = await MyNFT.deploy();

    await myNFT.deployed();
  });

  describe("mintNFT", function() {
    it("Should mint a new token", async function() {
      await myNFT.mintNFT(owner.address);

      expect(await myNFT.balanceOf(owner.address)).to.equal(1);
    });
  });

  describe("checkOwner", function() {
    it("Should return the correct owner", async function() {
      await myNFT.mintNFT(owner.address);

      const ownerOfToken = await myNFT.checkOwner(1);

      expect(ownerOfToken).to.equal(owner.address);
    });

    it("Should return zero address for non-existent token", async function() {
      expect(myNFT.checkOwner(1)).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
});

