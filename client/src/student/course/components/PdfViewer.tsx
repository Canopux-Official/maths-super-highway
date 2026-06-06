import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Chip,
} from '@mui/material';
import {
  InsertDriveFile,
  OpenInNew,
  NavigateBefore,
  NavigateNext,
  ViewStream,
  MenuBook,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material';
import { courseService } from '../services/api';

declare const pdfjsLib: any;

type ViewMode = 'scroll' | 'page';

interface PDFViewerProps {
  fileId: string;
  fileName: string;
  webViewLink: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileId, fileName, webViewLink }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('scroll');
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

  useEffect(() => {
    if (!fileId) return;

    if (typeof pdfjsLib === 'undefined') {
      setError('PDF.js library not loaded. Please check your index.html script tags.');
      setLoading(false);
      return;
    }

    let blobUrl: string | null = null;
    let destroyed = false;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError('');
        canvasRefs.current.clear();
        blobUrl = await courseService.getPdfBlobUrl(fileId);

        if (destroyed) return;

        const doc = await pdfjsLib.getDocument(blobUrl).promise;

        if (destroyed) {
          await doc.destroy();
          return;
        }

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
      } catch (err: any) {
        console.error('PDF load error:', err);
        setError(err?.response?.data?.message || err?.message || 'Unable to load PDF');
      } finally {
        if (!destroyed) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      destroyed = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (pdfDoc) pdfDoc.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  const renderPage = useCallback(
    async (pageNum: number, canvas: HTMLCanvasElement) => {
      if (!pdfDoc || !canvas) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (err) {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    },
    [pdfDoc, scale]
  );

  useEffect(() => {
    if (!pdfDoc || viewMode !== 'scroll' || loading) return;
    const timer = setTimeout(async () => {
      for (let i = 1; i <= totalPages; i++) {
        const canvas = canvasRefs.current.get(i);
        if (canvas) await renderPage(i, canvas);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pdfDoc, viewMode, scale, loading, totalPages, renderPage]);

  useEffect(() => {
    if (!pdfDoc || viewMode !== 'page' || loading) return;
    const canvas = canvasRefs.current.get(currentPage);
    if (canvas) renderPage(currentPage, canvas);
  }, [pdfDoc, viewMode, currentPage, scale, loading, renderPage]);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleZoomIn = () => setScale((s) => Math.min(3, parseFloat((s + 0.2).toFixed(1))));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, parseFloat((s - 0.2).toFixed(1))));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 10 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading PDF…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<OpenInNew />}
          component="a"
          href={webViewLink}
          target="_blank"
          sx={{ textTransform: 'none' }}
        >
          Open in Google Drive
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
          p: { xs: 1, sm: 1.5 },
          bgcolor: '#1e1e2e',
          borderRadius: '10px 10px 0 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* File name */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
          <InsertDriveFile sx={{ color: '#e06c75', fontSize: 18, flexShrink: 0 }} />
          <Typography
            variant="caption"
            noWrap
            sx={{ color: '#cdd6f4', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
          >
            {fileName}
          </Typography>
          <Chip
            label={`${totalPages}p`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
              color: '#a6adc8',
              fontSize: 10,
              height: 18,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Controls */}
        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={viewMode === 'scroll' ? 'Switch to page mode' : 'Switch to scroll mode'}>
            <IconButton
              size="small"
              onClick={() => setViewMode((v) => (v === 'scroll' ? 'page' : 'scroll'))}
              sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}
            >
              {viewMode === 'scroll' ? (
                <MenuBook sx={{ fontSize: 16 }} />
              ) : (
                <ViewStream sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Zoom out">
            <IconButton
              size="small"
              onClick={handleZoomOut}
              sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}
            >
              <ZoomOut sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Typography
            variant="caption"
            sx={{ color: '#a6adc8', minWidth: 34, textAlign: 'center', fontSize: 11 }}
          >
            {Math.round(scale * 100)}%
          </Typography>

          <Tooltip title="Zoom in">
            <IconButton
              size="small"
              onClick={handleZoomIn}
              sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}
            >
              <ZoomIn sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          {viewMode === 'page' && (
            <>
              <Tooltip title="Previous page">
                <span>
                  <IconButton
                    size="small"
                    onClick={handlePrev}
                    disabled={currentPage <= 1}
                    sx={{
                      color: '#a6adc8',
                      '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' },
                      '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
                    }}
                  >
                    <NavigateBefore sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>

              <Typography
                variant="caption"
                sx={{ color: '#a6adc8', fontSize: 11, minWidth: 48, textAlign: 'center' }}
              >
                {currentPage} / {totalPages}
              </Typography>

              <Tooltip title="Next page">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleNext}
                    disabled={currentPage >= totalPages}
                    sx={{
                      color: '#a6adc8',
                      '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' },
                      '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' },
                    }}
                  >
                    <NavigateNext sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}

          <Tooltip title="Open in Drive">
            <IconButton
              size="small"
              component="a"
              href={webViewLink}
              target="_blank"
              sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}
            >
              <OpenInNew sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Canvas area */}
      <Box
        ref={containerRef}
        sx={{
          bgcolor: '#1a1a2e',
          borderRadius: '0 0 10px 10px',
          overflow: 'auto',
          maxHeight: { xs: 480, sm: 600, md: 700 },
          display: 'block',
          p: { xs: 1, sm: 2 },
          textAlign: 'center',
        }}
      >
        {viewMode === 'scroll'
          ? Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Box
                key={pageNum}
                sx={{
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                  borderRadius: 1,
                  overflow: 'visible',
                  display: 'inline-block',
                  mb: 2,
                }}
              >
                <canvas
                  ref={(el) => { if (el) canvasRefs.current.set(pageNum, el); }}
                  style={{ display: 'block' }}
                />
              </Box>
            ))
          : (
              <Box
                sx={{
                  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                  borderRadius: 1,
                  display: 'inline-block',
                }}
              >
                <canvas
                  ref={(el) => { if (el) canvasRefs.current.set(currentPage, el); }}
                  style={{ display: 'block' }}
                />
              </Box>
            )}
      </Box>
    </Box>
  );
};

export default PDFViewer;