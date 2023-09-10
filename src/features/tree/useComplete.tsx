import { useState } from 'react';

export default function useComplete() {
  const [completed, setCompleted] = useState(false);
  const toggle = () => {
    setCompleted((prev) => !prev);
  };

  return {
    completed,
    toggle,
  };
}
