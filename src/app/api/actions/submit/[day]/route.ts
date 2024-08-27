import { getQuestionData } from '@/app/api/utils/database'
import {
    ActionGetResponse,
    ActionPostRequest,
    createPostResponse,
    createActionHeaders,
} from '@solana/actions'
import { PublicKey, Transaction } from '@solana/web3.js'

const headers = createActionHeaders()

interface SubmitParams {
    day: string
    ref?: string
}

/* 
    Get the day info from the db, question, etc.
    Provide action box to submit the answer
    Check that the answer time has not expired -- store the drand round in the db???
    File pathing system for the picture or from db as well?
*/

export const GET = async (req: Request, { params }: { params: SubmitParams }) => {
    const { day, ref } = params
    const questionData = await getQuestionData(parseInt(day))

    if (questionData.expired) {
        return Response.json(
            { error: 'Answer time has expired for this question' },
            { status: 400 },
        )
    }

    let baseHref = '/api/actions/submit/' + day
    const separator = ref ? '&' : '?'
    if (ref) {
        baseHref += '?ref=' + ref
    }

    const payload: ActionGetResponse = {
        icon: new URL('/midcurvememe.png', new URL(req.url).origin).toString(),
        label: 'Submit Answer',
        description: questionData.question + ' ref is ' + ref,
        title: 'Midcurve Question ' + day + ' on ' + questionData.day,
        links: {
            actions: [
                {
                    href: `${baseHref}${separator}answer={answer}`,
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
        type: 'action',
    }

    return Response.json(payload, { headers })
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
