import { useMemo, useState } from 'react';
import {
    Alert, Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel,
    IconButton, MenuItem, Paper, Snackbar, Stack, Switch, TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseService } from '../services/api';
import { reviewService } from '../../testimonials/services/api';


import CurriculumTree from './CurriCulumTree';
import { buildTree, collectAllIds, collectTags, filterTree, type FlatNode, type TreeNode } from '../../../utils/courseTree';
import NodeReviewsDialog from './NodeReviewDialog';
import { exportTopicStudentsToExcel } from '../../../utils/excel';

const MAX_DEPTH = 6;

type FormState = { id?: string; parentId: string | null; title: string; description: string; tags: string[]; isActive: boolean; updatedAt?: string };
const emptyForm = (parentId: string | null): FormState => ({ parentId, title: '', description: '', tags: [], isActive: true });

const errMsg = (e: any) => e?.response?.data?.message ?? e?.message ?? 'Something went wrong';

// Every id in the subtree of `id` (used to stop "move into itself")
const subtreeIds = (flat: FlatNode[], id: string): Set<string> => {
    const out = new Set([id]);
    let grew = true;
    while (grew) {
        grew = false;
        flat.forEach((n) => { if (n.parentId && out.has(n.parentId) && !out.has(n._id)) { out.add(n._id); grew = true; } });
    }
    return out;
};

