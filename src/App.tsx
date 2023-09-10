import { Stack } from '@chakra-ui/react';
import Tree from './features/tree/Tree';
import { NODES, EXPANDED_NODE_IDS } from './data';

export default function App() {
  return (
    <Stack spacing={3} p="6">
      <Tree defaultNodes={NODES} defaultExpandedNodeIds={EXPANDED_NODE_IDS} />
    </Stack>
  );
}
