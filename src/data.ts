import { Node } from './features/tree/type';

const data: Node[] = [
  {
    id: '1',
    collapsed: true,
    completed: true,
    element: {
      text: '1',
    },
    childrenIds: ['1-1', '1-2'],
  },
  {
    id: '2',
    completed: false,
    collapsed: true,
    childrenIds: [],
    element: {
      text: '2',
    },
  },
  {
    id: '1-1',
    collapsed: false,
    completed: false,
    childrenIds: [],
    element: {
      text: '1-1',
    },
  },
  {
    id: '1-2',
    collapsed: false,
    completed: false,
    childrenIds: [],
    element: {
      text: '1-2',
    },
  },
];

export default data;
