import React, { useEffect, useRef, useState } from 'react';
import {
    Box, Typography, Button, Stack, CircularProgress,
    IconButton, Tooltip, Alert, LinearProgress, InputAdornment,
    TextField, List, ListItemButton, ListItemIcon, ListItemText,
    Collapse
} from '@mui/material';
import {
    InsertDriveFile, CheckCircle, Google, OpenInNew,
    SwapHoriz, DeleteOutlined, SearchOutlined, CloudUpload
} from '@mui/icons-material';
import {
    initGoogleDrive,
    getAccessToken,
    uploadFileToDrive,
    deleteFileFromDrive,
    makeFilePublic,
    parseDriveFile,
    serializeDriveFile,
} from '../services/googleApiServices';
import type { DriveFile } from '../services/googleApiServices';

// ── List files from Drive ─────────────────────────────────────────────────────
const listDriveFiles = async (query?: string): Promise<DriveFile[]> => {
    const token = await getAccessToken();
    let q = "trashed=false and 'me' in owners";
    if (query) q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
    const params = new URLSearchParams({
        q,
        fields: 'files(id,name,mimeType,webViewLink,createdTime)',
        orderBy: 'modifiedTime desc',
        pageSize: '50',
    });
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to list Drive files: ${res.status}`);
    const data = await res.json();
    return (data.files || []).map((f: any) => ({
        fileId: f.id,
        fileName: f.name,
        webViewLink: f.webViewLink,
        previewLink: `https://drive.google.com/file/d/${f.id}/preview`,
    }));
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface DriveFileUploaderProps {
    value: string;
    onChange: (val: string) => void;
}

type UploadStatus = 'idle' | 'signing-in' | 'uploading' | 'done' | 'error';

