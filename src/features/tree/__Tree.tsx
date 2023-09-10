/*
const POINTER_DISTANCE = 5;

type TreeProps = {
  defaultNodes: Node[];
};

export default function Tree({ defaultNodes }: TreeProps) {
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
  */
