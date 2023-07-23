import { Flex, HStack } from '@chakra-ui/react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import ElementItem, { ElementItemProps } from '../element/ElementItem';
import type { Element } from '../element/type';
import NodeCollapseButton from './TreeItemCollapseButton';
import { KeyboardEventHandler } from 'react';

interface TreeItemProps extends Pick<ElementItemProps, 'focused' | 'cursor'> {
  id: UniqueIdentifier;
  depth: number;
  collapsed: boolean;
  showCollapseButton: boolean;
  element: Element;
  onCollapse: () => void;
  onAddFromNode: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onIndent: () => void;
  onOutdent: () => void;
}

export default function TreeItem({
  id,
  depth,
  element,
  collapsed,
  focused,
  cursor,
  showCollapseButton,
  onCollapse,
  onAddFromNode,
  onRemove,
  onMoveUp,
  onMoveDown,
  onIndent,
  onOutdent,
}: TreeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter') {
      onAddFromNode();
      e.preventDefault();
    } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
      onRemove();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      onMoveUp();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      onMoveDown();
      e.preventDefault();
    } else if (e.key === 'Tab') {
      if (e.shiftKey) {
        onOutdent();
      } else {
        onIndent();
      }
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
        <NodeCollapseButton
          collapsed={collapsed}
          show={showCollapseButton}
          onClick={onCollapse}
        />
      </Flex>
      <ElementItem
        focused={focused}
        cursor={cursor}
        flex={1}
        onKeyDown={handleKeyDown}
        indicatorProps={{
          ...attributes,
          ...listeners,
        }}
        {...element}
      />
    </HStack>
  );
}
