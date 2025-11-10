import { isNotNumber } from "./utils"

interface Result {
    periodLength: number
    trainingDays: number
    success: boolean
    rating: number
    ratingDescription: string
    target: number
    average: number
}

interface Inputs {
    target: number
    hours: number[]
}

const validateInputs = (args: string[]): Inputs => {
    if (args.length < 4) {
        throw new Error('Error: Too few arguments')
    }

    let target = 0
    let hours = []
    args.slice(2).forEach((arg, i) => {
        if(isNotNumber(arg)){
            throw new Error('Error: Invalid input. Expecting number.')
        }

        if(i === 0){
            target = Number(arg)
        }
        else {
            hours.push(Number(arg))
        }
    
    })

    return {target, hours}
}

const calculateExercises = (args: string[]): Result => {

    const validatedInputs = validateInputs(args)
    const target = validatedInputs.target
    const input = validatedInputs.hours

    const description = [
        'you have a lot of work to do, buddy',
        'not too bad but could be better',
        'awesome'
    ]

    const periodLength = input.length
    const trainingDays = input.reduce((acc, curr) => acc += curr > 0 ? 1 : 0, 0)
    const average = input.reduce((acc, curr) => acc + curr) / periodLength
    const success = average >= target
    const rating = calculateRating(average, target)
    const ratingDescription = description[rating-1]

    return {periodLength, trainingDays, success, rating, ratingDescription, target, average}

}

const calculateRating = (average: number, target: number): number => {
    const diff = average - target
    if (diff > 0) return 3
    if (diff < 0.5 ) return 2
    return 1
}

try {
    console.log(calculateExercises(process.argv))
}catch(error: unknown) {
    let message = 'Something went wrong: '
    if(error instanceof Error){
        message += error.message
    }
    console.error(message)
}