

import { useState } from "react";

function useLocalStorage(key, initialValue) {
  // useState with a "lazy initializer" function:
  // React only runs this function ONCE on first render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      // If something is saved, parse it. Otherwise use initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error("useLocalStorage read error:", err);
      return initialValue;
    }
  });

  // Wrap setState so it also saves to localStorage every time
  const setValue = (value) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error("useLocalStorage write error:", err);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
