import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Alert,
  Skeleton, Divider
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import AdminStatCard from './AdminStatsCard';
import AdminTopCourses from './AdminTopCourses';
import AdminTestimonialsSection from './AdminTestimonials';
import AdminUsersSection from './AdminUserSection';
import { adminDashboardService, type AdminStats } from '../services/api';

// Simple responsive flex grid helper
const FlexRow: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 2 }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap }}>
    {children}
  </Box>
);

const FlexCell: React.FC<{ children: React.ReactNode; xs?: string; sm?: string; md?: string }> = ({
  children,
  xs = '100%',
  sm = 'calc(50% - 8px)',
  md = 'calc(33.333% - 11px)',
}) => (
  <Box sx={{ width: { xs, sm, md } }}>
    {children}
  </Box>
);

const StatSkeleton = () => (
  <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminDashboardService
      .getStats()
      .then(setStats)
      .catch(() => setError('Failed to load admin dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 5, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: '#1A237E', fontWeight: 700, letterSpacing: 1 }}>
            Admin Panel
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
            Dashboard
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* ── Stat Cards ── */}
        <FlexRow gap={2}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <FlexCell key={i}><StatSkeleton /></FlexCell>
            ))
          ) : stats ? (
            <>
              <FlexCell>
                <AdminStatCard
                  label="Total Users"
                  value={stats.users.total}
                  Icon={PeopleAltOutlinedIcon}
                />
              </FlexCell>
              <FlexCell>
                <AdminStatCard
                  label="Total Folders"
                  value={stats.courses.totalFolders}
                  Icon={FolderOpenIcon}
                />
              </FlexCell>
              <FlexCell>
                <AdminStatCard
                  label="Total Pages"
                  value={stats.courses.totalPages}
                  Icon={ArticleOutlinedIcon}
                />
              </FlexCell>
              <FlexCell>
                <AdminStatCard
                  label="Total Enrollments"
                  value={stats.enrollments.total}
                  Icon={HowToRegOutlinedIcon}
                />
              </FlexCell>
              <FlexCell>
                <AdminStatCard
                  label="Live Headlines"
                  value={stats.headlines.live}
                  Icon={CampaignOutlinedIcon}
                />
              </FlexCell>
              <FlexCell>
                <AdminStatCard
                  label="Avg. Rating"
                  value={`${stats.testimonials.averageRating} / 5`}
                  Icon={StarOutlinedIcon}
                  iconColor="#f59e0b"
                />
              </FlexCell>
            </>
          ) : null}
        </FlexRow>

        <Divider sx={{ my: 4 }} />

        {/* ── Detail Sections ── */}
        {loading ? (
          <FlexRow gap={2}>
            {[1, 2, 3].map((i) => (
              <FlexCell key={i} md="calc(33.333% - 11px)">
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
              </FlexCell>
            ))}
          </FlexRow>
        ) : stats ? (
          <FlexRow gap={2}>
            {/* Users */}
            <FlexCell xs="100%" sm="100%" md="calc(33.333% - 11px)">
              <AdminUsersSection users={stats.users} />
            </FlexCell>

            {/* Top Courses */}
            <FlexCell xs="100%" sm="100%" md="calc(33.333% - 11px)">
              <AdminTopCourses topCourses={stats.enrollments.topCourses} />
            </FlexCell>

            {/* Testimonials */}
            <FlexCell xs="100%" sm="100%" md="calc(33.333% - 11px)">
              <AdminTestimonialsSection testimonials={stats.testimonials} />
            </FlexCell>
          </FlexRow>
        ) : null}

      </Container>
    </Box>
  );
};

export default AdminDashboard;