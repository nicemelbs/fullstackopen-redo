import express from 'express';
import { isNotNumber } from './utils';
import calculateBmi from './calculateBmi';
import { calculateExercises, validateInputs } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  try {
    if (isNotNumber(height) || isNotNumber(weight)) {
      console.log(height, weight);
      throw new Error('malformatted query');
    } else if (Number(height) === 0) {
      throw new Error('cannot divide by zero');
    }

    const bmi = calculateBmi(Number(height), Number(weight));

    res.send({ weight, height, bmi });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.send({ error: error.message });
    }
  }
});

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!req.body.target || !req.body.daily_exercises) {
      throw new Error('parameters missing');
    }

    const { target, daily_exercises } = validateInputs(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.body.target,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.body.daily_exercises
    );

    return res.send(calculateExercises(target, daily_exercises));
  } catch (error: unknown) {
    if (error instanceof Error)
      return res.status(400).send({ error: error.message });

    return res.status(400).send({ error: 'Something went wrong.' });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
