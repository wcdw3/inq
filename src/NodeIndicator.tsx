import { IconButton } from '@chakra-ui/react';
import CircleIcon from './CircleIcon';

export default function NodeIndicator() {
  return (
    <IconButton
      variant="link"
      size="xs"
      icon={<CircleIcon boxSize="3" />}
      color="blackAlpha.800"
      aria-label="Node Indicator"
    />
  );
}
