import { Flex, HStack } from '@chakra-ui/react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import Element, { ElementProps } from '../element/Element';
import NodeCollapseButton from './NodeCollapseButton';
import { KeyboardEventHandler } from 'react';

interface NodeProps extends Pick<ElementProps, 'text' | 'focused' | 'cursor'> {
  id: UniqueIdentifier;
  depth: number;
  collapsed: boolean;
  showCollapseButton: boolean;
  onCollapse: () => void;
  onAddFromNode: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function Node({
  id,
  depth,
  text,
  collapsed,
  focused,
  cursor,
  showCollapseButton,
  onCollapse,
  onAddFromNode,
  onRemove,
  onMoveUp,
  onMoveDown,
}: NodeProps) {
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
      <Element
        focused={focused}
        cursor={cursor}
        flex={1}
        onKeyDown={handleKeyDown}
        text={text}
        indicatorProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </HStack>
  );
}
