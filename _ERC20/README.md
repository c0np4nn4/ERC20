# ERC20

- A simple practice code with `ERC20` standard.

## Test
```
npx hardhat test
```

## Deploy
- You need 2 terminals for this.
> - `npx hardhat node`: runs a hardhat local ethereum network

> - `npx hardhat run scripts/deploy.js --network localhost`: deploys the contract and mints `50`tokens to the contract owner
> - `npx hardhat run scripts/check.js --netowrk localhost`: checks the total supply of tokens

![Animation](https://github.com/c0np4nn4/ERC20/assets/49471288/f88c78b6-65dc-43e8-a7c8-be38cd0b0cce)
