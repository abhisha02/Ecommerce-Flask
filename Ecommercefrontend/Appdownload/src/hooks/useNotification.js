import { useState } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  return { notification, showNotification };
};
