import { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Stack, Dialog, DialogTitle, DialogContent, TextField,
    DialogActions, Chip, Switch, Link, Divider, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Link as LinkIcon, Campaign as CampaignIcon, FiberManualRecord as DotIcon, OpenInNew } from '@mui/icons-material';
import { headlineService } from '../services/api';
import ConfirmDialog from '../../../components/ConfirmDialog';

/** ISO timestamp -> 'yyyy-mm-dd' for a date input (local time). */
const toDateInput = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** 'yyyy-mm-dd' -> ISO at the end of that day (local), so "until 24 Nov" includes all of 24 Nov. */
const endOfDayIso = (value: string) => (value ? new Date(`${value}T23:59:59`).toISOString() : null);
const isExpired = (h: { liveUntil?: string | null }) => !!h.liveUntil && new Date(h.liveUntil).getTime() <= Date.now();
const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const HeadlineManagement = () => {
    const [headlines, setHeadlines] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ text: '', link: '', isLive: true, liveUntil: '' });

    const [confirmState, setConfirmState] = useState<{ open: boolean, title: string, message: string, action: (() => void) | null, color: "primary" | "error" | "warning" }>({
        open: false, title: '', message: '', action: null, color: 'primary'
    });
    const handleCloseConfirm = () => setConfirmState({ ...confirmState, open: false });

    const loadHeadlines = async () => {
        const res = await headlineService.getAllHeadlines();
        if (res.success) setHeadlines(res.data);
    };

    useEffect(() => { loadHeadlines(); }, []);

    const handleOpenModal = (headline?: any) => {
        if (headline) {
            setEditingId(headline._id);
            setForm({ text: headline.text, link: headline.link || '', isLive: headline.isLive, liveUntil: toDateInput(headline.liveUntil) });
        } else {
            setEditingId(null);
            setForm({ text: '', link: '', isLive: true, liveUntil: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.text.trim()) {
            alert('Announcement text is required.');
            return;
        }
        if (form.text.length > 200) {
            alert('Announcement text must be 200 characters or less.');
            return;
        }
        if (form.link && !/^https?:\/\/.+/.test(form.link)) {
            alert('Link must be a valid URL starting with http:// or https://');
            return;
        }

        const payload = { ...form, liveUntil: endOfDayIso(form.liveUntil) };
        let res;
        if (editingId) {
            res = await headlineService.updateHeadline(editingId, payload);
        } else {
            res = await headlineService.createHeadline(payload);
        }
        if (res.success) {
            setIsModalOpen(false);
            loadHeadlines();
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async (id: string) => {
        setConfirmState({
            open: true,
            title: 'Remove Announcement',
            message: 'Are you sure you want to remove this announcement?',
            color: 'error',
            action: async () => {
                const res = await headlineService.deleteHeadline(id);
                if (res.success) loadHeadlines();
                handleCloseConfirm();
            }
        });
    };

    const toggleLiveStatus = async (headline: any) => {
        const res = await headlineService.updateHeadline(headline._id, { ...headline, isLive: !headline.isLive });
        if (res.success) loadHeadlines();
    };

    const liveCount = (headlines as any[]).filter((h: any) => h.isLive && !isExpired(h)).length;

    return (
        <Box>
            {/* ── Page Header ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', mb: 0.5 }}>
                        Announcements
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                        Shown in the Latest updates panel on the home page
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                    sx={{
                        background: 'linear-gradient(135deg, #0A1628, #1D4ED8)',
                        color: '#fff',
                        fontWeight: 700,
                        px: 2.5,
                        py: 1.25,
                        borderRadius: '10px',
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: '0 4px 16px rgba(29,78,216,0.3)',
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #112240, #2563EB)',
                            boxShadow: '0 6px 20px rgba(29,78,216,0.4)',
                            transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    New Announcement
                </Button>
            </Box>

            {/* ── Stats Row ── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Announcements', value: (headlines as any[]).length, color: '#0A1628', bg: 'rgba(10,22,40,0.06)' },
                    { label: 'Live Now', value: liveCount, color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
                    { label: 'Hidden or expired', value: (headlines as any[]).length - liveCount, color: '#64748B', bg: 'rgba(100,116,139,0.08)' },
                ].map(stat => (
                    <Box
                        key={stat.label}
                        sx={{
                            bgcolor: stat.bg,
                            border: '1px solid',
                            borderColor: stat.bg,
                            borderRadius: '10px',
                            px: 2.5,
                            py: 1.5,
                            minWidth: 140,
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: stat.color, fontFamily: "'Sora', sans-serif", lineHeight: 1, letterSpacing: '-0.02em' }}>
                            {stat.value}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.5 }}>
                            {stat.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* ── Table ── */}
            <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                {['Announcement Content', 'Link', 'Status', 'Actions'].map((h, i) => (
                                    <TableCell key={h} align={i === 3 ? 'right' : 'left'} sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', fontFamily: "'Inter', sans-serif", py: 1.75, borderBottom: '1px solid #E2E8F0' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(headlines as any[]).map((item: any, idx: number) => (
                                <TableRow
                                    key={item._id}
                                    sx={{
                                        '&:hover': { bgcolor: '#F8FAFC' },
                                        borderBottom: idx < (headlines as any[]).length - 1 ? '1px solid #F1F5F9' : 'none',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* Content */}
                                    <TableCell sx={{ maxWidth: 380, py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                            <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(29,78,216,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                                                <CampaignIcon sx={{ fontSize: 16, color: '#1D4ED8' }} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#0A1628', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                                                {item.text}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    {/* Link */}
                                    <TableCell sx={{ py: 2 }}>
                                        {item.link ? (
                                            <Link href={item.link} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#1D4ED8', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                                <LinkIcon sx={{ fontSize: 14 }} /> View Link <OpenInNew sx={{ fontSize: 12 }} />
                                            </Link>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>No link</Typography>
                                        )}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell sx={{ py: 2 }}>
                                        {(() => {
                                            const expired = item.isLive && isExpired(item);
                                            const state = !item.isLive ? 'hidden' : expired ? 'expired' : 'live';
                                            const palette = {
                                                live: { label: 'Live', fg: '#16A34A', bg: 'rgba(22,163,74,0.10)', bd: 'rgba(22,163,74,0.25)' },
                                                expired: { label: 'Expired', fg: '#B45309', bg: 'rgba(217,119,6,0.10)', bd: 'rgba(217,119,6,0.25)' },
                                                hidden: { label: 'Hidden', fg: '#64748B', bg: 'rgba(100,116,139,0.10)', bd: 'rgba(100,116,139,0.2)' },
                                            }[state];
                                            return (
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            icon={<DotIcon sx={{ fontSize: '8px !important' }} />}
                                                            label={palette.label}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem',
                                                                fontFamily: "'Inter', sans-serif",
                                                                bgcolor: palette.bg,
                                                                color: palette.fg,
                                                                border: '1px solid',
                                                                borderColor: palette.bd,
                                                                '& .MuiChip-icon': { color: palette.fg, ml: 0.5 },
                                                            }}
                                                        />
                                                        <Switch
                                                            size="small"
                                                            checked={item.isLive}
                                                            onChange={() => toggleLiveStatus(item)}
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#16A34A' },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#16A34A' },
                                                            }}
                                                        />
                                                    </Box>
                                                    {item.liveUntil && (
                                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: expired ? '#B45309' : '#64748B', fontFamily: "'Inter', sans-serif" }}>
                                                            {expired ? 'Ended' : 'Until'} {shortDate(item.liveUntil)}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            );
                                        })()}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell align="right" sx={{ py: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <IconButton
                                                onClick={() => handleOpenModal(item)}
                                                size="small"
                                                sx={{ color: '#1D4ED8', bgcolor: 'rgba(29,78,216,0.06)', borderRadius: '8px', width: 32, height: 32, '&:hover': { bgcolor: 'rgba(29,78,216,0.12)' } }}
                                            >
                                                <Edit sx={{ fontSize: 15 }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(item._id)}
                                                size="small"
                                                sx={{ color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)', borderRadius: '8px', width: 32, height: 32, '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' } }}
                                            >
                                                <Delete sx={{ fontSize: 15 }} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {(headlines as any[]).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                        <CampaignIcon sx={{ fontSize: 40, color: '#CBD5E1', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography sx={{ color: '#94A3B8', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem' }}>
                                            No announcements yet. Create your first one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* ── Create / Edit Dialog ── */}
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullWidth
                maxWidth="sm"
                slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif", fontSize: '1.1rem', pb: 1 }}>
                    {editingId ? 'Edit Announcement' : 'New Announcement'}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Announcement Text"
                            fullWidth
                            multiline
                            rows={3}
                            value={form.text}
                            onChange={(e) => setForm({ ...form, text: e.target.value })}
                            placeholder="E.g. Mid-term results have been published. Click the link to view."
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: '#E2E8F0' }, '&.Mui-focused fieldset': { borderColor: '#1D4ED8' } },
                                '& label.Mui-focused': { color: '#1D4ED8' },
                                fontFamily: "'Inter', sans-serif",
                            }}
                        />
                        <TextField
                            label="Action Link (Optional)"
                            fullWidth
                            value={form.link}
                            onChange={(e) => setForm({ ...form, link: e.target.value })}
                            placeholder="https://..."
                            slotProps={{ input: { startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 16, color: '#94A3B8' }} /></InputAdornment> } }}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: '#E2E8F0' }, '&.Mui-focused fieldset': { borderColor: '#1D4ED8' } },
                                '& label.Mui-focused': { color: '#1D4ED8' },
                            }}
                        />
                        <TextField
                            label="Show until (optional)"
                            type="date"
                            fullWidth
                            value={form.liveUntil}
                            onChange={(e) => setForm({ ...form, liveUntil: e.target.value })}
                            helperText="The announcement hides itself after this day. Leave empty to keep it up until you hide it."
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '10px', '& fieldset': { borderColor: '#E2E8F0' }, '&.Mui-focused fieldset': { borderColor: '#1D4ED8' } },
                                '& label.Mui-focused': { color: '#1D4ED8' },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
                    <Button
                        onClick={() => setIsModalOpen(false)}
                        sx={{ color: '#64748B', borderRadius: '8px', textTransform: 'none', fontFamily: "'Inter', sans-serif" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            background: 'linear-gradient(135deg, #0A1628, #1D4ED8)',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: '0 4px 16px rgba(29,78,216,0.25)',
                            '&:hover': { background: 'linear-gradient(135deg, #112240, #2563EB)' },
                        }}
                    >
                        {editingId ? 'Save Changes' : 'Publish'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog 
                open={confirmState.open} 
                title={confirmState.title} 
                message={confirmState.message} 
                onConfirm={() => confirmState.action && confirmState.action()} 
                onCancel={handleCloseConfirm} 
                confirmColor={confirmState.color} 
            />
        </Box>
    );
};

export default HeadlineManagement;
