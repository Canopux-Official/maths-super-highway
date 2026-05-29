import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
    Chip, Switch, Avatar, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Delete, Person, Groups, School, AccountBalance } from '@mui/icons-material';
import { userService } from '../services/api';

const roleConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; tab: string }> = {
    student: { label: 'Students', icon: <School sx={{ fontSize: 15 }} />, color: '#1D4ED8', bg: 'rgba(29,78,216,0.08)', tab: 'student' },
    parent: { label: 'Parents', icon: <Groups sx={{ fontSize: 15 }} />, color: '#0891B2', bg: 'rgba(8,145,178,0.08)', tab: 'parent' },
    college: { label: 'Colleges', icon: <AccountBalance sx={{ fontSize: 15 }} />, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', tab: 'college' },
};

const UserManagement = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentTab, setCurrentTab] = useState('student');

    // Fetch all users
    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const res = await userService.getUsers();
            if (res.success) {
                return res.data.filter((u: any) => u.role !== 'admin');
            }
            throw new Error('Failed to fetch users');
        }
    });

    // Toggle status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async (user: any) => {
            const res = await userService.updateUser(user._id, { isActive: !user.isActive });
            if (!res.success) throw new Error('Update failed');
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await userService.deleteUser(id);
            if (!res.success) throw new Error('Delete failed');
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
    });

    const filteredUsers = users.filter((u: any) => u.role === currentTab);

    const handleStatusToggle = (user: any) => {
        toggleStatusMutation.mutate(user);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Delete this ${currentTab} permanently?`)) {
            deleteUserMutation.mutate(id);
        }
    };

    const countByRole = (role: string) => (users as any[]).filter((u: any) => u.role === role).length;

    return (
        <Box>
            {/* ── Header ── */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', mb: 0.5 }}>
                    Directory
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                    Manage and monitor all registered users on the platform
                </Typography>
            </Box>

            {/* ── Custom Role Tabs ── */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                {Object.entries(roleConfig).map(([role, cfg]) => {
                    const active = currentTab === role;
                    const count = countByRole(role);
                    return (
                        <Box
                            key={role}
                            onClick={() => setCurrentTab(role)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1.25,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                border: '1px solid',
                                borderColor: active ? cfg.color : '#E2E8F0',
                                bgcolor: active ? cfg.bg : '#fff',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                '&:hover': { borderColor: cfg.color, bgcolor: cfg.bg },
                            }}
                        >
                            <Box sx={{ color: active ? cfg.color : '#94A3B8', display: 'flex', transition: 'color 0.2s' }}>
                                {cfg.icon}
                            </Box>
                            <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.875rem', color: active ? cfg.color : '#64748B', fontFamily: "'Inter', sans-serif", transition: 'color 0.2s' }}>
                                {cfg.label}
                            </Typography>
                            <Box sx={{ minWidth: 22, height: 22, borderRadius: '6px', bgcolor: active ? cfg.color : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: active ? '#fff' : '#64748B', fontFamily: "'Inter', sans-serif" }}>
                                    {count}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* ── Table ── */}
            <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                {['User', 'Contact Info', 'Quick Info', 'Status', 'Actions'].map((h, i) => (
                                    <TableCell key={h} align={i === 4 ? 'right' : 'left'} sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', fontFamily: "'Inter', sans-serif", py: 1.75, borderBottom: '1px solid #E2E8F0' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user: any, idx: number) => {
                                    const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                                    const cfg = roleConfig[currentTab];
                                    return (
                                        <TableRow
                                            key={user._id}
                                            sx={{
                                                '&:hover': { bgcolor: '#F8FAFC' },
                                                borderBottom: idx < filteredUsers.length - 1 ? '1px solid #F1F5F9' : 'none',
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            {/* User */}
                                            <TableCell sx={{ py: 1.75 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 36, height: 36, bgcolor: cfg.bg, color: cfg.color, fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                                                        {initials}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0A1628', fontFamily: "'Inter', sans-serif" }}>{user.name}</Typography>
                                                        <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Contact */}
                                            <TableCell sx={{ py: 1.75 }}>
                                                <Typography sx={{ fontSize: '0.875rem', color: '#334155', fontFamily: "'Inter', sans-serif" }}>{user.email}</Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>{user.phone || 'No phone'}</Typography>
                                            </TableCell>

                                            {/* Quick Info */}
                                            <TableCell sx={{ py: 1.75 }}>
                                                <Typography sx={{ fontSize: '0.875rem', color: '#334155', fontFamily: "'Inter', sans-serif" }}>
                                                    Joined: {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                                </Typography>
                                                {user.dob && (
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>
                                                        DOB: {new Date(user.dob).toLocaleDateString('en-GB')}
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell sx={{ py: 1.75 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={user.isActive ? 'Active' : 'Inactive'}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            fontSize: '0.7rem',
                                                            fontFamily: "'Inter', sans-serif",
                                                            bgcolor: user.isActive ? 'rgba(22,163,74,0.10)' : 'rgba(100,116,139,0.10)',
                                                            color: user.isActive ? '#16A34A' : '#64748B',
                                                            border: '1px solid',
                                                            borderColor: user.isActive ? 'rgba(22,163,74,0.25)' : 'rgba(100,116,139,0.2)',
                                                        }}
                                                    />
                                                    <Switch
                                                        size="small"
                                                        checked={user.isActive}
                                                        onChange={() => handleStatusToggle(user)}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#16A34A' },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#16A34A' },
                                                        }}
                                                    />
                                                </Box>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell align="right" sx={{ py: 1.75 }}>
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="View Profile">
                                                        <IconButton
                                                            onClick={() => navigate(`/admin/users/${user._id}`)}
                                                            size="small"
                                                            sx={{ color: '#1D4ED8', bgcolor: 'rgba(29,78,216,0.06)', borderRadius: '8px', width: 32, height: 32, '&:hover': { bgcolor: 'rgba(29,78,216,0.12)' } }}
                                                        >
                                                            <Person sx={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            onClick={() => handleDelete(user._id)}
                                                            size="small"
                                                            sx={{ color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)', borderRadius: '8px', width: 32, height: 32, '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' } }}
                                                        >
                                                            <Delete sx={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <Person sx={{ fontSize: 40, color: '#CBD5E1', mb: 1, display: 'block', mx: 'auto' }} />
                                        <Typography sx={{ color: '#94A3B8', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem' }}>
                                            No {roleConfig[currentTab].label.toLowerCase()} found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default UserManagement;
