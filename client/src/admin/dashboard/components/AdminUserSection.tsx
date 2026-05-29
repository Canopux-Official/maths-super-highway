import React from 'react';
import {
  Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableRow, Divider, Chip
} from '@mui/material'; 
import type { AdminStats } from '../services/api';

interface AdminUsersSectionProps {
  users: AdminStats['users'];
}

const roleColors: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning'> = {
  admin: 'primary',
  student: 'success',
  parent: 'secondary',
  college: 'warning',
};

const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({ users }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Users Overview
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">New This Week</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{users.newThisWeek}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">New This Month</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{users.newThisMonth}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Active</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>{users.active}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Inactive</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>{users.inactive}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          By Role
        </Typography>
        <Table size="small">
          <TableBody>
            {Object.entries(users.byRole).map(([role, count]) => (
              <TableRow key={role}>
                <TableCell sx={{ border: 'none', pl: 0 }}>
                  <Chip
                    label={role}
                    size="small"
                    color={roleColors[role] ?? 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ border: 'none', fontWeight: 600 }}>
                  {count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminUsersSection;