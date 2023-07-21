import { Flex, HStack } from '@chakra-ui/react';
import ElementIndicator, { ElementIndicatorProps } from './ElementIndicator';
import ElementTextarea from './ElementTextarea';

export default function Element({
  indicatorProps,
  text,
}: {
  indicatorProps: ElementIndicatorProps;
  text: string;
}) {
  return (
    <HStack spacing={1.5}>
      <Flex alignSelf="flex-start" pt="0.3125rem">
        <ElementIndicator {...indicatorProps} />
      </Flex>
      <ElementTextarea defaultValue={text} />
    </HStack>
  );
}
