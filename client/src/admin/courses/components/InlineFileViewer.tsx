import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import { parseDriveFile } from '../services/googleApiServices';
import { courseService } from '../services/api';
import PDFViewer from './PdfViewer';
import { InsertDriveFile, OpenInNew } from '@mui/icons-material';

interface InlineFileViewerProps {
    content: string;
}

const InlineFileViewer: React.FC<InlineFileViewerProps> = ({ content }) => {
    const parsed = parseDriveFile(content);

    if (!parsed?.previewLink) {
        return (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <InsertDriveFile sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                <Typography>No file attached to this lesson.</Typography>
            </Box>
        );
    }

    const isPdf = parsed.fileName?.toLowerCase().endsWith('.pdf');

    if (isPdf && parsed.fileId) {
        return (
            <PDFViewer
                fileId={parsed.fileId}         // pass the fileId only
                fileName={parsed.fileName}     // display name
                webViewLink={parsed.webViewLink} // optional "Open in Drive" link
            />
        );
    }

    // Non-PDF fallback
    return (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" sx={{ gap: 1, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
                <InsertDriveFile sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 700, flex: 1 }}>{parsed.fileName}</Typography>
                <Button size="small" variant="outlined" startIcon={<OpenInNew fontSize="small" />} component="a" href={parsed.webViewLink} target="_blank" sx={{ textTransform: 'none' }}>
                    Open in Drive
                </Button>
            </Stack>
            <Box sx={{ width: '100%', height: { xs: 400, sm: 500, md: 600 }, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
                <iframe src={parsed.previewLink} width="100%" height="100%" style={{ border: 'none', display: 'block' }} title={parsed.fileName} allow="autoplay" />
            </Box>
        </Box>
    );
};

export default InlineFileViewer;