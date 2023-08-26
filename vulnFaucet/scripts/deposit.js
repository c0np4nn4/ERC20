const { ethers } = require("hardhat");

async function main() {

    const [owner,] = await ethers.getSigners();
    const ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

    // Get contract
    const provider = new ethers.providers.JsonRpcProvider(`http://localhost:8545`);
    const contractAddress = ADDRESS;
    const ABI = await hre.artifacts.readArtifact('Faucet');
    const faucet = new ethers.Contract(contractAddress, ABI.abi, provider);

    // Deposit 1,000 ETH 
    const tx = {
        to: faucet.address,
        value: ethers.utils.parseEther("1000"),
        gasLimit: 50000,
    };
    await owner.sendTransaction(tx);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
