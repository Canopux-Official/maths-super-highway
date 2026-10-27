import type { ReactNode } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { TreeNode } from '../utils/curriculumTree';

interface Props {
    nodes: TreeNode[];
    expanded: Set<string>;
    onToggle: (id: string) => void;
    /** checkbox / icon shown before the title */
    renderLeading?: (node: TreeNode) => ReactNode;
    /** buttons shown on the right of the row */
    renderActions?: (node: TreeNode) => ReactNode;
    /** extra small text under the title */
    renderMeta?: (node: TreeNode) => ReactNode;
    onTitleClick?: (node: TreeNode) => void;
}

const Row = ({ node, level, ...p }: Props & { node: TreeNode; level: number }) => {
    const hasKids = node.children.length > 0;
    const open = p.expanded.has(node._id);
    return (
        <>
            <Box
                sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5, pl: level * 3, pr: 1, py: 0.5,
                    borderBottom: '1px solid', borderColor: 'divider',
                    opacity: node.isActive === false ? 0.55 : 1,
                    '&:hover': { bgcolor: 'action.hover' },
                }}
            >
                <IconButton size="small" onClick={() => p.onToggle(node._id)} disabled={!hasKids} sx={{ visibility: hasKids ? 'visible' : 'hidden' }}>
                    {open ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                </IconButton>
                {p.renderLeading?.(node)}
                <Box sx={{ flex: 1, minWidth: 0, cursor: p.onTitleClick ? 'pointer' : 'default' }} onClick={() => p.onTitleClick?.(node)}>
                    <Typography variant="body2" sx={{ fontWeight: hasKids ? 700 : 500 }} noWrap>
                        {node.title}
                    </Typography>
                    {p.renderMeta?.(node)}
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 260 }}>
                    {node.tags.map((t) => <Chip key={t} label={t} size="small" variant="outlined" />)}
                </Box>
                {p.renderActions?.(node)}
            </Box>
            {hasKids && open && node.children.map((c) => <Row key={c._id} node={c} level={level + 1} {...p} />)}
        </>
    );
};

export default function CurriculumTree(props: Props) {
    return <Box>{props.nodes.map((n) => <Row key={n._id} node={n} level={0} {...props} />)}</Box>;
}