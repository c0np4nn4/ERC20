const { ethers } = require('hardhat');
const hre = require("hardhat");

const ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  {
    const [owner] = await ethers.getSigners();
    console.log("[addr]: ", owner.address);
    let balance = await owner.getBalance()
    console.log("[Ether]: ", balance.toString())
  }

  const network = 'localhost';
  const provider = new ethers.providers.JsonRpcProvider(`http://${network}:8545`);

  const contractAddress = ADDRESS;
  const ABI = await hre.artifacts.readArtifact('MyToken');
  const contract = new ethers.Contract(contractAddress, ABI.abi, provider);

  const totalSupply = await contract.totalSupply();
  console.log("[total supply]: ", ethers.utils.formatUnits(totalSupply, 18));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

