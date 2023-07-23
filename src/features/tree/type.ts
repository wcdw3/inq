import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Element } from '../element/type';

export interface Node {
  id: UniqueIdentifier;
  children: Node[];
  collapsed?: boolean;
  element: Element;
}

export interface FlattenedNode extends Node {
  parentId: UniqueIdentifier;
  depth: number;
  index: number;
}
