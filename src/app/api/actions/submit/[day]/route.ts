import { getQuestionData } from '@/app/api/utils/database'
import {
    ACTIONS_CORS_HEADERS,
    ActionGetResponse,
    ActionPostRequest,
    createPostResponse,
} from '@solana/actions'
import { PublicKey, Transaction } from '@solana/web3.js'

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
    const { day, ref } = params
    const questionData = await getQuestionData(parseInt(day))

    const payload: ActionGetResponse = {
        icon: new URL('/midcurvememe.png', new URL(req.url).origin).toString(),
        label: 'Submit answer for day ' + day + ' on ' + questionData.day,
        description: questionData.question,
        title: 'Midcurve Example',
        type: 'action',
    }

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

/* 
    Need to use drand here to encrypt and set up the transfers to the different addresses
    Save the encrypted data to the db with the submitter's address and a confirmed flag of false
    Validate addresses to send to

    make sure to validate answer time hasn't expired again, because get request could be stale

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
    let account: PublicKey
    try {
        account = new PublicKey(body.account)
    } catch (e) {
        return Response.json({ error: 'Invalid account provided' }, { status: 400 })
    }
    const tx = new Transaction()
}

const validateQueryParams = (requestUrl: URL) => {}

export const OPTIONS = GET
