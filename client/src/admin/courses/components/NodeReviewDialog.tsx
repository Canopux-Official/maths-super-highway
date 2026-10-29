import { useState } from 'react';
import {
    Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton,
    Paper, Rating, Stack, Switch, Tooltip, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../testimonials/services/api';

interface Props {
    node: { _id: string; title: string; childCount: number } | null;
    onClose: () => void;
}

const errMsg = (e: any) => e?.response?.data?.message ?? 'Something went wrong';

export default function NodeReviewsDialog({ node, onClose }: Props) {
    const qc = useQueryClient();
    const [inside, setInside] = useState(false);
    const [error, setError] = useState('');
    const key = ['node-reviews', node?._id, inside];

    const { data, isLoading } = useQuery({
        queryKey: key,
        queryFn: () => reviewService.getNodeReviews(node!._id, inside),
        enabled: !!node,
    });

    const refresh = () => {
        qc.invalidateQueries({ queryKey: ['node-reviews'] });
        qc.invalidateQueries({ queryKey: ['admin-review-stats'] });
    };
    const toggle = useMutation({
        mutationFn: (v: { id: string; on: boolean }) => reviewService.setVisibility(v.id, v.on),
        onSuccess: refresh,
        onError: (e) => setError(errMsg(e)),
    });
    const remove = useMutation({
        mutationFn: (id: string) => reviewService.deleteReview(id),
        onSuccess: refresh,
        onError: (e) => setError(errMsg(e)),
    });

    return (
        <Dialog open={!!node} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Feedback for “{node?.title}”</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{data?.average ? `★ ${data.average}` : '—'}</Typography>
                    <Typography color="text.secondary">{data?.count ?? 0} review(s)</Typography>
                    {!!node?.childCount && (
                        <FormControlLabel control={<Switch checked={inside} onChange={(e) => setInside(e.target.checked)} />} label="Include everything inside" />
                    )}
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    A review appears on the landing page only when it is switched on here and its topic has an average of 4.2 or more from at least 3 reviews.
                </Typography>
                {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 1 }}>{error}</Alert>}
                {isLoading && <Typography>Loading…</Typography>}
                {!isLoading && !data?.reviews.length && <Typography color="text.secondary">No feedback yet.</Typography>}

                <Stack spacing={1}>
                    {data?.reviews.map((r) => (
                        <Paper key={r._id} variant="outlined" sx={{ p: 1.5 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                                <Rating value={r.rating} readOnly size="small" />
                                <Typography variant="subtitle2">{r.studentName}</Typography>
                                <Typography variant="caption" color="text.secondary">{r.studentEmail}</Typography>
                                {inside && <Chip size="small" label={r.topic} />}
                                <Box sx={{ flex: 1 }} />
                                <Typography variant="caption" color="text.secondary">{new Date(r.updatedAt).toLocaleDateString()}</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ my: 1, whiteSpace: 'pre-wrap' }}>{r.message}</Typography>
                            <Stack direction="row" sx={{ alignItems: 'center' }}>
                                <FormControlLabel
                                    control={<Switch size="small" checked={r.showOnLanding} onChange={(e) => toggle.mutate({ id: r._id, on: e.target.checked })} />}
                                    label="Show on landing page"
                                />
                                <Box sx={{ flex: 1 }} />
                                <Tooltip title="Delete (gives the student the slot back)">
                                    <IconButton size="small" color="error" onClick={() => { if (window.confirm('Delete this feedback?')) remove.mutate(r._id); }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
        </Dialog>
    );
}