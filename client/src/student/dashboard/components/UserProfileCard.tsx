import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import type { UserStats } from '../services/api';
import PersonIcon from '@mui/icons-material/Person';


interface UserProfileCardProps {
  user: UserStats['user'];
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const memberSince = new Date(user.memberSince).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <PersonIcon sx={{ color: '#1A237E', fontSize: 22 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            My Profile
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Name</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Phone</Typography>
            <Typography variant="body2">{user.phone}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Role</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={user.role} size="small" color="primary" variant="outlined" />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Member Since</Typography>
            <Typography variant="body2">{memberSince}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;