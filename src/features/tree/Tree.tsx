import { useMemo, useState } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DropAnimation,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';
import Node from './Node';
import { INDENTION_WIDTH } from './const';
import type { Tree } from './type';
import {
  buildTree,
  cloneObject,
  flattenTree,
  getPrevSiblingId,
  getProjection,
  insertNode,
  removeChildrenOf,
  removeItem,
  setProperty,
} from './service';
import { nanoid } from 'nanoid';
import { Cursor } from '../element/type';

const POINTER_DISTANCE = 5;

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

export default function Tree({
  defaultTree,
  rootNodeId,
}: {
  defaultTree: Tree;
  rootNodeId: UniqueIdentifier;
}) {
  const [tree, setTree] = useState(() => defaultTree);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [focusedNode, setFocusedNode] = useState<{
    id: UniqueIdentifier;
    cursor: Cursor;
  } | null>(null);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(tree, rootNodeId);
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      [],
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }, [tree, activeId, rootNodeId]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          INDENTION_WIDTH,
          rootNodeId,
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
      const clonedItems = cloneObject(flattenTree(tree, rootNodeId));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newTree = buildTree(sortedItems, rootNodeId);

      setTree(newTree);
    }
  };

  const handleCollapse = (
    id: UniqueIdentifier,
    newCollapsed: boolean | undefined,
  ) => {
    setTree((tree) => ({
      ...tree,
      children: setProperty(tree.children, id, 'collapsed', newCollapsed),
    }));
  };

  const handleAddFromNode = (
    parentId: UniqueIdentifier,
    id: UniqueIdentifier,
    index: number,
    collapsed?: boolean,
  ) => {
    const newNode = {
      id: nanoid(),
      children: [],
      text: '',
      collapsed: true,
    };

    setTree((tree) => ({
      ...tree,
      children: insertNode(tree.children, newNode, {
        parentId: collapsed ? parentId : id,
        index: collapsed ? index + 1 : 0,
      }),
    }));

    setFocusedNode({
      id: newNode.id,
      cursor: 'start',
    });
  };

  const handleRemove = (
    id: UniqueIdentifier,
    prevId: UniqueIdentifier | null,
  ) => {
    setTree((prev) => ({
      ...prev,
      children: removeItem(prev.children, id),
    }));

    if (prevId) {
      setFocusedNode({
        id: prevId,
        cursor: 'end',
      });
    }
  };

  const move = (id: UniqueIdentifier | null) => {
    if (id) {
      setFocusedNode({
        id,
        cursor: null,
      });
    }
  };

  const handleIndent = (targetId: UniqueIdentifier) => {
    const prevSiblingId = getPrevSiblingId(flattenedItems, targetId);

    if (prevSiblingId) {
      const clonedItems = cloneObject(flattenTree(tree, rootNodeId));
      const targetIndex = clonedItems.findIndex(({ id }) => id === targetId);
      const targetNode = clonedItems[targetIndex];

      clonedItems[targetIndex] = {
        ...targetNode,
        parentId: prevSiblingId,
      };

      const prevSiblingIndex = clonedItems.findIndex(
        ({ id }) => id === prevSiblingId,
      );
      const prevSiblingNode = clonedItems[prevSiblingIndex];

      clonedItems[prevSiblingIndex] = {
        ...prevSiblingNode,
        collapsed: false,
      };

      const newTree = buildTree(clonedItems, rootNodeId);
      setTree(newTree);
    }
  };

  const handleOutdent = (
    parentId: UniqueIdentifier | null,
    targetId: UniqueIdentifier,
  ) => {
    if (parentId !== rootNodeId) {
      const clonedItems = cloneObject(flattenTree(tree, rootNodeId));
      const parentIndex = clonedItems.findIndex(({ id }) => id === parentId);
      const parentNode = clonedItems[parentIndex];
      const targetIndex = clonedItems.findIndex(({ id }) => id === targetId);
      const targetNode = clonedItems[targetIndex];
      clonedItems[targetIndex] = {
        ...targetNode,
        parentId: parentNode.parentId,
      };

      const newTree = buildTree(clonedItems, rootNodeId);
      setTree(newTree);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_DISTANCE,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={flattenedItems.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        {flattenedItems.map(
          ({ id, depth, text, collapsed, children, index, parentId }, i) => {
            const prevNode = flattenedItems[i - 1] || null;
            const nextNode = flattenedItems[i + 1] || null;
            return (
              <Node
                key={id}
                id={id}
                depth={depth}
                text={text}
                collapsed={!!collapsed}
                onCollapse={() => {
                  handleCollapse(id, !collapsed);
                }}
                onAddFromNode={() =>
                  handleAddFromNode(parentId, id, index, collapsed)
                }
                onRemove={() => handleRemove(id, prevNode?.id)}
                onMoveUp={() => move(prevNode?.id)}
                onMoveDown={() => move(nextNode?.id)}
                onIndent={() => handleIndent(id)}
                onOutdent={() => handleOutdent(parentId, id)}
                focused={focusedNode?.id === id}
                cursor={focusedNode?.cursor || null}
                showCollapseButton={children.length > 0}
              />
            );
          },
        )}
        {createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig} />,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
