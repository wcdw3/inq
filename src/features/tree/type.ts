import type { Element } from '../element/type';

export type Node = {
  id: string;
  collapsed: boolean;
  completed: boolean;
  element: Element;
  childrenIds: string[];
};

export type Item = {
  id: Node['id'];
  depth: number;
};
