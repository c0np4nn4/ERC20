const { ethers } = require('hardhat');

const ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const [deployer] = await ethers.getSigners();

  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  const MyToken = await MyTokenFactory.deploy(100);

  console.log("Contract address:", MyToken.address);

  await MyToken.mint(deployer.address, 50);
  let owner_balance = await MyToken.balanceOf(deployer.address);
  console.log("owner_balance: ", owner_balance);

  // await MyToken.burn(deployer.address, 10);
  // await MyToken.burn(deployer.address, 10);
  // await MyToken.burn(deployer.address, 10);
  // await MyToken.burn(deployer.address, 10);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

