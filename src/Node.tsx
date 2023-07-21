import { Flex, HStack } from '@chakra-ui/react';
import NodeIndicator from './NodeIndicator';
import NodeTextarea from './NodeTextarea';

export default function Node({ text }: { text: string }) {
  return (
    <HStack spacing={1.5}>
      <Flex alignSelf="flex-start" pt="0.3125rem">
        <NodeIndicator />
      </Flex>
      <NodeTextarea value={text} />
    </HStack>
  );
}
