import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
    console.log('Incoming transfer detected!')
    const body = await req.json()
    console.log(body)

    return NextResponse.json({ message: 'Incoming transfer handled' }, { status: 200 })
}
