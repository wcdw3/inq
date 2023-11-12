import { Text, HStack, Stack, IconButton, Flex } from '@chakra-ui/react';
import { create } from 'zustand';
import CircleIcon from './features/icon/CircleIcon';
import { DragEventHandler, useRef } from 'react';

type NodeView = {
  id: string;
  childrenIds: string[];
};

type NodeValue = {
  id: string;
  text: string;
};

const NODE_VALUES: Map<string, NodeValue> = new Map([
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

type TreeViewState = {
  view: Map<string, NodeView>;
  draggingInfo?: DraggingInfo;
  setDraggingInfo: (newDraggingInfo?: DraggingInfo) => void;
  setItem: (id: string, childrenIds: string[]) => void;
};

const useTreeViewStore = create<TreeViewState>((set) => ({
  view: new Map([
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
  draggingInfo: undefined,
  setDraggingInfo: (newDraggingInfo) =>
    set(() => ({ draggingInfo: newDraggingInfo })),
  setItem: (id, childrenIds) =>
    set((state) => ({
      view: new Map(state.view).set(id, { id, childrenIds }),
    })),
}));

type DraggingInfo = {
  id: string;
  parentId?: string;
};

function Tree({ id, parentId }: { id: string; parentId?: string }) {
  const draggingInfo = useTreeViewStore((state) => state.draggingInfo);
  const setDraggingInfo = useTreeViewStore((state) => state.setDraggingInfo);
  const nodeView = useTreeViewStore((state) => state.view.get(id));
  const parentNodeView = useTreeViewStore((state) =>
    state.view.get(parentId || ''),
  );
  const draggingParentNodeView = useTreeViewStore((state) =>
    state.view.get(draggingInfo?.parentId || ''),
  );
  const setItem = useTreeViewStore((state) => state.setItem);
  const nodeValue = NODE_VALUES.get(id);
  const treeItemRef = useRef<HTMLDivElement>(null);

  const handleDragStart: DragEventHandler<HTMLDivElement> = () => {
    setDraggingInfo({
      id,
      parentId,
    });
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };
  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!draggingInfo) {
      return;
    }

    const newParentNodeView = parentNodeView;
    const oldParentNodeView = draggingParentNodeView;

    if (newParentNodeView === undefined || oldParentNodeView === undefined) {
      return;
    }

    const newIdx =
      (newParentNodeView.childrenIds.findIndex((cid) => cid === id) || 0) + 1;
    const oldIdx =
      oldParentNodeView.childrenIds.findIndex(
        (cid) => cid === draggingInfo.id,
      ) || 0;

    if (newParentNodeView.id === oldParentNodeView?.id && newIdx === oldIdx) {
      return;
    }

    if (newParentNodeView.id === oldParentNodeView.id) {
      const newChildrenIds = [...newParentNodeView.childrenIds];
      newChildrenIds.splice(oldIdx, 1);
      newChildrenIds.splice(newIdx - 1, 0, draggingInfo.id);

      setItem(newParentNodeView.id, newChildrenIds);
    } else {
      if (parentId && parentNodeView) {
        // parent item에 drop item의 아래에 dragging item를 추가한다.
        const newChildrenIds = [...parentNodeView.childrenIds];
        const idx = newChildrenIds.findIndex((cid) => cid === id);
        newChildrenIds.splice(idx + 1, 0, draggingInfo.id);

        setItem(parentId, newChildrenIds);
      }

      if (draggingParentNodeView && draggingInfo.parentId) {
        // dragging item의 parent item에서 dragging item을 제거한다.
        const newChildrenIds = [...draggingParentNodeView.childrenIds];
        const idx = newChildrenIds.findIndex((cid) => cid === draggingInfo.id);
        newChildrenIds.splice(idx, 1);

        setItem(draggingInfo.parentId, newChildrenIds);
      }
    }

    setDraggingInfo(undefined);
  };

  return nodeValue && nodeView ? (
    <>
      <HStack
        spacing={1.5}
        ref={parentId === undefined ? undefined : treeItemRef}
        draggable={parentId !== undefined}
        dropShadow="base"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
        <Text>{nodeValue.text}</Text>
      </HStack>
      {nodeView.childrenIds.length > 0 && (
        <Stack pl="6" spacing={3}>
          {nodeView.childrenIds.map((cid) => (
            <Tree key={cid} id={cid} parentId={id} />
          ))}
        </Stack>
      )}
    </>
  ) : null;
}

export default function App() {
  return (
    <Stack spacing={3} p="6">
      <Tree id="1" />
    </Stack>
  );
}
