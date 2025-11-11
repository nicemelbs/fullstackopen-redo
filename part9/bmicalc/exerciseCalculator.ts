import { isNotNumber } from './utils';

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ValidatedInputs {
  target: number;
  daily_exercises: number[];
}

export const validateInputs = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetInput: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  daily_exercisesInput: any[]
): ValidatedInputs => {
  if (isNotNumber(targetInput)) {
    throw new Error('malformatted parameters');
  }

  const target = Number(targetInput);
  const hours: number[] = [];
  daily_exercisesInput.forEach((i) => {
    if (isNotNumber(Number(i))) {
      throw new Error('malformatted parameters');
    }
    hours.push(Number(i));
  });

  return { target, daily_exercises: hours };
};

export const calculateExercises = (
  target: number,
  daily_exercises: number[]
): Result => {
  const description = [
    'you have a lot of work to do, buddy',
    'not too bad but could be better',
    'awesome',
  ];

  const periodLength = daily_exercises.length;
  const trainingDays = daily_exercises.reduce(
    (acc, curr) => (acc += curr > 0 ? 1 : 0),
    0
  );
  const average =
    daily_exercises.reduce((acc, curr) => acc + curr) / periodLength;
  const success = average >= target;
  const rating = calculateRating(average, target);
  const ratingDescription = description[rating - 1];

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const calculateRating = (average: number, target: number): number => {
  const diff = target - average;
  if (diff < 0) return 3;
  if (diff < 0.5) return 2;
  return 1;
};

if (require.main === module) {
  try {
    if (process.argv.length < 4) {
      throw new Error('Error: Too few arguments');
    }
    const targetInput = process.argv[2];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hoursInput: any[] = [];
    process.argv.slice(2).forEach((arg) => {
      if (isNotNumber(arg)) {
        throw new Error('Invalid input. Expecting number.');
      }
      hoursInput.push(arg);
    });

    const { target, daily_exercises } = validateInputs(targetInput, hoursInput);

    console.log(calculateExercises(target, daily_exercises));
  } catch (error: unknown) {
    let message = 'Something went wrong: ';
    if (error instanceof Error) {
      message += error.message;
    }
    console.error(message);
  }
}
