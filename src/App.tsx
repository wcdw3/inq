import { Text, HStack, Stack, IconButton, Flex } from '@chakra-ui/react';
import { create } from 'zustand';
import CircleIcon from './features/icon/CircleIcon';
import { useEffect, useRef, useState } from 'react';

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
  setItem: (id: string, childrenIds: string[]) =>
    set((state) => ({
      view: new Map(state.view).set(id, { id, childrenIds }),
    })),
}));

type DraggingInfo = {
  id: string;
  parentId?: string;
};

function Tree({
  id,
  parentId,
  draggingInfo,
  setDraggingInfo,
}: {
  id: string;
  parentId?: string;
  draggingInfo?: DraggingInfo;
  setDraggingInfo: (info?: DraggingInfo) => void;
}) {
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

  useEffect(() => {
    treeItemRef.current?.addEventListener('dragstart', () => {
      console.log('dragstart', {
        id,
        parentId,
      });

      setDraggingInfo({
        id,
        parentId,
      });
    });

    treeItemRef.current?.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });

    treeItemRef.current?.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    treeItemRef.current?.addEventListener('drop', (e) => {
      e.preventDefault();
      console.log('drop', {
        draggingInfo,
        parentId,
        parentNodeView,
        draggingParentNodeView,
      });

      if (draggingInfo) {
        if (parentId && parentNodeView) {
          // parent item에 drop item의 아래에 dragging item를 추가한다.
          const newChildrenIds = [...parentNodeView.childrenIds];
          const idx = newChildrenIds.findIndex((cid) => cid === id);
          newChildrenIds.splice(idx + 1, 0, draggingInfo.id);

          setItem(parentId, newChildrenIds);
        }

        // dragging item의 parent item에서 dragging item을 제거한다.
        if (draggingParentNodeView && draggingInfo.parentId) {
          const newChildrenIds = [...draggingParentNodeView.childrenIds];
          const idx = newChildrenIds.findIndex(
            (cid) => cid === draggingInfo.id,
          );
          newChildrenIds.splice(idx, 1);

          setItem(draggingInfo.parentId, newChildrenIds);
        }
        setDraggingInfo(undefined);
      }
    });
  }, [
    draggingInfo,
    draggingParentNodeView,
    id,
    parentId,
    parentNodeView,
    setDraggingInfo,
    setItem,
  ]);

  return nodeValue && nodeView ? (
    <>
      <HStack spacing={1.5} ref={treeItemRef} draggable>
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
            <Tree
              key={cid}
              id={cid}
              parentId={id}
              setDraggingInfo={setDraggingInfo}
            />
          ))}
        </Stack>
      )}
    </>
  ) : null;
}

export default function App() {
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | undefined>(
    undefined,
  );

  return (
    <Stack spacing={3} p="6">
      <Tree
        id="1"
        draggingInfo={draggingInfo}
        setDraggingInfo={setDraggingInfo}
      />
    </Stack>
  );
}
