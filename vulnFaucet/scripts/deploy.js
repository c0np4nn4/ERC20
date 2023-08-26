const { ethers } = require("hardhat");

async function main() {
    // Deploy
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();
    await faucet.deployed();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
