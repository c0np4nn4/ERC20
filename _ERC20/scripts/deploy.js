const { ethers } = require('hardhat');

const ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const [deployer, a, b, c, d, e] = await ethers.getSigners();

  console.log('deployer: ', deployer.address);
  console.log('addr1: ', a.address);
  console.log('addr2: ', b.address);
  console.log('addr3: ', c.address);
  console.log('addr4: ', d.address);
  console.log('addr5: ', e.address);

  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  const MyToken = await MyTokenFactory.deploy(100);

  console.log("Contract address:", MyToken.address);

  await MyToken.mint(deployer.address, 50);
  let owner_balance = await MyToken.balanceOf(deployer.address);
  console.log("owner_balance: ", owner_balance);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

