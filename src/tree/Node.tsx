import { Box } from '@chakra-ui/react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import Element from '../element/Element';

export default function Node({
  id,
  depth,
}: {
  id: UniqueIdentifier;
  depth: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box pl={`${depth * INDENTION_WIDTH}rem`} style={style} ref={setNodeRef}>
      <Element
        indicatorProps={{
          ...attributes,
          ...listeners,
        }}
        text={`${id}`}
      />
    </Box>
  );
}
