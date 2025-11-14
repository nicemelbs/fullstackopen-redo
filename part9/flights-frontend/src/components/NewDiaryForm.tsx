import { useState } from 'react';
import {
  ALL_VISIBILITY,
  ALL_WEATHER,
  type NewDiaryEntry,
  type Weather,
  type Visibility,
  type DiaryFormProps,
} from '../types';
import { createDiaryEntry } from '../services/diaryService';
import axios from 'axios';

interface RadioProps {
  values: readonly string[];
  name: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  initialSelected: string;
}

const RadioButtons = (props: RadioProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    props.initialSelected
  );
  return (
    <div>
      {props.name}
      {props.values.map((v) => (
        <label key={v}>
          <input
            checked={selectedValue === v}
            onChange={() => {
              setSelectedValue(v);
              props.setValue(v);
            }}
            type="radio"
            name={props.name}
            value={v}
          />
          {v}
        </label>
      ))}
    </div>
  );
};

const NewDiaryForm = (props: DiaryFormProps) => {
  const { addToList, onSuccess, onError } = props;

  const [comment, setComment] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('great');
  const [weather, setWeather] = useState<string>('sunny');

  const isWeather = (text: string): text is Weather => {
    return ALL_WEATHER.includes(text as Weather);
  };

  const isVisibility = (text: string): text is Visibility => {
    return ALL_VISIBILITY.includes(text as Visibility);
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (isWeather(weather) && isVisibility(visibility) && date) {
      const newDiaryEntry: NewDiaryEntry = {
        weather,
        visibility,
        date,
        comment,
      };

      try {
        createDiaryEntry(newDiaryEntry).then((data) => {
          addToList(data);
          onSuccess(
            `New entry. date: ${date}, visibility: ${visibility}, weather: ${weather} ${
              comment ? ` ,comment: ${comment}` : ''
            } posted!`
          );
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log('axios?');
          onError(
            `AxiosError: ${error.status}:${error.message}:${error.cause}`
          );
        }
      }
    } else {
      onError('Invalid input.');
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            date:
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>
        <RadioButtons
          setValue={setVisibility}
          name="visibility"
          values={ALL_VISIBILITY}
          initialSelected={ALL_VISIBILITY[0]}
        />
        <RadioButtons
          setValue={setWeather}
          name="weather"
          values={ALL_WEATHER}
          initialSelected={ALL_WEATHER[0]}
        />
        <div>
          <label>
            comment:
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};
export default NewDiaryForm;
