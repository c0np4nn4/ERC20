// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20Capped, Ownable {
    uint256 public constant MAX_MINT_AMOUNT = 50;
    uint256 public constant MINT_DELAY = 1 days;

    mapping(address => bool) public minters;
    mapping(address => uint256) public lastMint;

    modifier onlyMinter() {
        require(minters[msg.sender], "MyToken: caller is not a minter");
        _;
    }

    constructor(uint256 cap_) ERC20Capped(cap_) ERC20("MyToken", "MTK") {
        minters[msg.sender] = true;
    }

    function setMinter(address account, bool isMinter) external onlyOwner {
        minters[account] = isMinter;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        address minter = msg.sender;
        require(
            block.timestamp >= lastMint[minter] + MINT_DELAY,
            "Mint delay has not passed"
        );
        require(
            amount <= MAX_MINT_AMOUNT,
            "Cannot mint more than the max amount"
        );

        _mint(to, amount);
        lastMint[minter] = block.timestamp;
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
