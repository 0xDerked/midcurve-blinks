import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest } from '@solana/actions'
import { Transaction } from '@solana/web3.js'

interface SubmitParams {
    day: string
    ref?: string
}

//sends the blink to the user, no information has been sent from the user yet

/* 
    Get the day info from the db, question, etc.
    Provide action box to submit the answer
    Check that the answer time has not expired -- store the drand round in the db???
    File pathing system for the picture or from db as well?
*/

export const GET = async (req: Request, { params }: { params: SubmitParams }) => {
    const { day } = params

    const payload: ActionGetResponse = {
        icon: new URL('/midcurvememe.png', new URL(req.url).origin).toString(),
        label: 'Submit answer for day ' + day,
        description: 'Send memo actions example',
        title: 'Send Memo Demo',
    }

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

/* 
    Need to use drand here to encrypt and set up the transfers to the different addresses
    Save the encrypted data to the db with the submitter's address and a confirmed flag of false
    Validate addresses to send to
*/

export const POST = async (req: Request) => {
    const url = new URL(req.url)
    const ref = url.searchParams.get('ref')
    const answer = url.searchParams.get('answer')
    //validate answer is a big number
    //encrypt with drand
    //save to db
    //structure tx to send sol to the different addresses
    const body: ActionPostRequest = await req.json()
    const tx = new Transaction()
}

export const OPTIONS = GET
