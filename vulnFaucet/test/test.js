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
            value: ethers.utils.parseEther("9999.9"),
            gasLimit: 50000,
        };

        await owner.sendTransaction(tx);
        await addr1.sendTransaction(tx);
        await addr2.sendTransaction(tx);
    });

    describe("Deployment", function() {
        it("Deposit 1337 ETH by deployer", async function() {

            let a = ethers.utils.parseEther("29999.7");
            let b = await faucet.balance();

            expect(a.toString()).to.equal(b.toString());
        });
    });

    describe("Withdraw", function() {
        it("withdraw 1 ETH", async function() {
            await faucet.connect(addr1).withdraw(ethers.utils.parseEther("1"));

            let one_eth = ethers.utils.parseEther("1").toBigInt();
            let acc_bal = (await addr1.getBalance()).toBigInt();

            assert(one_eth < acc_bal, "one_eth should be less than acc_bal");
        });

        it("withdraw 1ETH (2)", async function() {
            const wallet = Wallet.createRandom();
            console.log("Randomly generated address:", wallet.address);

            // Hardhat 로컬 네트워크에 연결하기 위한 JsonRpcProvider 생성
            const provider = new providers.JsonRpcProvider('http://localhost:8545');

            // Wallet에 provider 연결
            const connectedWallet = wallet.connect(provider);

            // 연결된 Wallet 객체를 사용하여 잔액 조회
            const balance = await connectedWallet.getBalance();
            console.log("Balance of the address on Hardhat network:", balance.toString());
        });
    });



});
