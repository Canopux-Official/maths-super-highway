import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, IconButton, Chip, Switch, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { targetExamAdminService } from '../services/api';
import ConfirmDialog from '../../../components/ConfirmDialog';

const TargetExamManagement = () => {
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', isActive: true });
    
    const [confirmState, setConfirmState] = useState<{ open: boolean, title: string, message: string, action: (() => void) | null, color: "primary" | "error" | "warning" }>({
        open: false, title: '', message: '', action: null, color: 'primary'
    });
    const handleCloseConfirm = () => setConfirmState({ ...confirmState, open: false });

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['adminTargetExams'],
        queryFn: targetExamAdminService.getTargetExams
    });

    const exams = response?.data || [];

    const createMutation = useMutation({
        mutationFn: targetExamAdminService.createTargetExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminTargetExams'] });
            setOpenDialog(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => targetExamAdminService.updateTargetExam(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminTargetExams'] });
            setOpenDialog(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: targetExamAdminService.deleteTargetExam,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminTargetExams'] })
    });

    const handleOpen = (exam?: any) => {
        if (exam) {
            setEditId(exam._id);
            setFormData({ name: exam.name, isActive: exam.isActive });
        } else {
            setEditId(null);
            setFormData({ name: '', isActive: true });
        }
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleSave = () => {
        if (editId) {
            updateMutation.mutate({ id: editId, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleToggleStatus = (exam: any) => {
        updateMutation.mutate({ id: exam._id, data: { isActive: !exam.isActive } });
    };

    const handleDelete = (id: string) => {
        setConfirmState({
            open: true,
            title: 'Delete Target Exam',
            message: 'Are you sure you want to delete this target exam? This action cannot be undone.',
            color: 'error',
            action: () => {
                deleteMutation.mutate(id);
                handleCloseConfirm();
            }
        });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', mb: 0.5 }}>
                        Target Exams
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                        Manage target exams for students to select during onboarding
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 3 }}
                >
                    Add Exam
                </Button>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : isError ? (
                <Typography color="error">Error loading target exams: {(error as any)?.message}</Typography>
            ) : (
                <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', py: 1.75 }}>
                                        Exam Name
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', py: 1.75 }}>
                                        Status
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', py: 1.75 }}>
                                        Created On
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', py: 1.75 }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exams.map((exam: any) => (
                                    <TableRow key={exam._id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.15s' }}>
                                        <TableCell sx={{ fontWeight: 600, color: '#0A1628', fontFamily: "'Inter', sans-serif" }}>
                                            {exam.name}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={exam.isActive ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700, fontSize: '0.7rem',
                                                        bgcolor: exam.isActive ? 'rgba(22,163,74,0.10)' : 'rgba(100,116,139,0.10)',
                                                        color: exam.isActive ? '#16A34A' : '#64748B',
                                                        border: '1px solid', borderColor: exam.isActive ? 'rgba(22,163,74,0.25)' : 'rgba(100,116,139,0.2)',
                                                    }}
                                                />
                                                <Switch
                                                    size="small"
                                                    checked={exam.isActive}
                                                    onChange={() => handleToggleStatus(exam)}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#16A34A' },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#16A34A' },
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                                            {new Date(exam.createdAt).toLocaleDateString('en-GB')}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        onClick={() => handleOpen(exam)}
                                                        size="small"
                                                        sx={{ color: '#1D4ED8', bgcolor: 'rgba(29,78,216,0.06)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(29,78,216,0.12)' } }}
                                                    >
                                                        <Edit sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => handleDelete(exam._id)}
                                                        size="small"
                                                        sx={{ color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' } }}
                                                    >
                                                        <Delete sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {exams.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                            <Typography sx={{ color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>
                                                No target exams found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editId ? 'Edit Target Exam' : 'Add Target Exam'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Exam Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">Status:</Typography>
                        <Switch
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {formData.isActive ? 'Active (Visible during signup)' : 'Inactive (Hidden)'}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, px: 3 }}>
                    <Button onClick={handleClose} sx={{ color: '#64748B' }}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={createMutation.isPending || updateMutation.isPending || !formData.name.trim()}
                    >
                        {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
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

export default TargetExamManagement;
