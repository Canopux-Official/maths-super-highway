import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

interface UploadOverlayProps {
  open: boolean;
  message?: string;
  subMessage?: string;
}

const UploadOverlay: React.FC<UploadOverlayProps> = ({ 
  open, 
  message = "Uploading... Please wait", 
  subMessage = "Do not refresh or close this page. This might take a moment." 
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => Math.max(theme.zIndex.drawer, theme.zIndex.modal) + 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.85)'
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={60} thickness={4} />
      <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
        {message}
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.8, fontFamily: "'Inter', sans-serif" }}>
        {subMessage}
      </Typography>
    </Backdrop>
  );
};

export default UploadOverlay;
