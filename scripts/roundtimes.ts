import { HttpCachingChain, HttpChainClient, roundAt } from "tlock-js"


const DEFAULT_TESTNET_URL =
    'https://pl-us.testnet.drand.sh/cc9c398442737cbd141526600919edd69f1d6f9b4adb67e4d912fbc64341a9a5'

const calcRoundNumbers = async() => {
    const client = new HttpChainClient(new HttpCachingChain(DEFAULT_TESTNET_URL))
    const chainInfo = await client.chain().info()
    const aug10UTC = new Date('2024-08-10T00:00:00Z').getTime()
    console.log(aug10UTC)
}

calcRoundNumbers()