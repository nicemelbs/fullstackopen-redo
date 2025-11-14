import { useEffect, useState } from 'react';
import DiariesList from './components/DiariesList';
import NewDiaryForm from './components/NewDiaryForm';
import Notification, {
  type NotificationInterface,
} from './components/Notification';
import { getAll } from './services/diaryService';
import type { DiaryEntry } from './types';
import { AxiosError } from 'axios';

const App = () => {
  const [notification, setNotification] = useState<NotificationInterface>({
    message: null,
    type: 'success',
  });

  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const displayNotificationMessage = (message: string): void => {
    setNotification({ message, type: 'success' });
    console.log('Notification:', message);
    setTimeout(() => setNotification({ message: null, type: 'success' }), 5000);
  };

  const displayErrorMessage = (message: string): void => {
    setNotification({ message, type: 'error' });
    console.error('Error:', message);
    setTimeout(() => setNotification({ message: null, type: 'success' }), 5000);
  };

  useEffect(() => {
    getAll()
      .then((data) => setDiaries(data))
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          displayErrorMessage(error.message);
        } else displayErrorMessage('Error: Unknown error');
      });
  }, []);

  const addToList = (object: DiaryEntry) => {
    setDiaries(diaries.concat(object));
  };

  return (
    <div>
      <Notification notification={notification} />
      <NewDiaryForm
        onError={displayErrorMessage}
        onSuccess={displayNotificationMessage}
        addToList={addToList}
      />
      <DiariesList diaries={diaries} />
    </div>
  );
};

export default App;
