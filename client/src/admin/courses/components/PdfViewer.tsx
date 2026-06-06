import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Button, Stack, CircularProgress, IconButton, Tooltip, Alert, Chip } from '@mui/material';
import { InsertDriveFile, OpenInNew, NavigateBefore, NavigateNext, ViewStream, MenuBook, ZoomIn, ZoomOut } from '@mui/icons-material';
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

    // ── Load PDF via backend and blob ─────────────────────────────
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
                if (!destroyed) {
                    setLoading(false);
                }
            }
        };

        loadPdf();

        return () => {
            destroyed = true;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
            if (pdfDoc) {
                pdfDoc.destroy?.();
            }
        };
    }, [fileId]);

    // ── Render a single page to canvas ─────────────────────────────
    const renderPage = useCallback(async (pageNum: number, canvas: HTMLCanvasElement) => {
        if (!pdfDoc || !canvas) return;
        try {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            
            // Set the absolute internal dimensions based on scale
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            await page.render({ canvasContext: ctx, viewport }).promise;
        } catch (err: any) {
            console.error(`Error rendering page ${pageNum}:`, err);
        }
    }, [pdfDoc, scale]);

    // ── Scroll mode: render all pages ─────────────────────────────
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

    // ── Page mode: render current page ────────────────────────────
    useEffect(() => {
        if (!pdfDoc || viewMode !== 'page' || loading) return;
        const canvas = canvasRefs.current.get(currentPage);
        if (canvas) renderPage(currentPage, canvas);
    }, [pdfDoc, viewMode, currentPage, scale, loading, renderPage]);

    const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
    const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const handleZoomIn = () => setScale(s => Math.min(3, parseFloat((s + 0.2).toFixed(1))));
    const handleZoomOut = () => setScale(s => Math.max(0.5, parseFloat((s - 0.2).toFixed(1))));

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 10 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">Loading PDF…</Typography>
        </Box>
    );

    if (error) return (
        <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>
            <Button variant="outlined" startIcon={<OpenInNew />} component="a" href={webViewLink} target="_blank" sx={{ textTransform: 'none' }}>
                Open in Google Drive
            </Button>
        </Box>
    );

    return (
        <Box>
            {/* Toolbar */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', p: { xs: 1, sm: 1.5 }, bgcolor: '#1e1e2e', borderRadius: '10px 10px 0 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" sx={{ flex: 1, minWidth: 0, alignItems: "center", gap: 1 }}>
                    <InsertDriveFile sx={{ color: '#e06c75', fontSize: 18, flexShrink: 0 }} />
                    <Typography variant="caption" noWrap sx={{ color: '#cdd6f4', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        {fileName}
                    </Typography>
                    <Chip label={`${totalPages}p`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#a6adc8', fontSize: 10, height: 18, flexShrink: 0 }} />
                </Stack>

                <Stack direction="row" sx={{ flexShrink: 0, alignItems: "center", gap: 0.5 }}>
                    <Tooltip title={viewMode === 'scroll' ? 'Switch to page mode' : 'Switch to scroll mode'}>
                        <IconButton size="small" onClick={() => setViewMode(v => v === 'scroll' ? 'page' : 'scroll')} sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            {viewMode === 'scroll' ? <MenuBook sx={{ fontSize: 16 }} /> : <ViewStream sx={{ fontSize: 16 }} />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Zoom out">
                        <IconButton size="small" onClick={handleZoomOut} sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            <ZoomOut sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="caption" sx={{ color: '#a6adc8', minWidth: 34, textAlign: 'center', fontSize: 11 }}>
                        {Math.round(scale * 100)}%
                    </Typography>
                    <Tooltip title="Zoom in">
                        <IconButton size="small" onClick={handleZoomIn} sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            <ZoomIn sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>

                    {viewMode === 'page' && (
                        <>
                            <Tooltip title="Previous page"><span>
                                <IconButton size="small" onClick={handlePrev} disabled={currentPage <= 1} sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' } }}>
                                    <NavigateBefore sx={{ fontSize: 18 }} />
                                </IconButton>
                            </span></Tooltip>
                            <Typography variant="caption" sx={{ color: '#a6adc8', fontSize: 11, minWidth: 48, textAlign: 'center' }}>{currentPage} / {totalPages}</Typography>
                            <Tooltip title="Next page"><span>
                                <IconButton size="small" onClick={handleNext} disabled={currentPage >= totalPages} sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' } }}>
                                    <NavigateNext sx={{ fontSize: 18 }} />
                                </IconButton>
                            </span></Tooltip>
                        </>
                    )}

                    <Tooltip title="Open in Drive">
                        <IconButton size="small" component="a" href={webViewLink} target="_blank" sx={{ color: '#a6adc8', '&:hover': { color: '#cdd6f4', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                            <OpenInNew sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Canvas area container */}
            <Box 
                ref={containerRef} 
                sx={{ 
                    bgcolor: '#1a1a2e', 
                    borderRadius: '0 0 10px 10px', 
                    overflow: 'auto', // Keep this to handle both X and Y overflows
                    maxHeight: { xs: 480, sm: 600, md: 700 }, 
                    display: 'block', // Changed from flex to block to handle wide child contents properly
                    p: { xs: 1, sm: 2 },
                    textAlign: 'center' // Keeps document centered when smaller than container width
                }}
            >
                {viewMode === 'scroll'
                    ? Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <Box 
                            key={pageNum} 
                            sx={{ 
                                boxShadow: '0 4px 24px rgba(0,0,0,0.5)', 
                                borderRadius: 1, 
                                overflow: 'visible', // Changed to ensure bounds don't get clipped weirdly
                                display: 'inline-block', // Crucial for wide rendering centered layouts
                                mb: 2 // Gap handled via margin bottom instead of flex gap
                            }}
                        >
                            <canvas 
                                ref={(el) => { if (el) canvasRefs.current.set(pageNum, el); }} 
                                style={{ display: 'block' }} // Removed maxWidth: '100%'
                            />
                        </Box>
                    ))
                    : <Box 
                        sx={{ 
                            boxShadow: '0 4px 24px rgba(0,0,0,0.5)', 
                            borderRadius: 1, 
                            display: 'inline-block' // Ensures the container wraps around the canvas scale width
                        }}
                    >
                        <canvas 
                            ref={(el) => { if (el) canvasRefs.current.set(currentPage, el); }} 
                            style={{ display: 'block' }} // Removed maxWidth: '100%'
                        />
                    </Box>
                }
            </Box>
        </Box>
    );
};

export default PDFViewer;