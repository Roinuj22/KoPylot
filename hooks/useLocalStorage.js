import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValueToStorage = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setValueToStorage];
}
