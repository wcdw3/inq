import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';
import type { Node } from './type';
import TreeElementItem from './TreeElementItem';
import useTree from './useTree';

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

type TreeProps = {
  defaultNodes: Node[];
  rootId: UniqueIdentifier;
};

export default function Tree({ defaultNodes, rootId }: TreeProps) {
  const {
    sensors,
    flattenedNodes,
    focusedNode,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
    handleDragOver,
    handleKeyDown,
    handleCollapse,
  } = useTree(defaultNodes, rootId);

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
            const prevNode = flattenedNodes[i - 1];
            const nextNode = flattenedNodes[i + 1];

            return (
              <TreeElementItem
                key={id}
                id={id}
                depth={depth}
                collapsed={!!collapsed}
                showCollapseButton={children.length > 0}
                onClickCollapseButton={() => {
                  handleCollapse(id, !collapsed);
                }}
                focused={focusedNode?.id === id}
                cursor={focusedNode?.cursor}
                onKeyDown={(e) =>
                  handleKeyDown(e, {
                    id,
                    prevId: prevNode?.id,
                    nextId: nextNode?.id,
                    parentId,
                  })
                }
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
