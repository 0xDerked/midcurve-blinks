import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

interface QuestionData {
    expired: boolean
    day: Date
    round: number
    question: string
    timestamp_start: number
    timestamp_end: number
}

//TODO: fix this to be better about errors and non existent days

export const getQuestionData = async (day: number): Promise<QuestionData> => {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('question_num', day)
            .single()

        if (error) throw error

        if (!data || !data.timestamp_end) {
            throw new Error('No expiry time found for the given day')
        }

        const currentTime = Date.now()

        return {
            expired: currentTime > data.timestamp_end,
            day: data.day,
            round: data.round,
            question: data.question_desc,
            timestamp_start: data.timestamp_start,
            timestamp_end: data.timestamp_end,
        }
    } catch (error) {
        console.error('Error checking answer expiry:', error)
        throw error
    }
}
