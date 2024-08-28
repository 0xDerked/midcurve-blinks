import { getQuestionData } from '@/app/api/utils/database'
import {
    ActionGetResponse,
    ActionPostRequest,
    createPostResponse,
    createActionHeaders,
    ActionPostResponse,
} from '@solana/actions'
import {
    clusterApiUrl,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'

const headers = createActionHeaders()

export const GET = async (req: Request, { params }: { params: { day: string } }) => {
    const { day } = params
    const url = new URL(req.url)
    const ref = url.searchParams.get('ref')

    const questionData = await getQuestionData(parseInt(day))

    if (questionData.expired) {
        return Response.json(
            { error: 'Answer time has expired for this question' },
            { status: 400 },
        )
    }

    let baseHref = '/api/actions/submit/' + day
    if (ref) {
        baseHref += '?ref=' + ref
    }

    const payload: ActionGetResponse = {
        icon: new URL('/midcurvememe.png', new URL(req.url).origin).toString(),
        label: 'Submit Answer',
        description: questionData.question,
        title: 'Midcurve Question ' + day + ' on ' + questionData.day,
        links: {
            actions: [
                {
                    href: `${baseHref}`,
                    label: 'Submit Answer',
                    parameters: [
                        {
                            name: 'answer',
                            label: 'Enter your answer',
                            required: true,
                        },
                    ],
                },
            ],
        },
    }

    return Response.json(payload, { headers })
}

/* 
    Need to use drand here to encrypt and set up the transfers to the different addresses
    Save the encrypted data to the db with the submitter's address and a confirmed flag of false
    Validate addresses to send to

    make sure to validate answer time hasn't expired again, because get request could be stale

*/

export const POST = async (req: Request, { params }: { params: { day: string } }) => {
    const { day } = params
    const url = new URL(req.url)
    const ref = url.searchParams.get('ref')

    //TODO: validate day info again, expiry etc.
    //TODO: handle resubmission ???
    //encrypt the data and save to db with confirmed flag false

    const rpc_url = process.env.RPC_URL
    const connection = new Connection(rpc_url || clusterApiUrl('devnet'))

    const body: ActionPostRequest<{ answer: string }> & {
        params: ActionPostRequest<{ answer: string }>['data']
    } = await req.json()

    const midcrv = new PublicKey('midcrvh9iKNDjCVJHbXYPx74CJEYyyP8Hco57szu9ps')

    let account: PublicKey
    try {
        account = new PublicKey(body.account)
    } catch (e) {
        return Response.json({ error: 'Invalid account provided' }, { status: 400 })
    }

    const amount = 0.0045 * LAMPORTS_PER_SOL

    const sendToMidcrvInstruction = SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: midcrv,
        lamports: amount,
    })

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    const tx = new Transaction({
        feePayer: account,
        blockhash,
        lastValidBlockHeight,
    }).add(sendToMidcrvInstruction)

    const payload: ActionPostResponse = await createPostResponse({
        fields: {
            transaction: tx,
            message: 'Submit your answer',
            links: {
                next: {
                    type: 'post',
                    href: '/api/actions/submit/' + day + '/submission-response',
                },
            },
        },
    })

    return Response.json(payload, { headers })
}

const validateRefAccount = (ref: string) => {
    try {
        new PublicKey(ref)
    } catch (e) {
        return false
    }
    return true
}

const validateAnswer = (answer: string) => {
    try {
        BigInt(answer)
    } catch (e) {
        return false
    }
    return true
}

export const OPTIONS = async () => Response.json(null, { headers })
