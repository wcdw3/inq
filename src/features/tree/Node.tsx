import { Flex, HStack } from '@chakra-ui/react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import Element from '../element/Element';
import NodeCollapseButton from './NodeCollapseButton';
import { KeyboardEventHandler } from 'react';

export default function Node({
  id,
  depth,
  text,
  collapsed,
  focus,
  showCollapseButton,
  onCollapse,
  onAddFromNode,
}: {
  id: UniqueIdentifier;
  depth: number;
  text: string;
  collapsed: boolean;
  focus: boolean;
  showCollapseButton: boolean;
  onCollapse: () => void;
  onAddFromNode: () => void;
}) {
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
        focus={focus}
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
