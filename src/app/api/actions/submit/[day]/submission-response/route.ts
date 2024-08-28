import {
    ActionError,
    createActionHeaders,
    NextActionPostRequest,
    CompletedAction,
} from '@solana/actions'

const headers = createActionHeaders()

export const GET = async (req: Request) => {
    return Response.json({ message: 'Method not supported for this route' } as ActionError, {
        status: 403,
        headers,
    })
}

export const POST = async (req: Request, { params }: { params: { day: string } }) => {
    try {
        //TODO: A bunch of stuff to validate the transaction and signature
        //TODO: Update the database with the confirmed flag true

        const payload: CompletedAction = {
            type: 'completed',
            title: 'Submission successful',
            description: 'Your submission was successful',
            label: 'Complete!',
            icon: '🎉',
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
