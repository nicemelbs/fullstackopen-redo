import type { DiariesListProps } from '../types';

const DiariesList = (props: DiariesListProps) => {
  const diaries = props.diaries;
  return (
    <div>
      <h2>Diary entries</h2>
      <div>
        {diaries.map((diary) => (
          <div key={diary.id}>
            <div>
              <h3>{diary.date}</h3>
              <div>visibility: {diary.visibility}</div>
              <div>weather: {diary.weather}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiariesList;
