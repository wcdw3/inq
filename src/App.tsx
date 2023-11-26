import { Text, HStack, Stack, IconButton, Flex } from '@chakra-ui/react';
import { create } from 'zustand';
import CircleIcon from './features/icon/CircleIcon';
import { DragEventHandler, useRef } from 'react';

type Inode = {
  id: string;
  childrenIds: string[];
};

type Node = {
  id: string;
  text: string;
};

const NODE_VALUES: Map<string, Node> = new Map([
  [
    '1',
    {
      id: '1',
      text: '1',
    },
  ],
  [
    '1-1',
    {
      id: '1-1',
      text: '1-1',
    },
  ],
  [
    '1-2',
    {
      id: '1-2',
      text: '1-2',
    },
  ],
  [
    '1-1-1',
    {
      id: '1-1-1',
      text: '1-1-1',
    },
  ],
  [
    '1-1-2',
    {
      id: '1-1-2',
      text: '1-1-2',
    },
  ],
  [
    '1-1-1-1',
    {
      id: '1-1-1-1',
      text: '1-1-1-1',
    },
  ],
]);

type DndItem = {
  id: string;
  parentId?: string;
};

type TreeViewState = {
  inodes: Map<string, Inode>;
  activeItem?: DndItem;
  setActiveItem: (newItem?: DndItem) => void;
  overItem?: DndItem;
  setOverItem: (newItem?: DndItem) => void;
  setInode: (id: string, childrenIds: string[]) => void;
};

const useTreeViewStore = create<TreeViewState>((set) => ({
  inodes: new Map([
    [
      '1',
      {
        id: '1',
        childrenIds: ['1-1', '1-2'],
      },
    ],
    [
      '1-1',
      {
        id: '1-1',
        childrenIds: ['1-1-1', '1-1-2'],
      },
    ],
    [
      '1-2',
      {
        id: '1-2',
        childrenIds: [],
      },
    ],
    [
      '1-1-1',
      {
        id: '1-1-1',
        childrenIds: ['1-1-1-1'],
      },
    ],
    [
      '1-1-2',
      {
        id: '1-1-2',
        childrenIds: [],
      },
    ],
    [
      '1-1-1-1',
      {
        id: '1-1-1-1',
        childrenIds: [],
      },
    ],
  ]),
  activeItem: undefined,
  setActiveItem: (newItem) => set(() => ({ activeItem: newItem })),
  overItem: undefined,
  setOverItem: (newItem) => set(() => ({ overItem: newItem })),
  setInode: (id, childrenIds) =>
    set((state) => ({
      inodes: new Map(state.inodes).set(id, { id, childrenIds }),
    })),
}));

/*
const move = ({
  arr,
  fromIndex,
  toIndex,
}: {
  arr: string[];
  fromIndex: number;
  toIndex: number;
}): string[] => {
  const newArr = [...arr];
  const fromItem = newArr[fromIndex];

  if (fromItem === undefined) {
    return newArr;
  }

  newArr.splice(fromIndex, 1);
  newArr.splice(toIndex, 0, fromItem);
  return newArr;
};

const insert = ({
  arr,
  fromItem,
  toItem,
}: {
  arr: string[];
  fromItem: string;
  toItem: string;
}) => {
  const newArr = [...arr];
  const to = newArr.findIndex((item) => item === toItem);

  if (to >= 0) {
    newArr.splice(to + 1, 0, fromItem);
  }

  return newArr;
};

const remove = ({ arr, item }: { arr: string[]; item: string }): string[] => {
  const newArr = [...arr];
  const idx = newArr.findIndex((__item) => __item === item);

  if (idx >= 0) {
    newArr.splice(idx, 1);
  }

  return newArr;
};
*/

const getIndexOfDndItem = ({
  id,
  parentInodeChildrenIds,
}: {
  id: string;
  parentInodeChildrenIds: string[];
}): number | undefined => {
  const index = parentInodeChildrenIds.findIndex((cid) => cid === id);
  return index === -1 ? undefined : index;
};

const isMove = ({
  activeParentInodeId,
  overParentInodeId,
  activeIndex,
  overIndex,
}: {
  activeParentInodeId: string;
  overParentInodeId: string;
  activeIndex: number;
  overIndex: number;
}) => !(activeParentInodeId === overParentInodeId && activeIndex === overIndex);

