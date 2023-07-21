import { IconButton, IconButtonProps } from '@chakra-ui/react';
import CircleIcon from '../icon/CircleIcon';

export type ElementIndicatorProps = Omit<IconButtonProps, 'aria-label'>;

export default function ElementIndicator(props: ElementIndicatorProps) {
  return (
    <IconButton
      variant="link"
      size="xs"
      icon={<CircleIcon boxSize="2.5" />}
      color="blackAlpha.600"
      aria-label="Node Indicator"
      {...props}
    />
  );
}
