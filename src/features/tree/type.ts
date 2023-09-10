import type { Element } from '../element/type';

export type Node = {
  id: string;
  completed: boolean;
  element: Element;
  childrenIds: string[];
};

export type ExpandedNodeIds = Set<Node['id']>;

export type Item = {
  id: Node['id'];
  depth: number;
};
