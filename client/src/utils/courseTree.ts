export interface FlatNode {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    parentId: string | null;
    depth: number;
    childCount: number;
    order: number;
    isActive?: boolean;
    updatedAt?: string;
}

export interface TreeNode extends FlatNode {
    children: TreeNode[];
}

/** Flat list (sorted by depth, order) -> nested tree. One pass, built once per fetch. */
export const buildTree = (flat: FlatNode[]): TreeNode[] => {
    const map = new Map<string, TreeNode>();
    flat.forEach((n) => map.set(n._id, { ...n, children: [] }));
    const roots: TreeNode[] = [];
    flat.forEach((n) => {
        const node = map.get(n._id)!;
        const parent = n.parentId ? map.get(n.parentId) : undefined;
        if (parent) parent.children.push(node);
        else roots.push(node); // also covers a child whose parent is hidden
    });
    const sort = (list: TreeNode[]) => {
        list.sort((a, b) => a.order - b.order);
        list.forEach((c) => sort(c.children));
    };
    sort(roots);
    return roots;
};

/** A leaf is a node with no children (never "a node at level N"). */
export const isLeaf = (n: TreeNode) => n.children.length === 0;

export const collectLeafIds = (n: TreeNode): string[] =>
    isLeaf(n) ? [n._id] : n.children.flatMap(collectLeafIds);

export const collectAllIds = (nodes: TreeNode[]): string[] =>
    nodes.flatMap((n) => [n._id, ...collectAllIds(n.children)]);

export const collectTags = (nodes: TreeNode[]): string[] =>
    [...new Set(nodes.flatMap((n) => [...n.tags, ...collectTags(n.children)]))].sort();

/** Keep nodes that match (name or tag) plus their ancestors, so the path stays visible. */
export const filterTree = (nodes: TreeNode[], query: string, tag: string): TreeNode[] => {
    const q = query.trim().toLowerCase();
    if (!q && !tag) return nodes;
    const matches = (n: TreeNode) =>
        (!q || n.title.toLowerCase().includes(q)) && (!tag || n.tags.includes(tag));
    const walk = (list: TreeNode[]): TreeNode[] =>
        list.flatMap((n) => {
            const kids = walk(n.children);
            return matches(n) || kids.length ? [{ ...n, children: kids }] : [];
        });
    return walk(nodes);
};

/** Keep only branches that lead to a leaf in `leafIds` (for "My Superhighway"). */
export const pruneToLeaves = (nodes: TreeNode[], leafIds: Set<string>): TreeNode[] =>
    nodes.flatMap((n) => {
        if (isLeaf(n)) return leafIds.has(n._id) ? [n] : [];
        const kids = pruneToLeaves(n.children, leafIds);
        return kids.length ? [{ ...n, children: kids }] : [];
    });

export const pathTo = (flat: FlatNode[], id: string): string[] => {
    const byId = new Map(flat.map((n) => [n._id, n]));
    const out: string[] = [];
    let cur = byId.get(id);
    while (cur) {
        out.unshift(cur.title);
        cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
    return out;
};