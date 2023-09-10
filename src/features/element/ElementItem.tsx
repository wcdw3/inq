import { HStack } from '@chakra-ui/react';
import ElementItemTextarea, {
  ElementItemTextareaProps,
} from './ElementItemTextarea';

export interface ElementItemProps
  extends Pick<ElementItemTextareaProps, 'focused' | 'cursor' | 'onKeyDown'> {
  text: string;
  flex?: number;
  completed?: boolean;
}

export default function ElementItem({
  text,
  focused,
  cursor,
  onKeyDown,
  flex,
  completed,
}: ElementItemProps) {
  return (
    <HStack
      spacing={1.5}
      flex={flex}
      {...(completed && {
        textDecor: 'line-through',
        color: 'blackAlpha.600',
      })}
    >
      <ElementItemTextarea
        defaultValue={text}
        onKeyDown={onKeyDown}
        focused={focused}
        cursor={cursor}
      />
    </HStack>
  );
}
