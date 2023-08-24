const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Burn Test", function() {
    let MyToken, myToken, owner, addr1;

    beforeEach(async function() {
        MyToken = await ethers.getContractFactory("MyToken");
        [owner, addr1, _] = await ethers.getSigners();
        myToken = await MyToken.deploy(100);
        await myToken.deployed();
    });

    describe("Burn", function() {
        it("Should burn tokens and reduce total supply", async function() {
            await myToken.mint(owner.address, "50");


            let ownerBalance = await myToken.balanceOf(owner.address);
            let totalSupply = await myToken.totalSupply();
            expect(ownerBalance).to.equal("50");
            expect(totalSupply).to.equal("50");

            await myToken.connect(owner).burn(owner.address, "10");

            ownerBalance = await myToken.balanceOf(owner.address);
            totalSupply = await myToken.totalSupply();

            expect(ownerBalance).to.equal("40");
            expect(totalSupply).to.equal("40");

            await myToken.setMinter(addr1.address, true);
            await myToken.connect(addr1).mint(addr1.address, "50");
            totalSupply = await myToken.totalSupply();
            expect(totalSupply).to.equal("90");
        });
    });
});

