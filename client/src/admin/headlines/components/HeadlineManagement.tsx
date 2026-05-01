import { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Stack, Dialog, DialogTitle, DialogContent, TextField, 
    DialogActions, Chip, Switch, Link
} from '@mui/material';
import { Add, Edit, Delete, Announcement, Link as LinkIcon } from '@mui/icons-material';
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
            alert(res.message); // Handle the "Duplicate text" error from your controller
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this headline?")) {
            const res = await headlineService.deleteHeadline(id);
            if (res.success) loadHeadlines();
        }
    };

    const toggleLiveStatus = async (headline: any) => {
        const res = await headlineService.updateHeadline(headline._id, { ...headline, isLive: !headline.isLive });
        if (res.success) loadHeadlines();
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 4, display: 'flex' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.dark' }}>System Headlines</Typography>
                    <Typography variant="body2" color="text.secondary">Announcements shown on the user dashboard</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()} sx={{ borderRadius: 2 }}>
                    Add Headline
                </Button>
            </Stack>

            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Headline Content</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Attached Link</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {headlines.map((item: any) => (
                            <TableRow key={item._id} hover>
                                <TableCell sx={{ maxWidth: 400 }}>
                                    <Stack sx={{ flexDirection: 'row', gap: 1.5, display: 'flex' }}>
                                        <Announcement color="action" sx={{ mt: 0.5 }} />
                                        <Typography sx={{ fontWeight: 500 }}>{item.text}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {item.link ? (
                                        <Link href={item.link} target="_blank" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none' }}>
                                            <LinkIcon fontSize="inherit" /> View Link
                                        </Link>
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">No Link</Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, display: 'flex' }}>
                                        <Chip 
                                            label={item.isLive ? "Live" : "Hidden"} 
                                            color={item.isLive ? "success" : "default"} 
                                            size="small"
                                            variant={item.isLive ? "filled" : "outlined"}
                                        />
                                        <Switch 
                                            size="small" 
                                            checked={item.isLive} 
                                            onChange={() => toggleLiveStatus(item)} 
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 1, display: 'flex' }}>
                                        <IconButton onClick={() => handleOpenModal(item)} color="primary" size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(item._id)} color="error" size="small">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for Add/Update */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Headline' : 'Create New Headline'}</DialogTitle>
                <DialogContent>
                    <Stack sx={{ gap: 3, mt: 2, display: 'flex' }}>
                        <TextField 
                            label="Headline Text" 
                            fullWidth 
                            multiline 
                            rows={2}
                            value={form.text} 
                            onChange={(e) => setForm({...form, text: e.target.value})} 
                            placeholder="Example: Mid-term results have been published."
                        />
                        <TextField 
                            label="Action Link (Optional)" 
                            fullWidth 
                            value={form.link} 
                            onChange={(e) => setForm({...form, link: e.target.value})} 
                            placeholder="https://..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingId ? 'Update Headline' : 'Publish Headline'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HeadlineManagement;
