import {
  DndContext,
  DragOverlay,
  DropAnimation,
  PointerSensor,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ExpandedNodeIds, type Node } from './type';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TreeItem from './TreeItem';
import { useMemo, useState } from 'react';
import { nodeMapToItems } from './service';

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

const POINTER_DISTANCE = 5;

type TreeProps = {
  defaultNodes: Node[];
  defaultExpandedNodeIds: Node['id'][];
};

export default function Tree({
  defaultNodes,
  defaultExpandedNodeIds,
}: TreeProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodeMap, _setNodeMap] = useState<Map<Node['id'], Node>>(
    () => new Map(defaultNodes.map((node) => [node.id, node])),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expandedNodeIds, _setExpandedNodeIds] = useState<ExpandedNodeIds>(
    () => new Set(defaultExpandedNodeIds),
  );
  const items = useMemo(() => nodeMapToItems(nodeMap), [nodeMap]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_DISTANCE,
      },
    }),
  );

  return (
    <DndContext sensors={sensors}>
      <SortableContext
        items={items.map(({ id }) => id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map(({ id, depth }) => {
          const node = nodeMap.get(id);
          const collapsed = !expandedNodeIds.has(id);

          return node ? (
            <TreeItem
              key={id}
              id={id}
              depth={depth}
              collapsed={collapsed}
              showCollapseButton={node.childrenIds.length >= 0}
              element={node.element}
            />
          ) : null;
        })}
        {createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig} />,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
}
