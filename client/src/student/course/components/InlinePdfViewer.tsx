import React, { useRef } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PDFViewer from './PdfViewer';
import { parseDriveFile } from '../../../admin/courses/services/googleApiServices';

interface InlineFileViewerProps {
  content: string;
}

const InlineFileViewer: React.FC<InlineFileViewerProps> = ({ content }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const parsed = parseDriveFile(content);

  // ── No file attached ──────────────────────────────────────────
  if (!parsed?.previewLink) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, sm: 10 },
          gap: 2,
          color: '#94A3B8',
        }}
      >
        <MenuBookIcon sx={{ fontSize: { xs: 36, sm: 48 }, opacity: 0.3 }} />
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: { xs: '0.82rem', sm: '0.9rem' },
          }}
        >
          No file attached to this lesson.
        </Typography>
      </Box>
    );
  }

  // ── PDF → rich PDFViewer ─────────────────────────────────────
  const isPdf =
    parsed.fileName?.toLowerCase().endsWith('.pdf') ||
    parsed.previewLink?.includes('pdf');

  if (isPdf && parsed.fileId) {
    return (
      <PDFViewer
        fileId={parsed.fileId}
        fileName={parsed.fileName || 'Document'}
        webViewLink={parsed.webViewLink || '#'}
      />
    );
  }

  // ── Google Docs / Slides / Sheets / other Drive files → iframe ─
  const isGoogleDoc = parsed.webViewLink?.includes('docs.google.com/document');
  const isGoogleSlides = parsed.webViewLink?.includes('docs.google.com/presentation');
  const isGoogleSheets = parsed.webViewLink?.includes('docs.google.com/spreadsheets');

  let embedUrl = parsed.previewLink || '';
  if (isGoogleDoc && parsed.fileId) {
    embedUrl = `https://docs.google.com/document/d/${parsed.fileId}/preview`;
  } else if (isGoogleSlides && parsed.fileId) {
    embedUrl = `https://docs.google.com/presentation/d/${parsed.fileId}/embed?start=false&loop=false&delayms=3000`;
  } else if (isGoogleSheets && parsed.fileId) {
    embedUrl = `https://docs.google.com/spreadsheets/d/${parsed.fileId}/preview`;
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderBottom: '1px solid #F1F5F9',
          bgcolor: '#FAFBFD',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
          <MenuBookIcon sx={{ fontSize: 16, color: '#1D4ED8', flexShrink: 0 }} />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '0.78rem', sm: '0.85rem' },
              color: '#0F172A',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {parsed.fileName}
          </Typography>
        </Box>

        <Tooltip title="Open in Google Drive">
          <Button
            size="small"
            variant="outlined"
            startIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
            component="a"
            href={parsed.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: '0.78rem',
              borderColor: '#CBD5E1',
              color: '#475569',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              flexShrink: 0,
              '&:hover': {
                borderColor: '#1D4ED8',
                color: '#1D4ED8',
                bgcolor: '#EFF6FF',
              },
            }}
          >
            Open in Drive
          </Button>
        </Tooltip>
      </Box>

      {/* Iframe */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 'calc(100svh - 80px)', sm: 'calc(100vh - 100px)' },
          minHeight: { xs: 400, sm: 500 },
          bgcolor: '#F8FAFC',
        }}
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={parsed.fileName}
          allow="autoplay"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </Box>
    </Box>
  );
};

export default InlineFileViewer;