import { IconButton } from '@chakra-ui/react';
import ChevronRightIcon from '../icon/ChevronRightIcon';
import ChevronDownIcon from '../icon/ChevronDownIcon';
import { MouseEventHandler } from 'react';

export default function NodeCollapseButton({
  collapsed,
  show,
  onClick,
}: {
  collapsed: boolean;
  show: boolean;
  onClick?: MouseEventHandler;
}) {
  return (
    <IconButton
      onClick={onClick}
      visibility={show ? undefined : 'hidden'}
      variant="link"
      size="xs"
      icon={
        collapsed ? (
          <ChevronRightIcon boxSize="4" />
        ) : (
          <ChevronDownIcon boxSize="4" />
        )
      }
      color="blackAlpha.600"
      aria-label="Collapse Button"
    />
  );
}
