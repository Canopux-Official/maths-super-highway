import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, IconButton, 
    Stack, Chip, Switch, Tabs, Tab,
} from '@mui/material';
import { Delete, Person } from '@mui/icons-material';
import { userService } from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentTab, setCurrentTab] = useState('student');
    const [_, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [form, setForm] = useState({ phone: '', dob: '' });

    const loadUsers = async () => {
        const res = await userService.getUsers();
        // Filter out admins immediately so they never show in the list
        if (res.success) {
            const nonAdmins = res.data.filter((u: any) => u.role !== 'admin');
            setUsers(nonAdmins);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    // Filter users based on the selected tab
    const filteredUsers = users.filter((u: any) => u.role === currentTab);

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleOpenEdit = (user: any) => {
        setEditingUser(user);
        const formattedDate = user.dob ? new Date(user.dob).toISOString().split('T')[0] : '';
        setForm({ phone: user.phone || '', dob: formattedDate });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        const res = await userService.updateUser(editingUser._id, form);
        if (res.success) {
            setIsModalOpen(false);
            loadUsers();
        }
    };

    const handleStatusToggle = async (user: any) => {
        const res = await userService.updateUser(user._id, { isActive: !user.isActive });
        if (res.success) loadUsers();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(`Delete this ${currentTab} permanently?`)) {
            const res = await userService.deleteUser(id);
            if (res.success) loadUsers();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>User Directory</Typography>

            {/* Role Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                    <Tab label="Students" value="student" />
                    <Tab label="Parents" value="parent" />
                    <Tab label="Colleges" value="college" />
                </Tabs>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Contact Info</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user: any) => (
                                <TableRow key={user._id} hover>
                                    <TableCell>
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1.5, display: 'flex' }}>
                                            <Person sx={{ color: 'primary.main' }} />
                                            <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{user.email}</Typography>
                                        <Typography variant="caption" color="text.secondary">{user.phone || 'No phone'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, display: 'flex' }}>
                                            <Chip 
                                                label={user.isActive ? "Active" : "Inactive"} 
                                                color={user.isActive ? "success" : "default"} 
                                                size="small" 
                                            />
                                            <Switch 
                                                checked={user.isActive} 
                                                onChange={() => handleStatusToggle(user)}
                                                size="small"
                                            />
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 1, display: 'flex' }}>
                                            {/* <IconButton onClick={() => handleOpenEdit(user)} color="primary"><Edit fontSize="small" /></IconButton> */}
                                            <IconButton onClick={() => handleDelete(user._id)} color="error"><Delete fontSize="small" /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No {currentTab}s found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            {/* <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>Edit {currentTab} Details</DialogTitle>
                <DialogContent>
                    <Stack sx={{ gap: 3, mt: 2, display: 'flex' }}>
                        <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                        <TextField 
                            label="Date of Birth" 
                            type="date" 
                            fullWidth 
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={form.dob} 
                            onChange={(e) => setForm({...form, dob: e.target.value})} 
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog> */}
        </Box>
    );
};

export default UserManagement;