import { Flex, HStack, IconButton, IconButtonProps } from '@chakra-ui/react';
import ElementTextarea, { ElementTextareaProps } from './ElementTextarea';
import CircleIcon from '../icon/CircleIcon';
import { KeyboardEventHandler, useState } from 'react';

export interface ElementProps
  extends Pick<ElementTextareaProps, 'focused' | 'cursor' | 'onKeyDown'> {
  indicatorProps: Omit<IconButtonProps, 'aria-label'>;
  text: string;
  flex?: number;
}

export default function Element({
  indicatorProps,
  text,
  focused,
  cursor,
  onKeyDown,
  flex,
}: ElementProps) {
  const [completed, setCompleted] = useState(false);
  const handleDoubleClick = () => {
    setCompleted((prev) => !prev);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      setCompleted((prev) => !prev);
      e.preventDefault();
    } else if (typeof onKeyDown === 'function') {
      onKeyDown(e);
    }
  };

  return (
    <HStack
      spacing={1.5}
      flex={flex}
      {...(completed && {
        textDecor: 'line-through',
        color: 'blackAlpha.600',
      })}
    >
      <Flex alignSelf="flex-start" pt="0.4375rem">
        <IconButton
          variant="link"
          size="xs"
          icon={<CircleIcon boxSize="2" />}
          color={completed ? undefined : 'blackAlpha.800'}
          aria-label="Element Indicator"
          {...indicatorProps}
          onDoubleClick={handleDoubleClick}
        />
      </Flex>
      <ElementTextarea
        defaultValue={text}
        onKeyDown={handleKeyDown}
        focused={focused}
        cursor={cursor}
      />
    </HStack>
  );
}
