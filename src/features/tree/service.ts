import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Node, FlattenedNode } from './type';
import { arrayMove } from '@dnd-kit/sortable';
import { createEmptyElement } from '../element/service';

export function flatten(
  nodes: Node[],
  parentId: UniqueIdentifier,
  depth = 0,
): FlattenedNode[] {
  return nodes.reduce<FlattenedNode[]>(
    (acc, node, index) => [
      ...acc,
      { ...node, parentId, depth, index },
      ...flatten(node.children, node.id, depth + 1),
    ],
    [],
  );
}

export function flattenNodes(
  nodes: Node[],
  rootId: UniqueIdentifier,
): FlattenedNode[] {
  return flatten(nodes, rootId);
}

export function removeChildrenOf(
  nodes: FlattenedNode[],
  ids: UniqueIdentifier[],
) {
  const excludeParentIds = [...ids];

  return nodes.filter((node) => {
    if (node.parentId && excludeParentIds.includes(node.parentId)) {
      if (node.children.length) {
        excludeParentIds.push(node.id);
      }
      return false;
    }

    return true;
  });
}

export function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getMaxDepth({ prevNode }: { prevNode: FlattenedNode }) {
  if (prevNode) {
    return prevNode.depth + 1;
  }

  return 0;
}

export function getMinDepth({ nextNode }: { nextNode: FlattenedNode }) {
  if (nextNode) {
    return nextNode.depth;
  }

  return 0;
}

export function getProjection(
  nodes: FlattenedNode[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
  rootId: UniqueIdentifier,
) {
  const overNodeIndex = nodes.findIndex(({ id }) => id === overId);
  const activeNodeIndex = nodes.findIndex(({ id }) => id === activeId);
  const activeNode = nodes[activeNodeIndex];
  const newNodes = arrayMove(nodes, activeNodeIndex, overNodeIndex);
  const prevNode = newNodes[overNodeIndex - 1];
  const nextNode = newNodes[overNodeIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeNode.depth + dragDepth;
  const maxDepth = getMaxDepth({
    prevNode,
  });
  const minDepth = getMinDepth({ nextNode });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  function getParentId() {
    if (depth === 0 || !prevNode) {
      return rootId;
    }

    if (depth === prevNode.depth) {
      return prevNode.parentId;
    }

    if (depth > prevNode.depth) {
      return prevNode.id;
    }

    const newParent = newNodes
      .slice(0, overNodeIndex)
      .reverse()
      .find((node) => node.depth === depth)?.parentId;

    return newParent ?? rootId;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };
}

export function findNode(nodes: Node[], id: UniqueIdentifier) {
  return nodes.find(({ id: _id }) => _id === id);
}

export function buildNodes(
  flattenedNodes: FlattenedNode[],
  rootId: UniqueIdentifier,
): Node[] {
  const root: Node = {
    id: rootId,
    children: [],
    element: createEmptyElement(),
  };
  const nodeMap: Record<UniqueIdentifier, Node> = { [root.id]: root };
  const nodes = flattenedNodes.map((node) => ({ ...node, children: [] }));

  for (const node of nodes) {
    const { id, children, collapsed, element } = node;
    const parentId = node.parentId ?? root.id;
    const parent = nodeMap[parentId] ?? findNode(nodes, parentId);

    nodeMap[id] = { id, children, collapsed, element };
    parent.children.push(node);
  }

  return root.children;
}

export function cloneObject<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function setProperty<T extends keyof Node>(
  nodes: Node[],
  id: UniqueIdentifier,
  property: T,
  newProperty: Node[T],
) {
  for (const node of nodes) {
    if (node.id === id) {
      node[property] = newProperty;
      continue;
    }

    if (node.children.length) {
      node.children = setProperty(node.children, id, property, newProperty);
    }
  }

  return [...nodes];
}

export function removeNode(nodes: Node[], id: UniqueIdentifier) {
  const newNodes = [];

  for (const node of nodes) {
    if (node.id === id) {
      continue;
    }

    if (node.children.length) {
      node.children = removeNode(node.children, id);
    }

    newNodes.push(node);
  }

  return newNodes;
}

export function getPrevSiblingId(nodes: FlattenedNode[], id: UniqueIdentifier) {
  let prevSiblingId: UniqueIdentifier | null = null;

  const idx = nodes.findIndex(({ id: _id }) => _id === id);

  if (idx > 0) {
    const { parentId } = nodes[idx];
    for (let i = idx - 1; i >= 0; i--) {
      const node = nodes[i];
      if (node.parentId === parentId) {
        prevSiblingId = node.id;
        break;
      }
    }
  }

  return prevSiblingId;
}
