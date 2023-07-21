import { Stack } from '@chakra-ui/react';
import Tree from './Tree';

const TREE = {
  id: 'root',
  collapsed: true,
  children: [
    {
      id: '1',
      collapsed: false,
      children: [
        { id: '1-1', collapsed: true, children: [] },
        { id: '1-2', collapsed: true, children: [] },
      ],
    },
    { id: '2', collapsed: true, children: [] },
  ],
};

export default function App() {
  return (
    <Stack spacing={3}>
      <Tree defaultTree={TREE} rootNodeId={TREE.id} />
    </Stack>
  );
}
