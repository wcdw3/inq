import { Flex, HStack, IconButton, IconButtonProps } from '@chakra-ui/react';
import ElementTextarea, { ElementTextareaProps } from './ElementTextarea';
import CircleIcon from '../icon/CircleIcon';
import { useState } from 'react';

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

  return (
    <HStack
      spacing={1.5}
      flex={flex}
      {...(completed && {
        textDecor: 'line-through',
        color: 'blackAlpha.600',
      })}
    >
      <Flex alignSelf="flex-start" pt="0.3125rem">
        <IconButton
          variant="link"
          size="xs"
          icon={<CircleIcon boxSize="2.5" />}
          color="blackAlpha.600"
          aria-label="Node Indicator"
          {...indicatorProps}
          onDoubleClick={handleDoubleClick}
        />
      </Flex>
      <ElementTextarea
        defaultValue={text}
        onKeyDown={onKeyDown}
        focused={focused}
        cursor={cursor}
      />
    </HStack>
  );
}
