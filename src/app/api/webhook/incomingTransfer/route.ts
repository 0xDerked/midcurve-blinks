export const POST = async (req: Request) => {
    console.log('Incoming transfer detected!')
    const body = await req.json()
    console.log(body)
}
