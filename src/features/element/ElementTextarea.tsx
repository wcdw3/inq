import { Textarea, TextareaProps } from '@chakra-ui/react';
import autosize from 'autosize';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Cursor } from './type';

export interface ElementTextareaProps
  extends Omit<TextareaProps, 'onChange' | 'cursor'> {
  defaultValue: string;
  cursor: Cursor;
}

export default function ElementTextarea({
  defaultValue,
  cursor,
  ...props
}: ElementTextareaProps) {
  const [value, setValue] = useState<string>(() => defaultValue);
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    if (ref.current) {
      autosize(ref.current);
    }
  }, [ref]);

  useEffect(() => {
    if (cursor) {
      const elem = ref.current;
      if (elem) {
        elem.focus();
        if (cursor === 'end') {
          elem.setSelectionRange(elem.value.length, elem.value.length);
        }
      }
    }
  }, [cursor]);

  return (
    <Textarea
      w="full"
      rows={1}
      p="0"
      borderRadius="none"
      resize="none"
      variant="unstyled"
      ref={ref}
      onChange={handleChange}
      value={value}
      {...props}
    />
  );
}
