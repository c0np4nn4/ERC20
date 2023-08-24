const { ethers } = require("hardhat");
// const hre = require("hardhat");

async function main() {

    const [owner,] = await ethers.getSigners();
    const initAmount = 1000;

    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();


    const tx = {
        to: await faucet.address,
        value: ethers.utils.parseEther("1337"),
        gasLimit: 50000,
    };

    await owner.sendTransaction(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
