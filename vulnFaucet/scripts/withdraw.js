const { ethers } = require("hardhat");
// const hre = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();
    const ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

    // Get contract
    const provider = new ethers.providers.JsonRpcProvider(`http://localhost:8545`);
    const contractAddress = ADDRESS;
    const ABI = await hre.artifacts.readArtifact('Faucet');
    const faucet = new ethers.Contract(contractAddress, ABI.abi, provider);

    // Create a new account
    const new_account = (ethers.Wallet.createRandom()).connect(owner.provider);
    console.log("[!] new account, balance:", ethers.utils.formatEther(await new_account.getBalance()));

    // Get 0.1 ETH from 'owner'
    const tx = {
        to: new_account.address,
        value: ethers.utils.parseEther("0.1"),
        gasLimit: 50000,
    };
    await owner.sendTransaction(tx);


    // Withdraw 1 ETH from faucet
    console.log("[+] balance before: ", ethers.utils.formatEther(await new_account.getBalance()).toString());

    await faucet.connect(new_account).withdraw(ethers.utils.parseEther("1"));

    console.log("[+] balance after:  ", ethers.utils.formatEther(await new_account.getBalance()).toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
