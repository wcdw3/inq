import { IconButton, IconButtonProps } from '@chakra-ui/react';
import CircleIcon from './CircleIcon';

export type ElementIndicatorProps = Omit<IconButtonProps, 'aria-label'>;

export default function ElementIndicator(props: ElementIndicatorProps) {
  return (
    <IconButton
      variant="link"
      size="xs"
      icon={<CircleIcon boxSize="2.5" />}
      color="blackAlpha.800"
      aria-label="Node Indicator"
      {...props}
    />
  );
}
