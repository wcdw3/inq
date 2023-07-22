import { Flex, HStack } from '@chakra-ui/react';
import ElementIndicator, { ElementIndicatorProps } from './ElementIndicator';
import ElementTextarea, { ElementTextareaProps } from './ElementTextarea';

export interface ElementProps
  extends Pick<ElementTextareaProps, 'focused' | 'cursor' | 'onKeyDown'> {
  indicatorProps: ElementIndicatorProps;
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
  return (
    <HStack spacing={1.5} flex={flex}>
      <Flex alignSelf="flex-start" pt="0.3125rem">
        <ElementIndicator {...indicatorProps} />
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
