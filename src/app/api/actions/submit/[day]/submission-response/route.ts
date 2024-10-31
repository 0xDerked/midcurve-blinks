import {
    ActionError,
    createActionHeaders,
    NextActionPostRequest,
    CompletedAction,
    NextAction,
    ActionPostResponse,
} from '@solana/actions'
import { clusterApiUrl, Connection } from '@solana/web3.js'

const headers = createActionHeaders()

export const GET = async (req: Request) => {
    return Response.json({ message: 'Method not supported for this route' } as ActionError, {
        status: 403,
        headers,
    })
}

export const POST = async (req: Request, { params }: { params: { day: string } }) => {
    try {
        const url = new URL(req.url)
        const body: NextActionPostRequest = await req.json()

        const signature = body.signature

        const connection = new Connection(process.env.RPC_URL || clusterApiUrl('devnet'))
        const transaction = await connection.getParsedTransaction(signature)

        //TODO: A bunch of stuff to validate the transaction and signature
        //TODO: Update the database with the confirmed flag true

        const payload: CompletedAction = {
            type: 'completed',
            icon: new URL('/midcurvememe.png', new URL(req.url).origin).toString(),
            title: 'Submission successful',
            description: 'You have successfully submitted your answer',
            label: 'Answer Submitted!',
        }
        return Response.json(payload, {
            headers,
        })
    } catch (e) {
        let actionError: ActionError = { message: 'An unknown error occurred' }
        if (typeof e == 'string') actionError.message = e
        return Response.json(actionError, {
            status: 400,
            headers,
        })
    }
}

export const OPTIONS = async () => Response.json(null, { headers })
