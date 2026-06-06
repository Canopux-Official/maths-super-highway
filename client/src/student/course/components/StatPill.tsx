import React from 'react';
import { Box, Typography } from '@mui/material';

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatPill: React.FC<StatPillProps> = ({ icon, label, value }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.25,
      bgcolor: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '10px',
      px: 1.75,
      py: 1,
    }}
  >
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: '8px',
        bgcolor: 'rgba(6,182,212,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.88rem',
          color: '#fff',
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default StatPill;