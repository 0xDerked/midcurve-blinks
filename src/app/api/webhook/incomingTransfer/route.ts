import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
    const apiKey = req.headers.get('Authorization')?.split(' ')[1]
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Incoming transfer detected!')
    const body = await req.json()
    console.log(body)

    return NextResponse.json({ message: 'Incoming transfer handled' }, { status: 200 })
}
