import type { Item, Node } from './type';

/*
function nodesToItems(nodes: Node[], parentId?: string, depth = 0): Item[] {
  return nodes.reduce<Item[]>((items, node) => {
    const item = {
      id: node.id,
      parentId,
      depth,
      collapsed: node.collapsed,
      completed: node.completed,
      hasChildren: node.children.length > 0,
      element: node.element,
    };

    return [
      ...items,
      item,
      ...(item.collapsed
        ? []
        : nodesToItems(node.children, item.id, item.depth + 1)),
    ];
  }, []);
}

const getItemIndexByIdInItems = (id: string, items: Item[]) =>
  items.findIndex((item) => item.id === id);

const buildNodes = (items: Item[]): Node[] => {
  const nodes: Node[] = [];

  items.forEach((item) => {
    const node: Node = {
      id: item.id,
      collapsed: item.collapsed,
      completed: item.completed,
      element: item.element,
      children: [],
    };

    const parentIdx = item.parentId
      ? getItemIndexByIdInItems(item.parentId, items)
      : -1;

    if (parentIdx >= 0) {
      const parent = nodes[parentIdx];
      console.log({ parent, parentIdx });
      parent.children.push(node);
    } else {
      nodes.push(node);
    }
  });

  return nodes;
};
*/

export function nodeMapToItems(
  nodes: Map<Node['id'], Node>,
  parentId?: string,
  depth = 0,
): Item[] {
  console.log({ nodes, parentId, depth });
  return [];
}
