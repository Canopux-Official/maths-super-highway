import React from 'react';
import { Box, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InlineFileViewer from './InlinePdfViewer';

interface LessonContentCardProps {
  content: string;
}

const LessonContentCard: React.FC<LessonContentCardProps> = ({ content }) => (
  <Box
    sx={{
      bgcolor: '#fff',
      border: '1px solid #E9EEF5',
      borderRadius: { xs: '14px', sm: '18px' },
      overflow: 'hidden',
      mb: { xs: 3, sm: 4 },
      boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)',
    }}
  >
    {/* Section header */}
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: { xs: 1.5, sm: 2 },
        borderBottom: '1px solid #F1F5F9',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: '#FAFBFD',
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '9px',
          bgcolor: '#EFF6FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <MenuBookIcon sx={{ fontSize: 16, color: '#1D4ED8' }} />
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: '0.85rem', sm: '0.9rem' },
          color: '#0F172A',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '-0.01em',
        }}
      >
        Lesson Content
      </Typography>
    </Box>

    {/* File viewer — PDF or iframe */}
    <InlineFileViewer content={content} />
  </Box>
);

export default LessonContentCard;