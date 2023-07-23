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
import TreeItem from './TreeItem';
import { INDENTION_WIDTH } from './const';
import type { Node } from './type';
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
import { Cursor } from '../element/type';
import { createEmptyElement } from '../element/service';

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
  defaultNodes,
  rootId,
}: {
  defaultNodes: Node[];
  rootId: UniqueIdentifier;
}) {
  const [nodes, setNodes] = useState(() => defaultNodes);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [focusedNode, setFocusedNode] = useState<{
    id: UniqueIdentifier;
    cursor: Cursor;
  } | null>(null);

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

  const handleRemove = (
    id: UniqueIdentifier,
    prevId: UniqueIdentifier | null,
  ) => {
    setNodes((prev) => removeNode(prev, id));

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
    const prevSiblingId = getPrevSiblingId(flattenedNodes, targetId);

    if (prevSiblingId) {
      const clonedNodes = cloneObject(flattenNodes(nodes, rootId));
      const targetIndex = clonedNodes.findIndex(({ id }) => id === targetId);
      const targetNode = clonedNodes[targetIndex];

      clonedNodes[targetIndex] = {
        ...targetNode,
        parentId: prevSiblingId,
      };

      const prevSiblingIndex = clonedNodes.findIndex(
        ({ id }) => id === prevSiblingId,
      );
      const prevSiblingNode = clonedNodes[prevSiblingIndex];

      clonedNodes[prevSiblingIndex] = {
        ...prevSiblingNode,
        collapsed: false,
      };

      const newNodes = buildNodes(clonedNodes, rootId);
      setNodes(newNodes);
    }
  };

  const handleOutdent = (
    parentId: UniqueIdentifier | null,
    targetId: UniqueIdentifier,
  ) => {
    if (parentId !== rootId) {
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
        items={flattenedNodes.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        {flattenedNodes.map(
          ({ id, depth, collapsed, children, parentId, element }, i) => {
            const prevNode = flattenedNodes[i - 1] || null;
            const nextNode = flattenedNodes[i + 1] || null;
            return (
              <TreeItem
                key={id}
                id={id}
                depth={depth}
                collapsed={!!collapsed}
                onCollapse={() => {
                  handleCollapse(id, !collapsed);
                }}
                onAddFromNode={() => handleAddFromNode(id)}
                onRemove={() => handleRemove(id, prevNode?.id)}
                onMoveUp={() => move(prevNode?.id)}
                onMoveDown={() => move(nextNode?.id)}
                onIndent={() => handleIndent(id)}
                onOutdent={() => handleOutdent(parentId, id)}
                focused={focusedNode?.id === id}
                cursor={focusedNode?.cursor || null}
                showCollapseButton={children.length > 0}
                element={element}
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
