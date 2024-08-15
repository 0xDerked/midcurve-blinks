import {
    HttpChainClient,
    HttpCachingChain,
    roundAt,
    timelockEncrypt,
    timelockDecrypt,
} from 'tlock-js'

const DEFAULT_TESTNET_URL =
    'https://pl-us.testnet.drand.sh/cc9c398442737cbd141526600919edd69f1d6f9b4adb67e4d912fbc64341a9a5'

const encryptTest = async () => {
    const client = new HttpChainClient(new HttpCachingChain(DEFAULT_TESTNET_URL))
    const chainInfo = await client.chain().info()
    const roundNumber = roundAt(Date.now() + 1000 * 60 * 3, chainInfo) //3 minutes
    const example = JSON.stringify({
        message: '35444',
        entropy: 40,
        timestamp: Date.now(),
    })
    const ciphertext = await timelockEncrypt(roundNumber, Buffer.from(example), client)
    console.log(ciphertext)
    console.log('roundNumber', roundNumber)
}

encryptTest()