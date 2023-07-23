import { Stack } from '@chakra-ui/react';
import Tree from './features/tree/Tree';
import data from './data';

export default function App() {
  return (
    <Stack spacing={3}>
      <Tree defaultNodes={data.children} rootId={data.id} />
    </Stack>
  );
}
