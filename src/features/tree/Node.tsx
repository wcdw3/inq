import { Flex, HStack } from '@chakra-ui/react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import Element from '../element/Element';
import NodeCollapseButton from './NodeCollapseButton';

export default function Node({
  id,
  depth,
  text,
  collapsed,
  showCollapseButton,
  onCollapse,
}: {
  id: UniqueIdentifier;
  depth: number;
  text: string;
  collapsed: boolean;
  showCollapseButton: boolean;
  onCollapse: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        text={text}
        indicatorProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </HStack>
  );
}
