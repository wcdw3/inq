/*
import { HStack } from '@chakra-ui/react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { INDENTION_WIDTH } from './const';
import { ReactNode } from 'react';

interface TreeItemProps {
  id: UniqueIdentifier;
  depth: number;
  collapseButton: ReactNode;
  sortHandler: <P>(props: P) => JSX.Element;
  children: ReactNode;
}

export default function TreeItem({
  id,
  depth,
  collapseButton,
  sortHandler,
  children,
}: TreeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const SortHandler = sortHandler;
  return (
    <HStack
      spacing={1.5}
      pl={`${depth * INDENTION_WIDTH}rem`}
      style={style}
      ref={setNodeRef}
    >
      {collapseButton}
      <SortHandler {...attributes} {...listeners} />
      {children}
    </HStack>
  );
}
*/
