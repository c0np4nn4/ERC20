const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Deploy Test", function() {
  let MyToken, myToken, owner, addr1, addr2;

  beforeEach(async function() {
    MyToken = await ethers.getContractFactory("MyToken");

    [owner, addr1, addr2, _] = await ethers.getSigners();

    myToken = await MyToken.deploy(100);

    await myToken.deployed();
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Owner should be a minter", async function() {
      expect(await myToken.minters(owner.address)).to.be.true;
    });
  });
});
