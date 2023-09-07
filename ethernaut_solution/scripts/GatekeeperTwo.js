const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    console.log("\n[1] deploy GatekeeperTwo");
    const Factory = await ethers.getContractFactory("GatekeeperTwoFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- GatekeeperTwo address: ", factory.address);

    console.log("\n[2] create a GatekeeperTwo instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const gatekeeper = await ethers.getContractAt("GatekeeperTwo", instance_address, owner);
    console.log("---- gatekeeper address: ", gatekeeper.address);

    console.log("\n[*] validate solved");

    const res = await factory.validateInstance(gatekeeper.address, player.address);
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


