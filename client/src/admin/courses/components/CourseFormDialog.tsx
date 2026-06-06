import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
    Button, TextField, MenuItem, Box, Typography, Stack,
    CircularProgress, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { CourseFormState } from './types';
import DriveFileUploader from './DriveFileUploader';

interface CourseFormDialogProps {
    open: boolean;
    editingId: string | null;
    form: CourseFormState;
    isUploading: boolean;
    onClose: () => void;
    onFormChange: (updater: (prev: CourseFormState) => CourseFormState) => void;
    onSubmit: () => void;
    onThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onThumbnailDelete: () => void;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
    open, editingId, form, isUploading,
    onClose, onFormChange, onSubmit,
    onThumbnailUpload, onThumbnailDelete,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={form.itemType === 'page' ? 'md' : 'sm'}
            slotProps={{ paper: { sx: { borderRadius: 3, mx: { xs: 2, sm: 'auto' } } } }}
        >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                {editingId ? 'Edit Item' : 'Create New Item'}
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 2.5 }}>
                <Stack sx = {{gap:3}}>
                    {/* Title */}
                    <TextField
                        label="Title"
                        fullWidth
                        value={form.title}
                        onChange={e => onFormChange(f => ({ ...f, title: e.target.value }))}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    {/* Type — only when creating */}
                    {!editingId && (
                        <TextField
                            select
                            label="Type"
                            value={form.itemType}
                            onChange={e => onFormChange(f => ({ ...f, itemType: e.target.value as 'folder' | 'page', content: '' }))}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value="folder">Folder</MenuItem>
                            <MenuItem value="page">Page</MenuItem>
                        </TextField>
                    )}

                    {/* Thumbnail */}
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                mb: 1,
                                display: 'block',
                                fontWeight: 700,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Thumbnail Image
                        </Typography>

                        {form.thumbnail?.url ? (
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 'fit-content',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <img
                                    src={form.thumbnail.url}
                                    alt="Thumbnail Preview"
                                    style={{ width: '180px', height: '110px', objectFit: 'cover', display: 'block' }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={onThumbnailDelete}
                                    disabled={isUploading}
                                    sx={{
                                        position: 'absolute', top: 6, right: 6,
                                        bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                                disabled={isUploading}
                                sx={{
                                    borderRadius: 2,
                                    height: 56,
                                    textTransform: 'none',
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                }}
                            >
                                {isUploading ? 'Uploading…' : 'Upload Thumbnail Image'}
                                <input type="file" accept="image/*" hidden onChange={onThumbnailUpload} />
                            </Button>
                        )}
                    </Box>

                    {/* Folder description */}
                    {form.itemType === 'folder' && (
                        <TextField
                            label="Folder Description"
                            placeholder="Briefly describe what this module covers…"
                            fullWidth
                            multiline
                            rows={3}
                            value={form.content}
                            onChange={e => onFormChange(f => ({ ...f, content: e.target.value }))}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    )}

                    {/* Page file uploader */}
                    {form.itemType === 'page' && (
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    mb: 1.5,
                                    display: 'block',
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}
                            >
                                Lesson File
                            </Typography>
                            <DriveFileUploader
                                value={form.content}
                                onChange={val => onFormChange(f => ({ ...f, content: val }))}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Upload a new file or pick an existing one from your Google Drive.
                                Files are made publicly accessible for students to view inline.
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={isUploading || !form.title.trim() || (form.itemType === 'page' && !form.content)}
                >
                    {editingId ? 'Save Changes' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourseFormDialog;