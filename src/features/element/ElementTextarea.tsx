import { Textarea, TextareaProps } from '@chakra-ui/react';
import autosize from 'autosize';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';

interface ElementTextareaProps extends Omit<TextareaProps, 'onChange'> {
  defaultValue: string;
}

export default function ElementTextarea({
  defaultValue,
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
