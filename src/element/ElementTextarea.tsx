import { Textarea, TextareaProps } from '@chakra-ui/react';
import autosize from 'autosize';
import { useEffect, useRef } from 'react';

export default function ElementTextarea(props: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

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
      {...props}
    />
  );
}
