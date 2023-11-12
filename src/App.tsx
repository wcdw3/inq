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

type DraggingItem = {
  id: string;
  parentId?: string;
};

type TreeViewState = {
  inodes: Map<string, Inode>;
  draggingItem?: DraggingItem;
  setDraggingItem: (newItem?: DraggingItem) => void;
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
  draggingItem: undefined,
  setDraggingItem: (newItem) => set(() => ({ draggingItem: newItem })),
  setInode: (id, childrenIds) =>
    set((state) => ({
      inodes: new Map(state.inodes).set(id, { id, childrenIds }),
    })),
}));

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

type DndItem = {
  id: string;
  index: number;
  parentInode: Inode;
};

const parseDndItem = ({
  id,
  parentInode,
}: {
  id?: string;
  parentInode?: Inode;
}): DndItem | undefined => {
  if (id === undefined || parentInode === undefined) {
    return;
  }

  const index = parentInode.childrenIds.findIndex((cid) => cid === id);

  if (index === -1) {
    return;
  }

  return {
    id,
    index: index,
    parentInode,
  };
};

const isMove = ({ active, over }: { active: DndItem; over: DndItem }) =>
  !(
    active.parentInode.id === over.parentInode.id && active.index === over.index
  );

function TreeItem({ id, parentId }: { id: string; parentId?: string }) {
  const draggingItem = useTreeViewStore((state) => state.draggingItem);
  const setDraggingItem = useTreeViewStore((state) => state.setDraggingItem);
  const inode = useTreeViewStore((state) => state.inodes.get(id));
  const parentInode = useTreeViewStore((state) =>
    state.inodes.get(parentId || ''),
  );
  const draggingParentInode = useTreeViewStore((state) =>
    state.inodes.get(draggingItem?.parentId || ''),
  );
  const setInode = useTreeViewStore((state) => state.setInode);
  const node = NODE_VALUES.get(id);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isRoot = parentId === undefined;

  const handleDragStart: DragEventHandler<HTMLDivElement> = () => {
    setDraggingItem({
      id,
      parentId,
    });
  };

  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!draggingItem) {
      return;
    }

    const over = parseDndItem({
      id,
      parentInode,
    });

    const active = parseDndItem({
      id: draggingItem.id,
      parentInode: draggingParentInode,
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

    setDraggingItem(undefined);
  };

  return node === undefined || inode === undefined ? null : (
    <>
      <HStack
        spacing={1.5}
        ref={isRoot ? undefined : nodeRef}
        draggable={!isRoot}
        dropShadow="base"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
      {inode.childrenIds.length > 0 && (
        <Stack pl="6" spacing={3}>
          {inode.childrenIds.map((cid) => (
            <TreeItem key={cid} id={cid} parentId={id} />
          ))}
        </Stack>
      )}
    </>
  );
}

export default function App() {
  return (
    <Stack spacing={3} p="6">
      <TreeItem id="1" />
    </Stack>
  );
}
