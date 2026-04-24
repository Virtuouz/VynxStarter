export interface FileTreeNode {
  name: string;
  type?: "file" | "folder";
  children?: FileTreeNode[];
}

const TREE_GLYPH_PREFIX = /^[\s│├└─\-*+•▸▾]+/;

function stripTreeGlyphs(raw: string): string {
  return raw.replace(TREE_GLYPH_PREFIX, "").trim();
}

function countLeadingWhitespace(line: string): number {
  let count = 0;

  for (const ch of line) {
    if (ch === " ") count += 1;
    else if (ch === "\t") count += 2;
    else break;
  }
  return count;
}

/**
 * Parses an indented text block into a nested tree.
 * Indentation determines depth (using the smallest non-zero indent as the unit).
 * A trailing `/` on a name forces folder type; nodes with children are folders;
 * everything else is a file. Common tree glyphs (├ └ ─ │ - * •) are stripped.
 */
export function parseFileTree(source: string): FileTreeNode[] {
  if (!source) return [];

  const lines = source
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .filter((line) => stripTreeGlyphs(line).length > 0);

  if (lines.length === 0) return [];

  const rawDepths = lines.map(countLeadingWhitespace);
  const uniqueIndents = [...new Set(rawDepths.filter((d) => d > 0))].sort((a, b) => a - b);
  const unit = uniqueIndents[0] ?? 1;

  const roots: FileTreeNode[] = [];
  const stack: { depth: number; node: FileTreeNode }[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const depth = Math.round(rawDepths[i] / unit);
    let name = stripTreeGlyphs(line);

    if (!name) continue;

    let type: "file" | "folder" | undefined;

    if (name.endsWith("/")) {
      type = "folder";
      name = name.slice(0, -1);
    }

    const node: FileTreeNode = { name, children: [] };

    if (type) node.type = type;

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      const parent = stack[stack.length - 1].node;

      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }

    stack.push({ depth, node });
  }

  return finalizeTypes(roots);
}

function finalizeTypes(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes.map((node) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const resolvedType: "file" | "folder" = node.type ?? (hasChildren ? "folder" : "file");

    return {
      ...node,
      type: resolvedType,
      children: hasChildren ? finalizeTypes(node.children!) : [],
    };
  });
}
