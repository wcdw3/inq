import { Stack } from '@chakra-ui/react';
import Node from './Node';

const NODES = [
  { id: '1', text: 'asdjfklsjdkfljsdlkf' },
  {
    id: '2',
    text: 'asdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkf',
  },
  { id: '3', text: '1' },
  { id: '4', text: '3' },
  {
    id: '5',
    text: 'asdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkfasdjfklsjdkfljsdlkf',
  },
];

export default function App() {
  return (
    <Stack>
      {NODES.map((n) => (
        <Node key={n.id} text={n.text} />
      ))}
    </Stack>
  );
}
