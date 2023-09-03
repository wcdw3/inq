import { useMemo, useState } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { INDENTION_WIDTH } from './const';
import {
  buildNodes,
  cloneObject,
  flattenNodes,
  getPrevSiblingId,
  getProjection,
  removeChildrenOf,
  removeNode,
  setProperty,
} from './service';
import { nanoid } from 'nanoid';
import type { Node } from './type';
import { Cursor } from '../element/type';
import { createEmptyElement } from '../element/service';

const POINTER_DISTANCE = 5;

export default function useTree(
  defaultNodes: Node[],
  rootId: UniqueIdentifier,
) {
  // tree에서 컨트롤 할 수 있는 것
  // 1. node 순서 조작
  // 2. node의 추가, 삭제
  // 3. node의 focus
  // ?. node의 접/폇

  const [nodes, setNodes] = useState(() => defaultNodes);
  const [activeId, setActiveId] = useState<UniqueIdentifier | undefined>(
    undefined,
  );
  const [overId, setOverId] = useState<UniqueIdentifier | undefined>(undefined);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [focusedNode, setFocusedNode] = useState<
    | {
        id: UniqueIdentifier;
        cursor?: Cursor;
      }
    | undefined
  >(undefined);

  const flattenedNodes = useMemo(() => {
    const _nodes = flattenNodes(nodes, rootId);
    const collapsedNodes = _nodes.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      [],
    );

    return removeChildrenOf(
      _nodes,
      activeId ? [activeId, ...collapsedNodes] : collapsedNodes,
    );
  }, [nodes, activeId, rootId]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedNodes,
          activeId,
          overId,
          offsetLeft,
          INDENTION_WIDTH,
          rootId,
        )
      : null;

  const resetState = () => {
    setActiveId('');
    setOverId('');
    document.body.style.removeProperty('cursor');
  };

  const handleDragStart = ({ active: { id } }: DragStartEvent) => {
    setActiveId(id);
    setOverId(id);
    document.body.style.setProperty('cursor', 'grabbing');
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id || '');
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedNodes = cloneObject(flattenNodes(nodes, rootId));
      const overIndex = clonedNodes.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedNodes.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedNodes[activeIndex];

      clonedNodes[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedNodes = arrayMove(clonedNodes, activeIndex, overIndex);
      const newNodes = buildNodes(sortedNodes, rootId);

      setNodes(newNodes);
    }
  };

  const handleCollapse = (
    id: UniqueIdentifier,
    newCollapsed: boolean | undefined,
  ) => {
    setNodes((nodes) => setProperty(nodes, id, 'collapsed', newCollapsed));
  };

  const handleAddFromNode = (id: UniqueIdentifier) => {
    const newNode = {
      id: nanoid(),
      children: [],
      collapsed: true,
      element: createEmptyElement(),
    };

    const clonedNodes = cloneObject(flattenNodes(nodes, rootId));
    const index = clonedNodes.findIndex(({ id: _id }) => _id === id);
    const node = clonedNodes[index];

    clonedNodes.push({
      ...newNode,
      depth: 0,
      index: 0,
      parentId: node.collapsed ? node.parentId : node.id,
    });

    const sortedNodes = arrayMove(
      clonedNodes,
      clonedNodes.length - 1,
      index + 1,
    );
    const newNodes = buildNodes(sortedNodes, rootId);
    setNodes(newNodes);

    setFocusedNode({
      id: newNode.id,
      cursor: 'start',
    });
  };

  const handleRemove = (id: UniqueIdentifier, prevId?: UniqueIdentifier) => {
    setNodes((prev) => removeNode(prev, id));

    if (prevId) {
      setFocusedNode({
        id: prevId,
        cursor: 'end',
      });
    }
  };

  const move = (id?: UniqueIdentifier) => {
    if (id) {
      setFocusedNode({
        id,
      });
    }
  };

  const handleIndent = (targetId: UniqueIdentifier) => {
    const prevSiblingId = getPrevSiblingId(flattenedNodes, targetId);

    if (prevSiblingId) {
      const clonedNodes = cloneObject(flattenNodes(nodes, rootId));
      const targetIndex = clonedNodes.findIndex(({ id }) => id === targetId);
      const targetNode = clonedNodes[targetIndex];

      const prevSiblingIndex = clonedNodes.findIndex(
        ({ id }) => id === prevSiblingId,
      );
      const prevSiblingNode = clonedNodes[prevSiblingIndex];

      clonedNodes[targetIndex] = {
        ...targetNode,
        parentId: prevSiblingId,
      };

      clonedNodes[prevSiblingIndex] = {
        ...prevSiblingNode,
        collapsed: false,
      };

      const newNodes = buildNodes(clonedNodes, rootId);
      setNodes(newNodes);
    }
  };

  const handleOutdent = (
    targetId: UniqueIdentifier,
    parentId?: UniqueIdentifier,
  ) => {
    if (parentId && parentId !== rootId) {
      const clonedNodes = cloneObject(flattenNodes(nodes, rootId));
      const parentIndex = clonedNodes.findIndex(({ id }) => id === parentId);
      const parentNode = clonedNodes[parentIndex];
      const targetIndex = clonedNodes.findIndex(({ id }) => id === targetId);
      const targetNode = clonedNodes[targetIndex];
      clonedNodes[targetIndex] = {
        ...targetNode,
        parentId: parentNode.parentId,
      };

      const newNodes = buildNodes(clonedNodes, rootId);
      setNodes(newNodes);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    {
      id,
      prevId,
      nextId,
      parentId,
    }: {
      id: UniqueIdentifier;
      parentId?: UniqueIdentifier;
      prevId?: UniqueIdentifier;
      nextId?: UniqueIdentifier;
    },
  ) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter') {
      handleAddFromNode(id);
      e.preventDefault();
    } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
      handleRemove(id, prevId);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      move(prevId);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      move(nextId);
      e.preventDefault();
    } else if (e.key === 'Tab') {
      if (e.shiftKey) {
        handleOutdent(id, parentId);
      } else {
        handleIndent(id);
      }
      e.preventDefault();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_DISTANCE,
      },
    }),
  );

  return {
    sensors,
    flattenedNodes,
    focusedNode,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
    handleDragOver,
    handleKeyDown,
    handleCollapse,
  };
}
