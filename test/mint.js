const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Mint Test", function() {
  let MyToken, myToken, owner, addr1, addr2;

  beforeEach(async function() {
    // MyToken 컨트랙트를 가져옵니다.
    MyToken = await ethers.getContractFactory("MyToken");

    // 배포자와 테스트용 계정들을 가져옵니다.
    [owner, addr1, addr2, _] = await ethers.getSigners();

    // MyToken 컨트랙트를 배포합니다.
    myToken = await MyToken.deploy(100);
    await myToken.deployed();
  });

  // Minting 기능 테스트
  describe("Minting", function() {
    it("Should mint tokens to an address", async function() {
      await myToken.mint(addr1.address, 50);
      expect(await myToken.balanceOf(addr1.address)).to.equal(50);
    });

    it("Should only allow minters to mint tokens", async function() {
      await myToken.setMinter(addr1.address, true);

      await expect(myToken.connect(addr1).mint(addr2.address, 50))
        .to.emit(myToken, 'Transfer')
        .withArgs(ethers.constants.AddressZero, addr2.address, 50);

      expect(await myToken.balanceOf(addr2.address)).to.equal(50);

      await expect(myToken.connect(addr2).mint(addr1.address, 50))
        .to.be.revertedWith("MyToken: caller is not a minter");
    });

    it("Should not mint more than 50 tokens at a time", async function() {
      await expect(myToken.mint(owner.address, "51")).to.be.revertedWith(
        "Cannot mint more than the max amount"
      );
    });

    it("Should not mint within 1 day of last minting", async function() {
      await myToken.mint(owner.address, "50");
      await expect(myToken.mint(owner.address, "50")).to.be.revertedWith(
        "Mint delay has not passed"
      );
    });

    it("Shoud totalSupply be less than cap", async function() {
      await myToken.setMinter(addr1.address, true);
      await myToken.setMinter(addr2.address, true);

      await myToken.mint(owner.address, "50");
      await myToken.connect(addr1).mint(addr1.address, "50");
      await expect(myToken.connect(addr2).mint(addr2.address, "50")).to.be.revertedWith("ERC20Capped: cap exceeded");

    });
  });
});

