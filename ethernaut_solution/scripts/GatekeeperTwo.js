const { ethers } = require('hardhat');

async function main() {
    const [player] = await ethers.getSigners();

    console.log("\n[0] original player: ", player.address);

    console.log("\n[1] deploy GatekeeperTwo");
    const Factory = await ethers.getContractFactory("GatekeeperTwoFactory");
    const factory = await Factory.connect(player).deploy();
    await factory.deployed();
    console.log("---- Factory address: ", factory.address);

    console.log("\n[2] create a GatekeeperTwo instance");
    const receipt = await factory.createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const gatekeeper = await ethers.getContractAt("GatekeeperTwo", instance_address, player);
    console.log("---- Ctrt address: ", gatekeeper.address);

    // TODO 
    // Deploy Attacker
    // set the proper values to pass the gates

    console.log("\n[3] Deploy Attacker");
    const Attack = await ethers.getContractFactory("GatekeeperTwoAttack");
    const attack = await Attack.deploy(gatekeeper.address, "0xf7b9f1bae9b1f81f", {
        gasLimit: 500000
    });
    console.log("---- Attacker address: ", attack.address);


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


