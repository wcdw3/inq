import type { UniqueIdentifier } from '@dnd-kit/core';

export interface Tree {
  id: UniqueIdentifier;
  children: Tree[];
  text: string;
  collapsed?: boolean;
}

export interface FlattenedItem extends Tree {
  parentId: UniqueIdentifier;
  depth: number;
  index: number;
}