function TreeItem({
  id,
  parentId,
  depth,
}: {
  id: string;
  parentId?: string;
  depth: number;
}) {
  const activeItem = useTreeViewStore((state) => state.activeItem);
  const setActiveItem = useTreeViewStore((state) => state.setActiveItem);
  const overItem = useTreeViewStore((state) => state.overItem);
  const setOverItem = useTreeViewStore((state) => state.setOverItem);
  const inode = useTreeViewStore((state) => state.inodes.get(id));
  const overParentInode = useTreeViewStore((state) =>
    state.inodes.get(overItem?.parentId || ''),
  );
  const activeParentInode = useTreeViewStore((state) =>
    state.inodes.get(activeItem?.parentId || ''),
  );
  //const setInode = useTreeViewStore((state) => state.setInode);
  const node = NODE_VALUES.get(id);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isRoot = parentId === undefined;

  const handleDragStart: DragEventHandler<HTMLDivElement> = () => {
    setActiveItem({
      id,
      parentId,
    });
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setOverItem({
      id,
      parentId,
    });
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (!overItem || !activeItem) {
      return;
    }

    const activeIndexOnChildren = getIndexOfDndItem({
      id: activeItem.id,
      parentInodeChildrenIds: activeParentInode?.childrenIds || [],
    });

    const overIndexOnChildren = getIndexOfDndItem({
      id: overItem.id,
      parentInodeChildrenIds: overParentInode?.childrenIds || [],
    });

    if (
      activeIndexOnChildren === undefined ||
      overIndexOnChildren === undefined
    ) {
      return;
    }

    if (
      !isMove({
        activeParentInodeId: activeParentInode?.id || '',
        overParentInodeId: overParentInode?.id || '',
        activeIndex: activeIndexOnChildren,
        overIndex: overIndexOnChildren,
      })
    ) {
      return;
    }

    // const location: 'left' | 'center' | 'right'  = getLocationOnNode(activeNode, overNode)
    // const toNode = getToNode(location, overNode)
    // const position: 'children' | 'next' = getPositionOnNode(location, overNode, toNode)
    // moveByDrop(position, from: active, to: toNode)

    /*
    if (!activeItem) {
      return;
    }

    const over = parseDndItem({
      id,
      parentInode,
    });

    const active = parseDndItem({
      id: activeItem.id,
      parentInode: activeParentInode,
    });

    if (
      over === undefined ||
      active === undefined ||
      !isMove({
        active,
        over,
      })
    ) {
      return;
    }

    if (active.parentInode.id === over.parentInode.id) {
      setInode(
        active.parentInode.id,
        move({
          arr: active.parentInode.childrenIds,
          fromIndex: active.index,
          toIndex: over.index + 1,
        }),
      );
    } else {
      setInode(
        over.parentInode.id,
        insert({
          arr: over.parentInode.childrenIds,
          fromItem: active.id,
          toItem: over.id,
        }),
      );

      setInode(
        active.parentInode.id,
        remove({
          arr: active.parentInode.childrenIds,
          item: active.id,
        }),
      );
    }

    setActiveItem(undefined);
    */
  };

  return node === undefined || inode === undefined ? null : (
    <>
      <HStack
        spacing={1.5}
        pl={depth * 6}
        pb={3}
        ref={isRoot ? undefined : nodeRef}
        draggable={!isRoot}
        dropShadow="base"
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        <Flex alignSelf="flex-start" pt="0.4375rem">
          <IconButton
            variant="link"
            size="xs"
            icon={<CircleIcon boxSize="2" />}
            aria-label="Draggalbe"
          />
        </Flex>
        <Text>{node.text}</Text>
      </HStack>
      {inode.childrenIds.length > 0 &&
        inode.childrenIds.map((cid) => (
          <TreeItem key={cid} id={cid} parentId={id} depth={depth + 1} />
        ))}
    </>
  );
}

export default function App() {
  return (
    <Stack spacing={0} p={6}>
      <TreeItem id="1" depth={0} />
    </Stack>
  );
}
