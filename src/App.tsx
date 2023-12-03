import { Text, HStack, Stack, IconButton, Flex } from '@chakra-ui/react';
import { create } from 'zustand';
import CircleIcon from './features/icon/CircleIcon';
import { DragEventHandler, useRef } from 'react';

type Inode = {
  id: string;
  childrenIds: string[];
  collapse: boolean;
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
    '1-1-3',
    {
      id: '1-1-3',
      text: '1-1-3',
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

type DndActiveItem = {
  lastChildren: boolean;
} & DndItem;

type DndOverItem = {
  collapse: boolean;
  grandParentId?: string;
} & DndItem;

type TreeViewState = {
  inodes: Map<string, Inode>;
  activeItem?: DndActiveItem;
  setActiveItem: (newItem?: DndActiveItem) => void;
  overItem?: DndOverItem;
  setOverItem: (newItem?: DndOverItem) => void;
  setInode: (id: string, childrenIds: string[]) => void;
};

const useTreeViewStore = create<TreeViewState>((set) => ({
  inodes: new Map([
    [
      '1',
      {
        id: '1',
        childrenIds: ['1-1', '1-2'],
        collapse: false,
      },
    ],
    [
      '1-1',
      {
        id: '1-1',
        childrenIds: ['1-1-1', '1-1-2', '1-1-3'],
        collapse: false,
      },
    ],
    [
      '1-2',
      {
        id: '1-2',
        childrenIds: [],
        collapse: false,
      },
    ],
    [
      '1-1-1',
      {
        id: '1-1-1',
        childrenIds: ['1-1-1-1'],
        collapse: false,
      },
    ],
    [
      '1-1-2',
      {
        id: '1-1-2',
        childrenIds: [],
        collapse: false,
      },
    ],
    [
      '1-1-3',
      {
        id: '1-1-3',
        childrenIds: [],
        collapse: false,
      },
    ],
    [
      '1-1-1-1',
      {
        id: '1-1-1-1',
        childrenIds: [],
        collapse: false,
      },
    ],
  ]),
  activeItem: undefined,
  setActiveItem: (newItem) => set(() => ({ activeItem: newItem })),
  overItem: undefined,
  setOverItem: (newItem) => set(() => ({ overItem: newItem })),
  setInode: (id, childrenIds) =>
    set((state) => ({
      inodes: new Map(state.inodes).set(id, {
        id,
        childrenIds,
        collapse: false,
      }),
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

const INDENT_WIDTH = 24;
const BASE_PADDING = 24;
const NODE_HANDLER_WIDTH = 24;

type OffsetOnNode = 'left' | 'handler' | 'right';

const getOffsetOnNode = (toX: number, fromX: number): OffsetOnNode => {
  if (toX < fromX) {
    return 'left';
  }

  if (toX > fromX + NODE_HANDLER_WIDTH) {
    return 'right';
  }

  return 'handler';
};

type PositionInTree = 'first children' | 'next of parent' | 'next';

const getPositionInTree = ({
  active,
  over,
}: {
  active: { offset: OffsetOnNode; lastChildren: boolean };
  over: { collapse: boolean };
}): PositionInTree | undefined => {
  if (active.offset === 'left' && active.lastChildren) {
    return 'next of parent';
  }

  if (active.offset === 'handler') {
    if (over.collapse) {
      return 'next';
    } else {
      return 'first children';
    }
  }

  if (active.offset === 'right') {
    return 'first children';
  }

  return undefined;
};

const getDestNodeByPosition = ({
  position,
  inode,
  parentInode,
  grandParentInode,
}: {
  position: PositionInTree;
  inode: Inode;
  parentInode: Inode;
  grandParentInode?: Inode;
}): {
  parentInode: Inode;
  index: number;
  id: string;
} => {
  if (position === 'first children') {
    return {
      parentInode: inode,
      index: 0,
      id: inode.childrenIds[0],
    };
  }

  if (position === 'next of parent' && grandParentInode) {
    return {
      parentInode: grandParentInode,
      index:
        grandParentInode.childrenIds.findIndex(
          (cid) => cid === parentInode.id,
        ) + 1,
      id: parentInode.id,
    };
  }

  return {
    parentInode: parentInode,
    index: parentInode.childrenIds.findIndex((cid) => cid === inode.id) + 1,
    id: inode.id,
  };
};

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
  grandParentId,
  depth,
}: {
  id: string;
  parentId?: string;
  grandParentId?: string;
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
  const overGrandParentInode = useTreeViewStore((state) =>
    state.inodes.get(overItem?.grandParentId || ''),
  );
  const activeParentInode = useTreeViewStore((state) =>
    state.inodes.get(activeItem?.parentId || ''),
  );
  const setInode = useTreeViewStore((state) => state.setInode);
  const node = NODE_VALUES.get(id);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isRoot = parentId === undefined;

  const handleDragStart: DragEventHandler<HTMLDivElement> = () => {
    setActiveItem({
      id,
      parentId,
      lastChildren: activeParentInode
        ? activeParentInode.childrenIds[
            activeParentInode.childrenIds.length - 1
          ] === id
        : false,
    });
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setOverItem({
      id,
      parentId,
      grandParentId,
      collapse: inode?.childrenIds.length === 0,
    });
  };

  const moveByPosition = (
    src: {
      parentInode: Inode;
      index: number;
      id: string;
    },
    dest: {
      parentInode: Inode;
      index: number;
      id: string;
    },
  ) => {
    if (src.parentInode.id === dest.parentInode.id) {
      setInode(
        src.parentInode.id,
        move({
          arr: src.parentInode.childrenIds,
          fromIndex: src.index,
          toIndex: src.index + 1,
        }),
      );
    } else {
      setInode(
        dest.parentInode.id,
        insert({
          arr: dest.parentInode.childrenIds,
          fromItem: src.id,
          toItem: dest.id,
        }),
      );

      setInode(
        src.parentInode.id,
        remove({
          arr: src.parentInode.childrenIds,
          item: src.id,
        }),
      );
    }
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
      overIndexOnChildren === undefined ||
      !isMove({
        activeParentInodeId: activeParentInode?.id || '',
        overParentInodeId: overParentInode?.id || '',
        activeIndex: activeIndexOnChildren,
        overIndex: overIndexOnChildren,
      })
    ) {
      return;
    }

    const activeX = e.clientX;
    const overX = depth * INDENT_WIDTH + BASE_PADDING;
    const activeOffsetOnOver = getOffsetOnNode(activeX, overX);

    const position = getPositionInTree({
      active: {
        offset: activeOffsetOnOver,
        lastChildren: activeItem.lastChildren,
      },
      over: {
        collapse: overItem.collapse,
      },
    });

    if (
      position === undefined ||
      inode === undefined ||
      overParentInode === undefined ||
      activeParentInode === undefined
    ) {
      return;
    }

    const destNode = getDestNodeByPosition({
      position,
      inode,
      parentInode: overParentInode,
      grandParentInode: overGrandParentInode,
    });

    moveByPosition(
      {
        parentInode: activeParentInode,
        index: activeIndexOnChildren,
        id: activeItem.id,
      },
      destNode,
    );

    setActiveItem(undefined);
  };

  return node === undefined || inode === undefined ? null : (
    <>
      <HStack
        spacing={1.5}
        pl={`${depth * INDENT_WIDTH}px`}
        pb={3}
        ref={isRoot ? undefined : nodeRef}
        draggable={!isRoot}
        dropShadow="base"
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
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
    <Stack spacing={0} p={`${BASE_PADDING}px`}>
      <TreeItem id="1" depth={0} />
    </Stack>
  );
}
