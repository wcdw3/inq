import { Stack } from '@chakra-ui/react';
import Tree from './features/tree/Tree';
import data from './data';

export default function App() {
  return (
    <Stack spacing={3} p="6">
      <Tree defaultNodes={data} />
    </Stack>
  );
}
