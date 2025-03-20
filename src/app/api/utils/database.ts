import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

interface QuestionData {
    active: boolean
    day: Date
    round: number
    question: string
    timestamp_start: number
    timestamp_end: number
}

export const getQuestionData = async (day: number): Promise<QuestionData> => {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('question_num', day)
            .single()

        if (error) throw error

        if (!data) {
            throw new Error('No question data found for the given day')
        }

        const currentTime = Date.now()

        return {
            active: currentTime > data.timestamp_start && currentTime < data.timestamp_end,
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

export const saveAnswer = async (
    day: number,
    encryptedAnswer: string,
    submittingAddress: string,
    refAddress: string,
    signature: string,
    amountLamports: number,
) => {
    try {
        const { data, error } = await supabase.from('submissions').insert([
            {
                timestamp: Date.now(),
                question_num: day,
                encrypted_answer: encryptedAnswer,
                user_pubkey: submittingAddress,
                ref_pubkey: refAddress,
                tx_signature: signature,
                confirmed: false,
                entry_lamports: amountLamports,
            },
        ])

        if (error) throw error

        return data
    } catch (error) {
        console.error('Error saving answer:', error)
        throw error
    }
}

//TODO: Add a function to update the database with the confirmed flag true
//DON'T HAVE THE SIG YET, NEED A DIFFERENT IDENTIFIER -- pubkey+day??
export const confirmSubmission = async (signature: string) => {
    try {
        const { data, error } = await supabase
            .from('submissions')
            .update({ confirmed: true })
            .eq('tx_signature', signature)

        if (error) throw error

        return data
    } catch (error) {
        console.error('Error confirming submission:', error)
        throw error
    }
}
