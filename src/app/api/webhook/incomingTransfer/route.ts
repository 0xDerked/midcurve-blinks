import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
    const apiKey = req.headers.get('Authorization')?.split(' ')[1]
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // get transfer
    // filter txs for INCOMING transfers only
    // check the amount and sender
    // if everything is correct, update the database to indicate user has submitted for that round

    const body = await req.json()
    console.log(body)
    console.log('native transfers', body.nativeTransfers)
    return NextResponse.json({ message: 'Incoming transfer handled' }, { status: 200 })
}