export default function CoursePage() {
    const qc = useQueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: flat = [], isLoading, error } = useQuery({ queryKey: ['admin-tree'], queryFn: courseService.getTree });
    const { data: counts = {} } = useQuery({ queryKey: ['admin-selection-counts'], queryFn: courseService.getSelectionCounts });

    const { data: reviewStats = {} } = useQuery({ queryKey: ['admin-review-stats'], queryFn: reviewService.getStats });

    const tree = useMemo(() => buildTree(flat), [flat]);
    const allTags = useMemo(() => collectTags(tree), [tree]);

    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState('');
    const [tag, setTag] = useState('');
    const [form, setForm] = useState<FormState | null>(null);
    const [moving, setMoving] = useState<{ node: TreeNode; target: string } | null>(null);
    const [deleting, setDeleting] = useState<{ node: TreeNode; nodes: number; selections: number } | null>(null);
    const [reviewing, setReviewing] = useState<TreeNode | null>(null);
    const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

    const filtering = !!(query.trim() || tag);
    const visible = useMemo(() => filterTree(tree, query, tag), [tree, query, tag]);
    const shownExpanded = useMemo(() => (filtering ? new Set(collectAllIds(visible)) : expanded), [filtering, visible, expanded]);

    const refresh = () => {
        qc.invalidateQueries({ queryKey: ['admin-tree'] });
        qc.invalidateQueries({ queryKey: ['admin-selection-counts'] });
    };
    const onError = (e: any) => setToast({ msg: errMsg(e), severity: 'error' });
    const onDone = (msg: string) => () => { refresh(); setToast({ msg, severity: 'success' }); };

    const save = useMutation({
        mutationFn: (f: FormState) =>
            f.id
                ? courseService.updateCourse(f.id, { title: f.title, description: f.description, tags: f.tags, isActive: f.isActive, expectedUpdatedAt: f.updatedAt })
                : courseService.createCourse({ title: f.title, description: f.description, tags: f.tags, isActive: f.isActive, parentId: f.parentId }),
        onSuccess: (_d, f) => {
            if (f.parentId) setExpanded((s) => new Set(s).add(f.parentId!));
            setForm(null);
            onDone('Saved')();
        },
        onError,
    });

    const move = useMutation({
        mutationFn: ({ id, target }: { id: string; target: string }) => courseService.moveCourse(id, target || null),
        onSuccess: () => { setMoving(null); onDone('Moved')(); },
        onError,
    });

    const downloadStudents = async (n: TreeNode) => {
        try {
            const res = await courseService.exportCourseStudents(n._id);
            if (!res.data?.length) {
                setToast({ msg: 'No students have selected this topic yet.', severity: 'error' });
                return;
            }
            exportTopicStudentsToExcel(res.data, n.title, pathLabel(n));
        } catch (e) {
            onError(e);
        }
    };

    const remove = useMutation({
        mutationFn: (id: string) => courseService.deleteCourse(id),
        onSuccess: (r) => { setDeleting(null); onDone(r.message)(); },
        onError,
    });

    const toggle = (id: string) =>
        setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const askDelete = async (node: TreeNode) => {
        try { setDeleting({ node, ...(await courseService.getDeletePreview(node._id)) }); } catch (e) { onError(e); }
    };

    // Parents the node may be moved under: not itself, not its descendants, and deep enough to fit
    const moveTargets = (node: TreeNode) => {
        const blocked = subtreeIds(flat, node._id);
        const height = Math.max(0, ...flat.filter((n) => blocked.has(n._id)).map((n) => n.depth)) - node.depth;
        return flat.filter((n) => !blocked.has(n._id) && n.depth + 1 + height < MAX_DEPTH);
    };
    const pathLabel = (n: FlatNode) => {
        const parts: string[] = [];
        let cur: FlatNode | undefined = n;
        while (cur) { parts.unshift(cur.title); cur = cur.parentId ? flat.find((x) => x._id === cur!.parentId) : undefined; }
        return parts.join(' › ');
    };

    return (
        <Box sx={{ p: { xs: 1, md: 3 }, minWidth: 0 }}>
            {/* Header: title, filters and buttons wrap instead of overflowing */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1.5, mb: 2, alignItems: { lg: 'center' } }}>
                <Typography variant="h5" sx={{ fontWeight: 800, flex: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    Course Curriculum
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <TextField size="small" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ flex: 1, minWidth: 0 }} />
                    <TextField size="small" select label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} sx={{ minWidth: 130 }}>
                        <MenuItem value="">All tags</MenuItem>
                        {allTags.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button onClick={() => setExpanded(new Set(collectAllIds(tree)))}>Expand all</Button>
                    <Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setForm(emptyForm(null))}>Add programme</Button>
                </Box>
            </Box>

            <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
                {isLoading && <Typography sx={{ p: 2 }}>Loading…</Typography>}
                {error && <Alert severity="error">{errMsg(error)}</Alert>}
                {!isLoading && !visible.length && <Typography sx={{ p: 2 }} color="text.secondary">Nothing to show.</Typography>}
                <CurriculumTree
                    nodes={visible}
                    expanded={shownExpanded}
                    onToggle={toggle}
                    renderMeta={(n: any) => (
                        <Typography variant="caption" color="text.secondary">
                            {n.children.length ? `${n.children.length} item(s)` : `${counts[n._id] ?? 0} student(s) selected`}
                            {reviewStats[n._id]?.allCount ? ` · ★ ${reviewStats[n._id].allAvg} (${reviewStats[n._id].allCount})` : ''}
                            {n.isActive === false && ' · hidden from students'}
                        </Typography>
                    )}
                    renderActions={(n: any) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 0, maxWidth: { xs: 120, sm: 'none' } }}>
                            <Tooltip title="Feedback"><IconButton size="small" onClick={() => setReviewing(n)}><RateReviewIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Add child"><span><IconButton size="small" disabled={n.depth + 1 >= MAX_DEPTH} onClick={() => setForm(emptyForm(n._id))}><AddIcon fontSize="small" /></IconButton></span></Tooltip>
                            <Tooltip title="Edit"><IconButton size="small" onClick={() => setForm({ id: n._id, parentId: n.parentId, title: n.title, description: n.description, tags: n.tags, isActive: n.isActive !== false, updatedAt: n.updatedAt })}><EditIcon fontSize="small" /></IconButton></Tooltip>
                            {n.children.length === 0 && (
                                <Tooltip title="Download students (Excel)"><IconButton size="small" onClick={() => downloadStudents(n)}><DownloadIcon fontSize="small" /></IconButton></Tooltip>
                            )}
                            <Tooltip title="Move under another parent"><IconButton size="small" onClick={() => setMoving({ node: n, target: n.parentId ?? '' })}><DriveFileMoveIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => askDelete(n)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                        </Box>
                    )}
                />
            </Paper>

            {/* Add / edit */}
            <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm" fullScreen={isMobile}>
                <DialogTitle>{form?.id ? 'Edit item' : form?.parentId ? 'Add child' : 'Add programme'}</DialogTitle>
                <DialogContent>
                    {form && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField label="Name" required autoFocus value={form.title} slotProps={{ htmlInput: { maxLength: 200 } }} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            <TextField label="Description" multiline minRows={3} value={form.description} slotProps={{ htmlInput: { maxLength: 5000 } }} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            <Autocomplete
                                multiple freeSolo options={allTags} value={form.tags}
                                onChange={(_e, v) => setForm({ ...form, tags: v.map((x) => String(x).trim()).filter(Boolean) })}
                                renderValue={(v, getProps) => v.map((t, i) => { const { key, ...p } = getProps({ index: i }); return <Chip key={key} label={t} size="small" {...p} />; })}
                                renderInput={(p) => <TextField {...p} label="Tags (type and press Enter)" helperText="e.g. HL, SL, BC only, IA, 15 h" />}
                            />
                            <FormControlLabel control={<Switch checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />} label="Visible to students" />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setForm(null)}>Cancel</Button>
                    <Button variant="contained" disabled={!form?.title.trim() || save.isPending} onClick={() => form && save.mutate(form)}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Move */}
            <Dialog open={!!moving} onClose={() => setMoving(null)} fullWidth maxWidth="sm" fullScreen={isMobile}>
                <DialogTitle sx={{ wordBreak: 'break-word' }}>Move “{moving?.node.title}”</DialogTitle>
                <DialogContent>
                    {moving && (
                        <TextField select fullWidth sx={{ mt: 1 }} label="New parent" value={moving.target} onChange={(e) => setMoving({ ...moving, target: e.target.value })}>
                            <MenuItem value="">(top level)</MenuItem>
                            {moveTargets(moving.node).map((n) => (
                                <MenuItem key={n._id} value={n._id} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{pathLabel(n)}</MenuItem>
                            ))}
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMoving(null)}>Cancel</Button>
                    <Button variant="contained" disabled={move.isPending || (moving?.target ?? '') === (moving?.node.parentId ?? '')} onClick={() => moving && move.mutate({ id: moving.node._id, target: moving.target })}>Move</Button>
                </DialogActions>
            </Dialog>

            {/* Delete */}
            <Dialog open={!!deleting} onClose={() => setDeleting(null)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ wordBreak: 'break-word' }}>Delete “{deleting?.node.title}”?</DialogTitle>
                <DialogContent>
                    <Typography>This removes {deleting?.nodes} item(s) and {deleting?.selections} student selection(s). It cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleting(null)}>Cancel</Button>
                    <Button color="error" variant="contained" disabled={remove.isPending} onClick={() => deleting && remove.mutate(deleting.node._id)}>Delete</Button>
                </DialogActions>
            </Dialog>

            <NodeReviewsDialog node={reviewing} onClose={() => setReviewing(null)} />

            <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)}>
                {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.msg}</Alert> : undefined}
            </Snackbar>
        </Box>
    );
}