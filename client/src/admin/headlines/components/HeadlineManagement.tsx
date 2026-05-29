import { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Stack, Dialog, DialogTitle, DialogContent, TextField,
    DialogActions, Chip, Switch, Link, Divider, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Link as LinkIcon, Campaign as CampaignIcon, FiberManualRecord as DotIcon, OpenInNew } from '@mui/icons-material';
import { headlineService } from '../services/api';

const HeadlineManagement = () => {
    const [headlines, setHeadlines] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ text: '', link: '', isLive: true });

    const loadHeadlines = async () => {
        const res = await headlineService.getAllHeadlines();
        if (res.success) setHeadlines(res.data);
    };

    useEffect(() => { loadHeadlines(); }, []);

    const handleOpenModal = (headline?: any) => {
        if (headline) {
            setEditingId(headline._id);
            setForm({ text: headline.text, link: headline.link || '', isLive: headline.isLive });
        } else {
            setEditingId(null);
            setForm({ text: '', link: '', isLive: true });
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

        let res;
        if (editingId) {
            res = await headlineService.updateHeadline(editingId, form);
        } else {
            res = await headlineService.createHeadline(form);
        }
        if (res.success) {
            setIsModalOpen(false);
            loadHeadlines();
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Remove this announcement?')) {
            const res = await headlineService.deleteHeadline(id);
            if (res.success) loadHeadlines();
        }
    };

    const toggleLiveStatus = async (headline: any) => {
        const res = await headlineService.updateHeadline(headline._id, { ...headline, isLive: !headline.isLive });
        if (res.success) loadHeadlines();
    };

    const liveCount = (headlines as any[]).filter((h: any) => h.isLive).length;

    return (
        <Box>
            {/* ── Page Header ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', mb: 0.5 }}>
                        Announcements
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                        Manage live news ticker content shown on the student portal
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
                    { label: 'Hidden', value: (headlines as any[]).length - liveCount, color: '#64748B', bg: 'rgba(100,116,139,0.08)' },
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                icon={<DotIcon sx={{ fontSize: '8px !important' }} />}
                                                label={item.isLive ? 'Live' : 'Hidden'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    fontFamily: "'Inter', sans-serif",
                                                    bgcolor: item.isLive ? 'rgba(22,163,74,0.10)' : 'rgba(100,116,139,0.10)',
                                                    color: item.isLive ? '#16A34A' : '#64748B',
                                                    border: '1px solid',
                                                    borderColor: item.isLive ? 'rgba(22,163,74,0.25)' : 'rgba(100,116,139,0.2)',
                                                    '& .MuiChip-icon': { color: item.isLive ? '#16A34A' : '#94A3B8', ml: 0.5 },
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
        </Box>
    );
};

export default HeadlineManagement;