const DriveFileUploader: React.FC<DriveFileUploaderProps> = ({ value, onChange }) => {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [showDrivePicker, setShowDrivePicker] = useState(false);
    const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
    const [driveLoading, setDriveLoading] = useState(false);
    const [driveSearch, setDriveSearch] = useState('');
    const [driveError, setDriveError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const parsed = parseDriveFile(value);

    useEffect(() => {
        if (parsed?.fileName) setStatus('done');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setStatus('signing-in');
        setErrorMsg('');
        try {
            await initGoogleDrive();
            setStatus('uploading');
            setProgress(0);
            const result = await uploadFileToDrive(file, setProgress);
            onChange(serializeDriveFile(result));
            setStatus('done');
        } catch (err: any) {
            setErrorMsg(err.message || 'Upload failed. Please try again.');
            setStatus('error');
        }
        e.target.value = '';
    };

    const handleReplace = async () => {
        if (parsed?.fileId) {
            await deleteFileFromDrive(parsed.fileId).catch(() => { });
        }
        onChange('');
        setStatus('idle');
        setProgress(0);
        setTimeout(() => inputRef.current?.click(), 50);
    };

    const handleDelete = async () => {
        if (parsed?.fileId) {
            await deleteFileFromDrive(parsed.fileId).catch(() => { });
        }
        onChange('');
        setStatus('idle');
    };

    const loadDriveFiles = async (search?: string) => {
        setDriveLoading(true);
        setDriveError('');
        try {
            await initGoogleDrive();
            await getAccessToken();
            const files = await listDriveFiles(search);
            setDriveFiles(files);
        } catch (err: any) {
            setDriveError(err.message || 'Failed to load Drive files. Check your Google account connection.');
        } finally {
            setDriveLoading(false);
        }
    };

    const handleOpenPicker = async () => {
        setShowDrivePicker(true);
        await loadDriveFiles();
    };

    const handlePickFile = async (file: DriveFile) => {
        try {
            await makeFilePublic(file.fileId).catch(() => { });
            onChange(serializeDriveFile(file));
            setStatus('done');
            setShowDrivePicker(false);
            setDriveSearch('');
        } catch (err: any) {
            setDriveError(err.message || 'Failed to select file.');
        }
    };

    const handleDriveSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setDriveSearch(e.target.value);
        await loadDriveFiles(e.target.value);
    };

    return (
        <Box>
            <input
                ref={inputRef}
                type="file"
                accept="*/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* ── Idle ── */}
            {status === 'idle' && (
                <Stack spacing={2}>
                    <Box
                        onClick={() => inputRef.current?.click()}
                        sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: { xs: 3, sm: 4 },
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: 'primary.50',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'primary.100', borderColor: 'primary.dark' },
                        }}
                    >
                        <CloudUpload sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Click to upload a new file</Typography>
                        <Typography variant="caption" color="text.secondary">
                            PDF, DOCX, PPTX, images — uploaded to Google Drive
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<Google sx={{ color: '#4285F4' }} />}
                        onClick={handleOpenPicker}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Pick an existing file from Google Drive
                    </Button>
                </Stack>
            )}

            {/* ── Signing in ── */}
            {status === 'signing-in' && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Stack direction="row" sx={{ gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Google sx={{ color: '#4285F4' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Signing in with Google…</Typography>
                        <CircularProgress size={18} />
                    </Stack>
                </Box>
            )}

            {/* ── Uploading ── */}
            {status === 'uploading' && (
                <Box sx={{ py: 2 }}>
                    <Stack direction="row" sx = {{gap:1, alignItems:"center", mb:1}}>
                        <InsertDriveFile sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }} noWrap>
                            Uploading…
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{progress}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 2, height: 8 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Uploading to Google Drive…
                    </Typography>
                </Box>
            )}

            {/* ── Done ── */}
            {status === 'done' && parsed && (
                <Box sx={{ border: '1px solid', borderColor: 'success.main', borderRadius: 2, p: 2, bgcolor: '#f0fdf4' }}>
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                        <CheckCircle sx={{ color: 'success.main', flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{parsed.fileName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Uploaded to Google Drive · accessible to everyone
                            </Typography>
                        </Box>
                        <Stack direction="row" sx={{ gap: 0.5 }}>
                            <Tooltip title="Open in Drive">
                                <IconButton size="small" component="a" href={parsed.webViewLink} target="_blank">
                                    <OpenInNew fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Replace file">
                                <IconButton size="small" onClick={handleReplace} color="primary">
                                    <SwapHoriz fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove file">
                                <IconButton size="small" onClick={handleDelete} color="error">
                                    <DeleteOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Box>
            )}

            {/* ── Error ── */}
            {status === 'error' && (
                <Box>
                    <Alert severity="error" sx={{ mb: 1 }}>{errorMsg}</Alert>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { setStatus('idle'); setErrorMsg(''); }}
                    >
                        Try again
                    </Button>
                </Box>
            )}

            {/* ── Drive File Picker ── */}
            <Collapse in={showDrivePicker}>
                <Box sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                            <Google sx={{ color: '#4285F4', fontSize: 18 }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, flex: 1 }}>
                                Your Google Drive Files
                            </Typography>
                            <Button size="small" onClick={() => setShowDrivePicker(false)} sx={{ minWidth: 0, p: 0.5 }}>
                                ✕
                            </Button>
                        </Stack>
                        <TextField
                            size="small"
                            placeholder="Search files…"
                            value={driveSearch}
                            onChange={handleDriveSearch}
                            fullWidth
                            sx={{ mt: 1 }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlined fontSize="small" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
                        {driveLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                        {driveError && (
                            <Alert severity="error" sx={{ m: 1 }}>{driveError}</Alert>
                        )}
                        {!driveLoading && !driveError && driveFiles.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                <InsertDriveFile sx={{ fontSize: 36, opacity: 0.3 }} />
                                <Typography variant="caption" sx={{ display: 'block' }}>No files found</Typography>
                            </Box>
                        )}
                        <List dense disablePadding>
                            {driveFiles.map(file => (
                                <ListItemButton
                                    key={file.fileId}
                                    onClick={() => handlePickFile(file)}
                                    sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'primary.50' } }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <InsertDriveFile sx={{ color: '#2196F3', fontSize: 18 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                                                {file.fileName}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default DriveFileUploader;