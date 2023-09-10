import { useState } from 'react';

export default function useComplete(defaultCompleted = false) {
  const [completed, setCompleted] = useState(() => defaultCompleted);
  const toggle = () => {
    setCompleted((prev) => !prev);
  };

  return {
    completed,
    toggle,
  };
}
