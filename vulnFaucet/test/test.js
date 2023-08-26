const { expect } = require("chai");
const { ethers } = require('hardhat');
const assert = require('assert');

describe("Faucet Test", function() {
    let Faucet, faucet, owner, addr1, addr2;

    before(async function() {
        Faucet = await ethers.getContractFactory("Faucet");

        [owner, addr1, addr2, _] = await ethers.getSigners();

        faucet = await Faucet.deploy();

        // deposit ETH
        const tx = {
            to: faucet.address,
            value: ethers.utils.parseEther("1337"),
            gasLimit: 50000,
        };

        await owner.sendTransaction(tx);
    });

    describe("Deposit", function() {
        it("Deposit 1337 ETH", async function() {
            let expect_value = ethers.utils.parseEther((1337).toString());
            let faucet_balance = await faucet.balance();

            expect(faucet_balance.toString()).to.equal(expect_value.toString());
        });
    });

    describe("Withdraw", function() {
        it("withdraw 1 ETH", async function() {
            let acc_bal;
            const one_eth = ethers.utils.parseEther("1").toBigInt();

            const dummy_tx = {
                to: faucet.address,
                value: (ethers.utils.parseEther("9999").toBigInt()),
                gasLimit: 50000,
            }
            await addr1.sendTransaction(dummy_tx);

            acc_bal = (await addr1.getBalance()).toBigInt();
            assert(acc_bal < one_eth, "account has less than 1 ETH")

            await faucet.connect(addr1).withdraw(ethers.utils.parseEther("1"));

            acc_bal = (await addr1.getBalance()).toBigInt();
            assert(one_eth < acc_bal, "one_eth should be less than acc_bal");
        });
    });
});
