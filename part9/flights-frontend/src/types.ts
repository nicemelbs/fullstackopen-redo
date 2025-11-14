export const ALL_VISIBILITY = ['great', 'good', 'ok', 'poor'] as const;
export type Visibility = (typeof ALL_VISIBILITY)[number];
export const ALL_WEATHER = [
  'sunny',
  'rainy',
  'cloudy',
  'windy',
  'stormy',
] as const;
export type Weather = (typeof ALL_WEATHER)[number];

export interface NewDiaryEntry {
  comment?: string | undefined;
  date: string;
  weather: Weather;
  visibility: Visibility;
}

export interface DiaryEntry extends NewDiaryEntry {
  id: number;
}

export interface DiariesListProps {
  diaries: DiaryEntry[];
}

export interface DiaryFormProps {
  addToList: (obj: DiaryEntry) => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}
