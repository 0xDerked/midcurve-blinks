import { HttpChainClient } from 'drand-client'
import { HttpCachingChain, timelockEncrypt, ChainInfo } from 'tlock-js'

class Drand {
    DEFAULT_TESTNET_URL =
        'https://pl-us.testnet.drand.sh/chains/84b2234fb34e835dccd048255d7ad3194b81af7d978c3bf157e3469592ae4e02'

    DEFAULT_MAINNET_URL =
        'https://drand.cloudfare.com/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971'

    chainInfo: ChainInfo | null = null
    client: HttpChainClient
    roundNumber: number

    private constructor(roundNumber: number, network: 'testnet' | 'mainnet' = 'testnet') {
        this.roundNumber = roundNumber
        if (network === 'testnet') {
            this.client = new HttpChainClient(new HttpCachingChain(this.DEFAULT_TESTNET_URL))
        } else {
            this.client = new HttpChainClient(new HttpCachingChain(this.DEFAULT_MAINNET_URL))
        }
    }

    static async create(roundNumber: number): Promise<Drand> {
        const drand = new Drand(roundNumber)
        await drand.init()
        return drand
    }

    async encrypt(plaintext: string): Promise<string> {
        if (!this.chainInfo) {
            throw new Error('Chain info is not available, need to init first')
        }

        return await timelockEncrypt(this.roundNumber, Buffer.from(plaintext), this.client)
    }

    private async init() {
        this.chainInfo = await this.client.chain().info()
    }
}

export default Drand
