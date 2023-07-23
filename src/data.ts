export default {
  id: 'root',
  text: 'root',
  collapsed: true,
  children: [
    {
      id: 'n_1',
      collapsed: false,
      children: [
        {
          id: 'n_1-1',
          collapsed: true,
          children: [],
          element: {
            id: 'e_1-1',
            text: '1-1',
          },
        },
        {
          id: 'n_1-2',
          collapsed: true,
          children: [],
          element: {
            id: 'e_1-2',
            text: '1-2',
          },
        },
      ],
      element: {
        id: 'e_1',
        text: '1',
      },
    },
    {
      id: 'n_2',
      text: '2',
      collapsed: true,
      children: [],
      element: {
        id: 'e_2',
        text: '2',
      },
    },
  ],
};
