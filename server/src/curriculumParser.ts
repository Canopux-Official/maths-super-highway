import { Types } from 'mongoose';

/**
 * Outline format (one item per line, indent = 2 spaces or 1 tab per level):
 *
 *   IBDP Analysis and Approaches [IBDP, HL, SL]
 *     CalcQuest [15 h]
 *       Limits, continuity :: Optional longer description after two colons
 *
 *  - [tags] at the END of the line, comma separated, free text
 *  - " :: " starts the description
 *  - blank lines and lines starting with # are ignored
 */
export interface ParsedNode {
    _id: Types.ObjectId;
    title: string;
    titleKey: string;
    description: string;
    tags: string[];
    parentId: Types.ObjectId | null;
    ancestors: Types.ObjectId[];
    depth: number;
    childCount: number;
    order: number;
    isActive: boolean;
}

export const MAX_DEPTH = 6;

export function parseOutline(text: string): ParsedNode[] {
    const nodes: ParsedNode[] = [];
    const stack: ParsedNode[] = []; // stack[d] = latest node at depth d
    const lines = text.replace(/\r/g, '').split('\n');

    lines.forEach((raw, i) => {
        const lineNo = i + 1;
        if (!raw.trim() || raw.trim().startsWith('#')) return;

        const indentMatch = raw.match(/^[ \t]*/)![0];
        const depth = indentMatch.replace(/\t/g, '  ').length / 2;
        if (!Number.isInteger(depth)) throw new Error(`Line ${lineNo}: indent must be a multiple of 2 spaces`);
        if (depth >= MAX_DEPTH) throw new Error(`Line ${lineNo}: deeper than ${MAX_DEPTH} levels`);
        if (depth > stack.length) throw new Error(`Line ${lineNo}: indented more than one level below the previous item`);

        let body = raw.trim();
        let description = '';
        const d = body.indexOf(' :: ');
        if (d !== -1) {
            description = body.slice(d + 4).trim();
            body = body.slice(0, d).trim();
        }
        let tags: string[] = [];
        const t = body.match(/\[([^\]]*)\]\s*$/);
        if (t) {
            tags = [...new Set(t[1].split(',').map((x) => x.trim()).filter(Boolean))];
            body = body.slice(0, t.index).trim();
        }
        if (!body) throw new Error(`Line ${lineNo}: empty title`);
        if (body.length > 200) throw new Error(`Line ${lineNo}: title longer than 200 characters`);

        stack.length = depth; // drop deeper levels
        const parent = depth > 0 ? stack[depth - 1] : null;
        const siblings = nodes.filter((n) => (n.parentId?.toString() ?? '') === (parent?._id.toString() ?? ''));
        const key = body.toLowerCase();
        if (siblings.some((s) => s.titleKey === key)) {
            throw new Error(`Line ${lineNo}: duplicate sibling name "${body}"`);
        }

        const node: ParsedNode = {
            _id: new Types.ObjectId(),
            title: body,
            titleKey: key,
            description,
            tags,
            parentId: parent ? parent._id : null,
            ancestors: parent ? [...parent.ancestors, parent._id] : [],
            depth,
            childCount: 0,
            order: siblings.length,
            isActive: true,
        };
        if (parent) parent.childCount += 1;
        nodes.push(node);
        stack[depth] = node;
    });

    return nodes;
}