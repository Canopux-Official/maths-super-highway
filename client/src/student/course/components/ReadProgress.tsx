import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const ReadProgress: React.FC = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        zIndex: 9999,
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #06B6D4, #1D4ED8)',
        transition: 'width 0.1s linear',
        borderRadius: '0 2px 2px 0',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ReadProgress;