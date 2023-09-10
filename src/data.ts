import { Node } from './features/tree/type';

export const EXPANDED_NODE_IDS: Node['id'][] = ['1'];

export const NODES: Node[] = [
  {
    id: '1',
    completed: true,
    element: {
      text: '1',
    },
    childrenIds: ['1-1', '1-2'],
  },
  {
    id: '2',
    completed: false,
    childrenIds: [],
    element: {
      text: '2',
    },
  },
  {
    id: '1-1',
    completed: false,
    childrenIds: [],
    element: {
      text: '1-1',
    },
  },
  {
    id: '1-2',
    completed: false,
    childrenIds: [],
    element: {
      text: '1-2',
    },
  },
];
