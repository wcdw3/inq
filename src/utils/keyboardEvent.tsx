import { KeyboardEvent, KeyboardEventHandler } from 'react';

type EventHandler<T> = (e: KeyboardEvent<T>) => void | boolean;

export function mergeEventHandler<T>(
  eventHandlers: EventHandler<T>[],
): KeyboardEventHandler<T> {
  return (e) => {
    for (const eh of eventHandlers) {
      const next = eh(e);
      if (next === false) {
        return;
      }
    }
  };
}
