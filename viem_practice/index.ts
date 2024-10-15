import { Address, createPublicClient, http } from 'viem'
import { mainnet, polygonAmoy } from 'viem/chains'

const testAccount: Address = `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`;
 
const client = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
})
 
const blockNumber = await client.getBlockNumber()
const balance = await client.getBalance({address: testAccount})

console.log(`blockNumber: ${blockNumber}`)
console.log(`balance: ${balance}`)

