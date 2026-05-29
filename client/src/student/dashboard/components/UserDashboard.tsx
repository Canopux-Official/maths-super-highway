import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';
import { useQuery } from '@tanstack/react-query';

import UserProfileCard from './UserProfileCard';
import UserStatCard from './UserStatCard';
import { userDashboardService, type UserStats } from '../services/api';
import UserRecentEnrollments from './UserRecentEnrollment';

interface UserDashboardProps {
  userId: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId }) => {
  const { data: stats, isLoading: loading, error } = useQuery({
    queryKey: ['userDashboardStats', userId],
    queryFn: async () => {
      const data = await userDashboardService.getStats(userId);
      return data;
    },
    enabled: !!userId,
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress size={36} sx={{ color: '#1A237E' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load dashboard. Please try again.</Alert>
      </Box>
    );
  }

  if (!stats) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page heading */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1A237E' }}>
        My Dashboard
      </Typography>

      {/* Stat cards row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          '& > *': { flex: '1 1 180px' },
        }}
      >
        <UserStatCard
          label="Total Enrollments"
          value={stats.enrollments.total}
          Icon={SchoolIcon}
        />
        <UserStatCard
          label="Testimonials"
          value={stats.testimonials.total}
          Icon={RateReviewIcon}
        />
        <UserStatCard
          label="Average Rating"
          value={stats.testimonials.averageRating.toFixed(1)}
          Icon={StarIcon}
          iconColor="#F9A825"
        />
      </Box>

      {/* Profile + Recent Enrollments row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: '1 1 240px', maxWidth: { md: '33%' } }}>
          <UserProfileCard user={stats.user} />
        </Box>
        <Box sx={{ flex: '2 1 320px' }}>
          <UserRecentEnrollments recent={stats.enrollments.recent} />
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;