import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Tree, FlattenedItem } from './type';
import { arrayMove } from '@dnd-kit/sortable';

export function flatten(
  items: Tree[],
  parentId: UniqueIdentifier,
  depth = 0,
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>(
    (acc, item, index) => [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ],
    [],
  );
}

export function flattenTree(
  tree: Tree,
  rootNodeId: UniqueIdentifier,
): FlattenedItem[] {
  return flatten(tree.children, rootNodeId);
}

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[],
) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

export function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  if (previousItem) {
    return previousItem.depth + 1;
  }

  return 0;
}

export function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
  rootNodeId: UniqueIdentifier,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return rootNodeId;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? rootNodeId;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };
}

export function findItem(items: Tree[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}

export function buildTree(
  flattenedItems: FlattenedItem[],
  rootNodeId: UniqueIdentifier,
): Tree {
  const root: Tree = { id: rootNodeId, children: [], text: 'Root' };
  const nodes: Record<UniqueIdentifier, Tree> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children, text, collapsed } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children, text, collapsed };
    parent.children.push(item);
  }

  return root;
}

export function cloneObject<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function setProperty<T extends keyof Tree>(
  items: Tree[],
  id: UniqueIdentifier,
  property: T,
  newProperty: Tree[T],
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = newProperty;
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, newProperty);
    }
  }

  return [...items];
}

export function removeItem(items: Tree[], id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function getPrevSiblingId(
  flattenedItems: FlattenedItem[],
  id: UniqueIdentifier,
) {
  const idx = flattenedItems.findIndex(({ id: _id }) => _id === id);
  const item = flattenedItems[idx];

  let prevSiblingId: UniqueIdentifier | null = null;

  for (let i = idx - 1; i >= 0; i--) {
    const _item = flattenedItems[i];
    if (_item.parentId === item.parentId) {
      prevSiblingId = _item.id;
      break;
    }
  }

  return prevSiblingId;
}
