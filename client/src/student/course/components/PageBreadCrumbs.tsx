import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

interface BreadcrumbEntry {
  id: string;
  title: string;
}

interface PageBreadcrumbsProps {
  breadcrumbs: BreadcrumbEntry[];
  currentTitle: string;
  onBreadcrumbClick: (index: number) => void;
}

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({
  breadcrumbs,
  currentTitle,
  onBreadcrumbClick,
}) => (
  <Box
    sx={{
      mb: 3,
      display: 'inline-flex',
      alignItems: 'center',
      px: { xs: 1.25, sm: 1.5 },
      py: 0.75,
      bgcolor: '#F8FAFC',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      maxWidth: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      '&::-webkit-scrollbar': { display: 'none' },
    }}
  >
    <Breadcrumbs
      maxItems={3}
      itemsAfterCollapse={1}
      itemsBeforeCollapse={1}
      separator={<NavigateNextIcon sx={{ fontSize: 13, color: '#CBD5E1' }} />}
      sx={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
    >
      {/* Home */}
      <Link
        component="button"
        underline="none"
        onClick={() => onBreadcrumbClick(-1)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: '#64748B',
          fontSize: { xs: '0.72rem', sm: '0.75rem' },
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          p: 0,
          '&:hover': { color: '#1D4ED8' },
        }}
      >
        <HomeIcon sx={{ fontSize: 13 }} />
        All Courses
      </Link>

      {/* Parent folders */}
      {breadcrumbs.slice(0, -1).map((crumb, idx) => (
        <Link
          key={crumb.id}
          component="button"
          underline="none"
          onClick={() => onBreadcrumbClick(idx)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#64748B',
            fontSize: { xs: '0.72rem', sm: '0.75rem' },
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            p: 0,
            maxWidth: { xs: 90, sm: 180 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            '&:hover': { color: '#1D4ED8' },
          }}
        >
          <FolderOpenIcon sx={{ fontSize: 12 }} />
          {crumb.title}
        </Link>
      ))}

      {/* Current page */}
      <Typography
        sx={{
          color: '#0F172A',
          fontSize: { xs: '0.72rem', sm: '0.75rem' },
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: { xs: 110, sm: 220 },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {currentTitle}
      </Typography>
    </Breadcrumbs>
  </Box>
);

export default PageBreadcrumbs;