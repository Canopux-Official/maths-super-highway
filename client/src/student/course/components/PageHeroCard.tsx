import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StatPill from './StatPill';

interface PageHeroCardProps {
  title: string;
  enrolledCount: number;
  isEnrolled: boolean;
  enrollLoading: boolean;
  onEnroll: () => void;
  onUnenroll: () => void;
}

const PageHeroCard: React.FC<PageHeroCardProps> = ({
  title,
  enrolledCount,
  isEnrolled,
  enrollLoading,
  onEnroll,
  onUnenroll,
}) => (
  <Box
    sx={{
      background: 'linear-gradient(135deg, #0A1628 0%, #0F2952 50%, #1D4ED8 100%)',
      borderRadius: { xs: '14px', sm: '20px' },
      p: { xs: 2.5, sm: 4 },
      mb: 3,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Decorative blobs */}
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: { xs: 100, sm: 160 },
        height: { xs: 100, sm: 160 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        bottom: -30,
        left: '20%',
        width: { xs: 80, sm: 120 },
        height: { xs: 80, sm: 120 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    <Box sx={{ position: 'relative', zIndex: 1 }}>
      {/* Lesson tag */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          mb: 2,
          bgcolor: 'rgba(6,182,212,0.15)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '6px',
          px: 1.25,
          py: 0.4,
        }}
      >
        <MenuBookIcon sx={{ fontSize: 12, color: '#06B6D4' }} />
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: '#06B6D4',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Lesson
        </Typography>
      </Box>

      {/* Title + enroll button row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800,
            fontSize: { xs: '1.1rem', sm: '1.55rem' },
            color: '#fff',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            flex: 1,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {isEnrolled ? (
            <>
              <Chip
                icon={
                  <CheckCircleIcon
                    sx={{ color: '#4ADE80 !important', fontSize: '15px !important' }}
                  />
                }
                label="Enrolled"
                sx={{
                  bgcolor: 'rgba(22,163,74,0.15)',
                  color: '#4ADE80',
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem',
                  border: '1px solid rgba(74,222,128,0.3)',
                  px: 0.5,
                }}
              />
              <Button
                variant="outlined"
                onClick={onUnenroll}
                disabled={enrollLoading}
                size="small"
                sx={{
                  color: '#F87171',
                  borderColor: 'rgba(248,113,113,0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  '&:hover': {
                    borderColor: '#F87171',
                    bgcolor: 'rgba(248,113,113,0.08)',
                  },
                }}
              >
                {enrollLoading ? 'Wait…' : 'Unenroll'}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={onEnroll}
              disabled={enrollLoading}
              disableElevation
              sx={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '11px',
                px: { xs: 2.5, sm: 3.5 },
                py: 1.1,
                fontSize: '0.88rem',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '-0.01em',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
                  boxShadow: '0 6px 20px rgba(6,182,212,0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {enrollLoading ? 'Enrolling…' : 'Enroll Now →'}
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <StatPill
          icon={<PeopleIcon sx={{ fontSize: 14, color: '#06B6D4' }} />}
          label="Enrolled"
          value={enrolledCount.toLocaleString()}
        />
      </Box>
    </Box>
  </Box>
);

export default PageHeroCard;