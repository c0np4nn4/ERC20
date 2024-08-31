const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("[1] deploy CoinFlipFactory");
    const Factory = await ethers.getContractFactory("CoinFlipFactory");
    const factory = await Factory.deploy();
    await factory.deployed();

    console.log("[2] create a CoinFlip instance");
    const receipt = await factory.createInstance(owner.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const coinFlip = await ethers.getContractAt("CoinFlip", instance_address, owner);

    console.log("[3] deploy CoinFlipAttack");
    const Attack = await ethers.getContractFactory("CoinFlipAttack");
    const attack = await Attack.deploy();
    await attack.deployed();

    console.log("[4] call attack() 1337 times");

    const begin_time = (new Date).getTime();;

    for (let i = 0; i < 1337; i++) {
        await attack.attack(coinFlip.address);
    }

    console.log('----attack has been taken', ((new Date).getTime() - begin_time) / 1000, 's');

    console.log("----consecutive wins: ",
        (await coinFlip.consecutiveWins()).toString());


    console.log("[5] validate solved");
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
