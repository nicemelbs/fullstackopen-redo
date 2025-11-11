import { isNotNumber } from './utils';

interface HeightAndWeight {
  height: number;
  weight: number;
}

const parseValues = (args: string[]): HeightAndWeight => {
  if (args.length < 4) throw new Error('Not enough arguments.');
  else if (args.length > 4) throw new Error('Too many arguments.');
  else if (!isNotNumber(args[2]) && !isNotNumber(args[3]))
    return { height: Number(args[2]), weight: Number(args[3]) };

  throw new Error('Passed arguments are not valid numbers.');
};

const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / Math.pow(height / 100, 2);

  if (bmi < 18.5) return 'underweight';
  else if (bmi >= 18.5 && bmi < 25) return 'normal weight';
  else if (bmi >= 25 && bmi < 30) return 'overweight';
  return 'obese';
};

if (require.main === module) {
  try {
    const { height, weight } = parseValues(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += 'Error: ' + error.message;
    }

    console.error(errorMessage);
  }
}

export default calculateBmi;
