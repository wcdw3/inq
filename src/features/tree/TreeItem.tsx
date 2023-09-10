import { Flex, HStack, IconButton } from '@chakra-ui/react';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import { useSortable } from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import type { Element } from '../element/type';
import TreeItemCollapseButton from './TreeItemCollapseButton';
import CircleIcon from '../icon/CircleIcon';
import useComplete from './useComplete';
import ElementItem from '../element/ElementItem';

type TreeItemProps = {
  id: UniqueIdentifier;
  depth: number;
  collapsed: boolean;
  showCollapseButton: boolean;
  element: Element;
  onClickCollapseButton?: React.MouseEventHandler;
  appendNewNode?: (id: UniqueIdentifier) => void | undefined;
};

export default function TreeItem({
  id,
  depth,
  collapsed,
  showCollapseButton,
  element,
  onClickCollapseButton,
  appendNewNode,
}: TreeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { completed, toggle: toggleComplete } = useComplete();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      appendNewNode?.(id);
      e.preventDefault();
    }
  };

  return (
    <HStack
      spacing={1.5}
      pl={`${depth * INDENTION_WIDTH}rem`}
      style={style}
      ref={setNodeRef}
    >
      <Flex alignSelf="flex-start" pt="0.125rem">
        <TreeItemCollapseButton
          collapsed={collapsed}
          show={showCollapseButton}
          onClick={onClickCollapseButton}
        />
      </Flex>
      <Flex alignSelf="flex-start" pt="0.4375rem">
        <IconButton
          variant="link"
          size="xs"
          icon={<CircleIcon boxSize="2" />}
          aria-label="Element Indicator"
          color={completed ? undefined : 'blackAlpha.800'}
          onDoubleClick={toggleComplete}
          {...attributes}
          {...listeners}
        />
      </Flex>
      <ElementItem
        focused={false}
        flex={1}
        completed={completed}
        onKeyDown={handleKeyDown}
        {...element}
      />
    </HStack>
  );
}
