import { useState } from 'react';

export default function useComplete() {
  const [completed, setCompleted] = useState(false);
  const toggleComplete = () => {
    setCompleted((prev) => !prev);
  };

  return {
    completed,
    toggleComplete,
  };
}
