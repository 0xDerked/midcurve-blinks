import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { HttpCachingChain, HttpChainClient, roundAt } from 'tlock-js'

// Load environment variables
config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

const DEFAULT_TESTNET_URL =
    'https://pl-us.testnet.drand.sh/cc9c398442737cbd141526600919edd69f1d6f9b4adb67e4d912fbc64341a9a5'

const client = new HttpChainClient(new HttpCachingChain(DEFAULT_TESTNET_URL))

//function that adds the round time to the db
const addRoundToDb = async (questionNum: number, date: Date, questionDesc: string) => {
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const chainInfo = await client.chain().info()
    const round = roundAt(endOfDay.getTime() + 60000, chainInfo)

    console.log(date.toISOString().split('T')[0])

    try {
        const { data, error } = await supabase.from('questions').insert({
            question_num: questionNum,
            day: date.toISOString().split('T')[0], // YYYY-MM-DD format
            round,
            timestamp_start: startOfDay.getTime(),
            timestamp_end: endOfDay.getTime(),
            question_desc: questionDesc,
        })

        if (error) throw error

        console.log('Successfully added round to database:', data)
    } catch (error) {
        console.error('Error adding round to database:', error)
    }
}

addRoundToDb(1, new Date('2024-08-27T00:00:00Z'), 'Ipsum lorem this is a test question')
