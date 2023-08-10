const { ethers } = require('hardhat');

const ADDRESS = 0x5FbDB2315678afecb367f032d93F642f64180aa3

async function main() {
  const [deployer] = await ethers.getSigners();

  const MyNFTFactory = await ethers.getContractFactory("MyNFT");
  const MyNFT = await MyNFTFactory.deploy();

  console.log("Contract address:", MyNFT.address);

  let tokenId = await MyNFT.mintNFT(deployer.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


