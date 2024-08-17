import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { NextResponse } from 'next/server'

interface NativeTransfer {
    amount: number
    fromUserAccount: string
    toUserAccount: string
}

export const POST = async (req: Request) => {
    const apiKey = req.headers.get('Authorization')?.split(' ')[1]
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const nativeTransfers: NativeTransfer[] | undefined = body[0].nativeTransfers

        if (!nativeTransfers) {
            return NextResponse.json({ message: 'No SOL transfers found' }, { status: 200 })
        }

        const toMidCrv = nativeTransfers.filter(
            (tx) =>
                tx.toUserAccount === 'midcrvh9iKNDjCVJHbXYPx74CJEYyyP8Hco57szu9ps' &&
                tx.amount === 0.045 * LAMPORTS_PER_SOL,
        )

        if (toMidCrv.length === 0) {
            return NextResponse.json(
                { message: 'No incoming transfers found with proper criteria' },
                { status: 200 },
            )
        } else {
            console.log('Incoming transfer with proper value found', toMidCrv[0])
            //handle the database update
        }
    } catch (e) {
        return NextResponse.json(
            { error: 'Something went wrong filtering the request' },
            { status: 400 },
        )
    }

    return NextResponse.json({ message: 'Incoming transfer handled' }, { status: 200 })
}
