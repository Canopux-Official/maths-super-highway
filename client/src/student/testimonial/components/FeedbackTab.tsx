import { useMemo, useState } from 'react';
import {
    Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress,
    Paper, Rating, Stack, TextField, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseService } from '../../course/services/api';
import { testimonialService, type MyReview } from '../services/api';
import { buildTree, collectAllIds, pathTo, pruneToLeaves, type TreeNode } from '../../../utils/courseTree';
import CurriculumTree from '../../../admin/courses/components/CurriCulumTree';

const MIN = 20;
const MAX = 1000;
const errMsg = (e: any) => e?.response?.data?.message ?? 'Something went wrong. Please try again.';

type Editing = { node: { _id: string; title: string }; review?: MyReview } | null;

export default function FeedbackTab() {
    const qc = useQueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: flat = [], isLoading } = useQuery({ queryKey: ['user-tree'], queryFn: courseService.getTree });
    const { data: selections = [] } = useQuery({ queryKey: ['my-selections'], queryFn: courseService.getMySelections });
    const { data: mine } = useQuery({ queryKey: ['my-feedback'], queryFn: testimonialService.getMine });

    const reviews = mine?.reviews ?? [];
    const used = mine?.used ?? 0;
    const limit = mine?.limit ?? 5;
    const byNode = useMemo(() => new Map(reviews.map((r) => [r.courseId, r])), [reviews]);

    // What the student holds, grouped under parents (same layout as My Superhighway)
    const tree = useMemo(
        () => pruneToLeaves(buildTree(flat), new Set(selections.map((s) => s.courseId))),
        [flat, selections]
    );
    const shownIds = useMemo(() => new Set(collectAllIds(tree)), [tree]);
    // Reviewed topics that were unticked later: still listed so they can be edited
    const orphaned = useMemo(
        () => reviews.filter((r) => !shownIds.has(r.courseId) && flat.some((n) => n._id === r.courseId)),
        [reviews, shownIds, flat]
    );

    const [expanded, setExpanded] = useState<Set<string> | null>(null);
    const open = expanded ?? new Set(collectAllIds(tree));
    const toggle = (id: string) =>
        setExpanded((s) => { const x = new Set(s ?? open); x.has(id) ? x.delete(id) : x.add(id); return x; });

    const [editing, setEditing] = useState<Editing>(null);
    const [rating, setRating] = useState<number | null>(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [done, setDone] = useState('');

    const openDialog = (node: { _id: string; title: string }) => {
        const review = byNode.get(node._id);
        setEditing({ node, review });
        setRating(review?.rating ?? 0);
        setMessage(review?.message ?? '');
        setError('');
    };

    const save = useMutation({
        mutationFn: () =>
            editing!.review
                ? testimonialService.update(editing!.review._id, { rating: rating!, message: message.trim() })
                : testimonialService.create({ courseId: editing!.node._id, rating: rating!, message: message.trim() }),
        onSuccess: () => {
            setDone(editing!.review ? 'Your feedback was updated.' : 'Thank you for your feedback!');
            setEditing(null);
            qc.invalidateQueries({ queryKey: ['my-feedback'] });
        },
        onError: (e) => setError(errMsg(e)),
    });

    const submit = () => {
        if (!rating) return setError('Please choose a star rating.');
        if (message.trim().length < MIN) return setError(`Please write at least ${MIN} characters.`);
        setError('');
        save.mutate();
    };

    const limitReached = used >= limit;

    const action = (n: { _id: string; title: string }) => {
        const r = byNode.get(n._id);
        if (r) {
            return (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.5 }}>
                    <Rating value={r.rating} readOnly size="small" />
                    <Button size="small" onClick={() => openDialog(n)}>Edit</Button>
                </Stack>
            );
        }
        return (
            <Button size="small" variant="outlined" disabled={limitReached} onClick={() => openDialog(n)} sx={{ whiteSpace: 'nowrap' }}>
                Give feedback
            </Button>
        );
    };

    return (
        <Box sx={{ p: 0, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                Please provide your valuable feedback
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You can give feedback on up to {limit} topics. You can edit it later, but not delete it.
            </Typography>

            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, mb: 2 }}>
                <Typography variant="subtitle2">{used} of {limit} feedbacks used</Typography>
                <LinearProgress variant="determinate" value={(used / limit) * 100} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
                {limitReached && <Typography variant="caption" color="text.secondary">You have used all {limit} feedbacks. You can still edit them.</Typography>}
            </Paper>

            {done && <Alert severity="success" onClose={() => setDone('')} sx={{ mb: 1 }}>{done}</Alert>}

            <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
                {isLoading && <Typography sx={{ p: 2 }}>Loading…</Typography>}
                {!isLoading && !tree.length && !orphaned.length && (
                    <Typography sx={{ p: 2 }} color="text.secondary">
                        Select topics in All Courses first. Then you can give feedback on them here.
                    </Typography>
                )}
                <CurriculumTree nodes={tree} expanded={open} onToggle={toggle} renderActions={(n: TreeNode) => action(n)} />
                {orphaned.length > 0 && (
                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">No longer selected</Typography>
                        {orphaned.map((r) => {
                            const title = pathTo(flat, r.courseId).slice(-1)[0];
                            return (
                                <Stack
                                    key={r._id}
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1}
                                    sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, py: 0.75 }}
                                >
                                    <Typography variant="body2" sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{title}</Typography>
                                    <Chip size="small" label="No longer selected" />
                                    {action({ _id: r.courseId, title })}
                                </Stack>
                            );
                        })}
                    </Box>
                )}
            </Paper>

            <Dialog
                open={!!editing}
                onClose={() => setEditing(null)}
                fullWidth
                maxWidth="sm"
                fullScreen={isMobile}
            >
                <DialogTitle>{editing?.review ? 'Edit your feedback' : 'Give feedback'}</DialogTitle>
                <DialogContent>
                    {editing && (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {pathTo(flat, editing.node._id).slice(0, -1).join(' › ') || 'Top level'}
                                </Typography>
                                <Typography sx={{ fontWeight: 700 }}>{editing.node.title}</Typography>
                            </Box>
                            <Rating size="large" value={rating} onChange={(_e, v) => setRating(v)} />
                            <TextField
                                label="Your feedback" multiline minRows={4} value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                slotProps={{ htmlInput: { maxLength: MAX } }}
                                helperText={`${message.trim().length}/${MAX} (minimum ${MIN} characters)`}
                            />
                            {editing.review && (
                                <Typography variant="caption" color="text.secondary">
                                    If this was shown on our website, it will be reviewed again after you edit.
                                </Typography>
                            )}
                            {error && <Alert severity="error">{error}</Alert>}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditing(null)}>Cancel</Button>
                    <Button variant="contained" disabled={save.isPending} onClick={submit}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}