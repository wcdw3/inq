import { Flex, HStack } from '@chakra-ui/react';
import ElementIndicator, { ElementIndicatorProps } from './ElementIndicator';
import ElementTextarea from './ElementTextarea';
import { KeyboardEventHandler } from 'react';

export default function Element({
  indicatorProps,
  text,
  focus,
  onKeyDown,
  flex,
}: {
  indicatorProps: ElementIndicatorProps;
  text: string;
  focus: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  flex?: number;
}) {
  return (
    <HStack spacing={1.5} flex={flex}>
      <Flex alignSelf="flex-start" pt="0.3125rem">
        <ElementIndicator {...indicatorProps} />
      </Flex>
      <ElementTextarea
        defaultValue={text}
        onKeyDown={onKeyDown}
        focus={focus}
      />
    </HStack>
  );
}
