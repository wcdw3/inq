/*
import { Flex, IconButton } from '@chakra-ui/react';
import TreeItem from './TreeItem';
import TreeItemCollapseButton from './TreeItemCollapseButton';
import CircleIcon from '../icon/CircleIcon';
import ElementItem from '../element/ElementItem';
import useComplete from './useComplete';
import { mergeEventHandler } from '../../utils/keyboardEvent';
import { Cursor } from '../element/type';
import type { Element } from '../element/type';
import { UniqueIdentifier } from '@dnd-kit/core';

type TreeElementItemProps = {
  id: UniqueIdentifier;
  depth: number;
  collapsed: boolean;
  showCollapseButton: boolean;
  onClickCollapseButton: React.MouseEventHandler;
  focused: boolean;
  cursor: Cursor;
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
  element: Element;
};

export default function TreeElementItem({
  id,
  depth,
  collapsed,
  showCollapseButton,
  onClickCollapseButton,
  focused,
  cursor,
  onKeyDown,
  element,
}: TreeElementItemProps) {
  const { completed, toggleComplete } = useComplete();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      toggleComplete();
      e.preventDefault();
      return false;
    }
  };

  return (
    <TreeItem
      id={id}
      depth={depth}
      collapseButton={
        <Flex alignSelf="flex-start" pt="0.125rem">
          <TreeItemCollapseButton
            collapsed={collapsed}
            show={showCollapseButton}
            onClick={onClickCollapseButton}
          />
        </Flex>
      }
      sortHandler={(props) => (
        <Flex alignSelf="flex-start" pt="0.4375rem">
          <IconButton
            variant="link"
            size="xs"
            icon={<CircleIcon boxSize="2" />}
            aria-label="Element Indicator"
            {...props}
            color={completed ? undefined : 'blackAlpha.800'}
            onDoubleClick={toggleComplete}
          />
        </Flex>
      )}
    >
      <ElementItem
        flex={1}
        focused={focused}
        cursor={cursor}
        onKeyDown={mergeEventHandler([handleKeyDown, onKeyDown])}
        completed={completed}
        {...element}
      />
    </TreeItem>
  );
}
*/
