import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest } from '@solana/actions'
import { Transaction } from '@solana/web3.js'

export const GET = (req: Request) => {
    const payload: ActionGetResponse = {
        icon: new URL('/midcurvememe.png', new URL(req.url).origin).toString(),
        label: 'Send memo example',
        description: 'Send memo actions example',
        title: 'Send Memo Demo',
    }

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

export const POST = async (req: Request) => {
    const url = new URL(req.url)
    const ref = url.searchParams.get('ref')
    const body: ActionPostRequest = await req.json()
    const tx = new Transaction()
}

export const OPTIONS = GET
