// import React, { useEffect, useState, useRef } from 'react';
// import {
//     Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Paper, Breadcrumbs, Link, Dialog, DialogTitle,
//     DialogContent, TextField, MenuItem, DialogActions, Stack, Avatar,
//     IconButton, Tabs, Tab, Divider, Chip, Tooltip, LinearProgress,
//     Alert, CircularProgress, List, ListItem, ListItemIcon, ListItemText,
//     ListItemButton, InputAdornment, Collapse
// } from '@mui/material';
// import {
//     Folder, Description, Add, ChevronRight,
//     ArrowBack, Edit, Delete, People, Download,
//     CloudUpload, InsertDriveFile, CheckCircle, Google, OpenInNew,
//     SearchOutlined, ExpandMore, ExpandLess, SwapHoriz, DeleteOutlined
// } from '@mui/icons-material';
// import { courseService } from '../services/api';
// import ConfirmDialog from '../../../components/ConfirmDialog';
// import { exportUsersToExcel } from '../../../utils/excel';
// import type { DriveFile } from '../services/googleApiServices';
// import {
//     initGoogleDrive,
//     getAccessToken,
//     uploadFileToDrive,
//     deleteFileFromDrive,
//     makeFilePublic,
//     parseDriveFile,
//     serializeDriveFile,
// } from '../services/googleApiServices';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// // ─── List files from Drive ────────────────────────────────────────────────────

// const listDriveFiles = async (query?: string): Promise<DriveFile[]> => {
//     const token = await getAccessToken();
//     let q = "trashed=false and 'me' in owners";
//     if (query) q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
//     const params = new URLSearchParams({
//         q,
//         fields: 'files(id,name,mimeType,webViewLink,createdTime)',
//         orderBy: 'modifiedTime desc',
//         pageSize: '50',
//     });
//     const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) throw new Error(`Failed to list Drive files: ${res.status}`);
//     const data = await res.json();
//     return (data.files || []).map((f: any) => ({
//         fileId: f.id,
//         fileName: f.name,
//         webViewLink: f.webViewLink,
//         previewLink: `https://drive.google.com/file/d/${f.id}/preview`,
//     }));
// };


// const InlineFileViewer: React.FC<{ content: string }> = ({ content }) => {
//     const parsed = parseDriveFile(content);
//     if (!parsed?.previewLink) {
//         return (
//             <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
//                 <InsertDriveFile sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
//                 <Typography>No file attached to this lesson.</Typography>
//             </Box>
//         );
//     }
//     return (
//         <Box sx={{ width: '100%' }}>
//             <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', mb: 2 }}>
//                 <InsertDriveFile sx={{ color: 'primary.main', fontSize: 20 }} />

//                 <Typography variant="body2" sx={{ fontWeight: 700 }}>{parsed.fileName}</Typography>

//                 <Box sx={{ flex: 1 }} />

//                 <Button

//                     size="small"

//                     variant="outlined"

//                     startIcon={<OpenInNew fontSize="small" />}

//                     component="a"

//                     href={parsed.webViewLink}

//                     target="_blank"

//                     sx={{ textTransform: 'none' }}

//                 >

//                     Open in Drive

//                 </Button>

//             </Stack>

//             <Box

//                 sx={{

//                     width: '100%',

//                     height: 600,

//                     borderRadius: 2,

//                     overflow: 'hidden',

//                     border: '1px solid #e0e0e0',

//                     bgcolor: '#f5f5f5',

//                 }}

//             >

//                 <iframe

//                     src={parsed.previewLink}

//                     width="100%"

//                     height="100%"

//                     style={{ border: 'none', display: 'block' }}

//                     title={parsed.fileName}

//                     allow="autoplay"

//                 />

//             </Box>

//         </Box>

//     );

// };

// // ─── DriveFileUploader sub-component ────────────────────────────────────────────

// interface DriveUploaderProps {
//     value: string;
//     onChange: (val: string) => void;
// }

// const DriveFileUploader: React.FC<DriveUploaderProps> = ({ value, onChange }) => {
//     const [status, setStatus] = useState<'idle' | 'signing-in' | 'uploading' | 'done' | 'error'>('idle');
//     const [progress, setProgress] = useState(0);
//     const [errorMsg, setErrorMsg] = useState('');
//     const [showDrivePicker, setShowDrivePicker] = useState(false);
//     const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
//     const [driveLoading, setDriveLoading] = useState(false);
//     const [driveSearch, setDriveSearch] = useState('');
//     const [driveError, setDriveError] = useState('');
//     const inputRef = useRef<HTMLInputElement>(null);

//     const parsed = parseDriveFile(value);

//     useEffect(() => {
//         if (parsed?.fileName) setStatus('done');
//     }, []);

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         setStatus('signing-in');
//         setErrorMsg('');
//         try {
//             await initGoogleDrive();
//             setStatus('uploading');
//             setProgress(0);
//             const result = await uploadFileToDrive(file, setProgress);
//             onChange(serializeDriveFile(result));
//             setStatus('done');
//         } catch (err: any) {
//             setErrorMsg(err.message || 'Upload failed');
//             setStatus('error');
//         }
//         e.target.value = '';
//     };

//     const handleReplace = async () => {
//         if (parsed?.fileId) {
//             await deleteFileFromDrive(parsed.fileId).catch(() => { });
//         }
//         onChange('');
//         setStatus('idle');
//         setProgress(0);
//         setTimeout(() => inputRef.current?.click(), 50);
//     };

//     const handleDelete = async () => {
//         if (parsed?.fileId) {
//             await deleteFileFromDrive(parsed.fileId).catch(() => { });
//         }
//         onChange('');
//         setStatus('idle');
//     };

//     const loadDriveFiles = async (search?: string) => {
//         setDriveLoading(true);
//         setDriveError('');
//         try {
//             await initGoogleDrive();
//             await getAccessToken();
//             const files = await listDriveFiles(search);
//             setDriveFiles(files);
//         } catch (err: any) {
//             setDriveError(err.message || 'Failed to load Drive files');
//         } finally {
//             setDriveLoading(false);
//         }
//     };

//     const handleOpenPicker = async () => {
//         setShowDrivePicker(true);
//         await loadDriveFiles();
//     };

//     const handlePickFile = async (file: DriveFile) => {
//         await makeFilePublic(file.fileId).catch(() => { });
//         onChange(serializeDriveFile(file));
//         setStatus('done');
//         setShowDrivePicker(false);
//         setDriveSearch('');
//     };

//     const handleDriveSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         setDriveSearch(e.target.value);
//         await loadDriveFiles(e.target.value);
//     };

//     return (
//         <Box>
//             <input
//                 ref={inputRef}
//                 type="file"
//                 accept="*/*"
//                 style={{ display: 'none' }}
//                 onChange={handleFileChange}
//             />

//             {/* ── Idle ── */}
//             {status === 'idle' && (
//                 <Stack spacing={2}>
//                     <Box
//                         onClick={() => inputRef.current?.click()}
//                         sx={{
//                             border: '2px dashed',
//                             borderColor: 'primary.main',
//                             borderRadius: 2,
//                             p: 4,
//                             textAlign: 'center',
//                             cursor: 'pointer',
//                             bgcolor: 'primary.50',
//                             transition: 'all 0.2s',
//                             '&:hover': { bgcolor: 'primary.100', borderColor: 'primary.dark' },
//                         }}
//                     >
//                         <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
//                         {/* FIX: fontWeight moved to sx */}
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>Click to upload a new file</Typography>
//                         <Typography variant="caption" color="text.secondary">
//                             PDF, DOCX, PPTX, images — uploaded to Google Drive
//                         </Typography>
//                     </Box>

//                     <Button
//                         variant="outlined"
//                         startIcon={<Google sx={{ color: '#4285F4' }} />}
//                         onClick={handleOpenPicker}
//                         sx={{ textTransform: 'none', borderRadius: 2 }}
//                     >
//                         Pick an existing file from Google Drive
//                     </Button>
//                 </Stack>
//             )}

//             {/* ── Signing in ── */}
//             {status === 'signing-in' && (
//                 <Box sx={{ textAlign: 'center', py: 3 }}>
//                     {/* FIX: direction/alignItems/justifyContent moved to sx */}
//                     <Stack sx={{ flexDirection: 'row', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
//                         <Google sx={{ color: '#4285F4' }} />
//                         <Typography variant="body2" sx={{ fontWeight: 600 }}>Signing in with Google…</Typography>
//                         <CircularProgress size={18} />
//                     </Stack>
//                 </Box>
//             )}

//             {/* ── Uploading ── */}
//             {status === 'uploading' && (
//                 <Box sx={{ py: 2 }}>
//                     <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', mb: 1 }}>
//                         <InsertDriveFile sx={{ color: 'primary.main', fontSize: 20 }} />
//                         <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }} noWrap>
//                             {parsed?.fileName ?? 'Uploading…'}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">{progress}%</Typography>
//                     </Stack>
//                     <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 2, height: 8 }} />
//                     <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
//                         Uploading to Google Drive…
//                     </Typography>
//                 </Box>
//             )}

//             {/* ── Done ── */}
//             {status === 'done' && parsed && (
//                 <Box sx={{ border: '1px solid', borderColor: 'success.main', borderRadius: 2, p: 2, bgcolor: '#f0fdf4' }}>
//                     <Stack sx={{ flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
//                         <CheckCircle sx={{ color: 'success.main' }} />
//                         <Box sx={{ flex: 1, minWidth: 0 }}>
//                             <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{parsed.fileName}</Typography>
//                             <Typography variant="caption" color="text.secondary">
//                                 Uploaded to Google Drive · accessible to everyone
//                             </Typography>
//                         </Box>
//                         <Tooltip title="Open in Drive">
//                             <IconButton size="small" component="a" href={parsed.webViewLink} target="_blank">
//                                 <OpenInNew fontSize="small" />
//                             </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Replace file">
//                             <IconButton size="small" onClick={handleReplace} color="primary">
//                                 <SwapHoriz fontSize="small" />
//                             </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Remove file">
//                             {/* FIX: DeleteOutline → DeleteOutlined */}
//                             <IconButton size="small" onClick={handleDelete} color="error">
//                                 <DeleteOutlined fontSize="small" />
//                             </IconButton>
//                         </Tooltip>
//                     </Stack>
//                 </Box>
//             )}

//             {/* ── Error ── */}
//             {status === 'error' && (
//                 <Box>
//                     <Alert severity="error" sx={{ mb: 1 }}>{errorMsg}</Alert>
//                     <Button variant="outlined" size="small" onClick={() => { setStatus('idle'); setErrorMsg(''); }}>
//                         Try again
//                     </Button>
//                 </Box>
//             )}

//             {/* ── Drive File Picker ── */}
//             <Collapse in={showDrivePicker}>
//                 <Box sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
//                     <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
//                         <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
//                             <Google sx={{ color: '#4285F4', fontSize: 18 }} />
//                             <Typography variant="caption" sx={{ fontWeight: 700, flex: 1 }}>
//                                 Your Google Drive Files
//                             </Typography>
//                             <Button size="small" onClick={() => setShowDrivePicker(false)} sx={{ minWidth: 0, p: 0.5 }}>
//                                 ✕
//                             </Button>
//                         </Stack>
//                         {/* FIX: InputProps → slotProps */}
//                         <TextField
//                             size="small"
//                             placeholder="Search files…"
//                             value={driveSearch}
//                             onChange={handleDriveSearch}
//                             fullWidth
//                             sx={{ mt: 1 }}
//                             slotProps={{
//                                 input: {
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <SearchOutlined fontSize="small" />
//                                         </InputAdornment>
//                                     ),
//                                 },
//                             }}
//                         />
//                     </Box>

//                     <Box sx={{ maxHeight: 240, overflowY: 'auto' }}>
//                         {driveLoading && (
//                             <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//                                 <CircularProgress size={24} />
//                             </Box>
//                         )}
//                         {driveError && (
//                             <Alert severity="error" sx={{ m: 1 }}>{driveError}</Alert>
//                         )}
//                         {!driveLoading && !driveError && driveFiles.length === 0 && (
//                             <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
//                                 <InsertDriveFile sx={{ fontSize: 36, opacity: 0.3 }} />
//                                 <Typography variant="caption" sx={{ display: 'block' }}>
//                                     No files found
//                                 </Typography>
//                             </Box>
//                         )}
//                         <List dense disablePadding>
//                             {driveFiles.map(file => (
//                                 <ListItemButton
//                                     key={file.fileId}
//                                     onClick={() => handlePickFile(file)}
//                                     sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'primary.50' } }}
//                                 >
//                                     <ListItemIcon sx={{ minWidth: 32 }}>
//                                         <InsertDriveFile sx={{ color: '#2196F3', fontSize: 18 }} />
//                                     </ListItemIcon>
//                                     <ListItemText
//                                         primary={
//                                             <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
//                                                 {file.fileName}
//                                             </Typography>
//                                         }
//                                     />
//                                 </ListItemButton>
//                             ))}
//                         </List>
//                     </Box>
//                 </Box>
//             </Collapse>
//         </Box>
//     );
// };

// // ─── Inline file viewer ──────────────────────────────────────────────────────────

// // const InlineFileViewer: React.FC<{ content: string }> = ({ content }) => {
// //     const parsed = parseDriveFile(content);

// //     if (!parsed?.previewLink) {
// //         return (
// //             <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
// //                 <InsertDriveFile sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
// //                 <Typography>No file attached to this lesson.</Typography>
// //             </Box>
// //         );
// //     }

// //     return (
// //         <Box sx={{ width: '100%' }}>
// //             <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center', mb: 2 }}>
// //                 <InsertDriveFile sx={{ color: 'primary.main', fontSize: 20 }} />
// //                 <Typography variant="body2" sx={{ fontWeight: 700 }}>{parsed.fileName}</Typography>
// //                 <Box sx={{ flex: 1 }} />
// //                 <Button
// //                     size="small"
// //                     variant="outlined"
// //                     startIcon={<OpenInNew fontSize="small" />}
// //                     component="a"
// //                     href={parsed.webViewLink}
// //                     target="_blank"
// //                     sx={{ textTransform: 'none' }}
// //                 >
// //                     Open in Drive
// //                 </Button>
// //             </Stack>
// //             <Box
// //                 sx={{
// //                     width: '100%',
// //                     height: 600,
// //                     borderRadius: 2,
// //                     overflow: 'hidden',
// //                     border: '1px solid #e0e0e0',
// //                     bgcolor: '#f5f5f5',
// //                 }}
// //             >
// //                 <iframe
// //                     src={parsed.previewLink}
// //                     width="100%"
// //                     height="100%"
// //                     style={{ border: 'none', display: 'block' }}
// //                     title={parsed.fileName}
// //                     allow="autoplay"
// //                 />
// //             </Box>
// //         </Box>
// //     );
// // };

// // ─── Main Courses component ──────────────────────────────────────────────────────

// const Courses = () => {
//     const [items, setItems] = useState<any[]>([]);
//     const [parentId, setParentId] = useState('root');
//     const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; title: string }[]>([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedPage, setSelectedPage] = useState<any>(null);
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [form, setForm] = useState({ title: '', itemType: 'folder' as 'folder' | 'page', content: '', thumbnail: { url: '', publicId: '' } });
//     const [tabValue, setTabValue] = useState(0);
//     const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number>>({});
//     const [isUploading, setIsUploading] = useState(false);

//     const [confirmState, setConfirmState] = useState<{
//         open: boolean; title: string; message: string;
//         action: (() => void) | null; color: 'primary' | 'error' | 'warning';
//     }>({ open: false, title: '', message: '', action: null, color: 'primary' });

//     const handleCloseConfirm = () => setConfirmState(s => ({ ...s, open: false }));

//     const loadData = async (targetId: string) => {
//         const res = await courseService.getSubItems(targetId);
//         if (res.success) { setItems(res.data); fetchEnrolledCounts(res.data); }
//     };

//     const fetchEnrolledCounts = async (courseItems: any[]) => {
//         const results = await Promise.all(
//             courseItems.map(item =>
//                 courseService.getEnrolledStudents(item._id)
//                     .then(res => ({ id: item._id, count: res.success ? res.data.enrolledCount : 0 }))
//                     .catch(() => ({ id: item._id, count: 0 }))
//             )
//         );
//         const countMap: Record<string, number> = {};
//         results.forEach(({ id, count }) => { countMap[id] = count; });
//         setEnrolledCounts(countMap);
//     };

//     useEffect(() => { loadData(parentId); }, [parentId]);

//     const handleClick = async (item: any) => {
//         if (item.itemType === 'folder') {
//             setBreadcrumbs(b => [...b, { id: item._id, title: item.title }]);
//             setParentId(item._id);
//             setSelectedPage(null);
//         } else {
//             const res = await courseService.getPageDetails(item._id);
//             if (res.success) { setSelectedPage(res.data); setTabValue(0); }
//         }
//     };

//     const handleBack = () => {
//         setBreadcrumbs(b => {
//             const n = [...b]; n.pop();
//             setParentId(n.length ? n[n.length - 1].id : 'root');
//             return n;
//         });
//         setSelectedPage(null);
//     };

//     const handleEdit = (e: React.MouseEvent, item: any) => {
//         e.stopPropagation();
//         setEditingId(item._id);
//         setForm({ title: item.title, itemType: item.itemType, content: item.content || '', thumbnail: item.thumbnail || '' });
//         setIsModalOpen(true);
//     };

//     const handleDelete = (e: React.MouseEvent, id: string, content?: string) => {
//         e.stopPropagation();
//         setConfirmState({
//             open: true, title: 'Delete Item', color: 'error',
//             message: 'Are you sure? This will delete all sub-items as well. This action cannot be undone.',
//             action: async () => {
//                 if (content) {
//                     const driveFile = parseDriveFile(content);
//                     if (driveFile?.fileId) {
//                         await deleteFileFromDrive(driveFile.fileId).catch(() => { });
//                     }
//                 }
//                 const res = await courseService.deleteCourse(id);
//                 if (res.success) loadData(parentId);
//                 handleCloseConfirm();
//             },
//         });
//     };

//     const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         try {
//             setIsUploading(true);

//             // Using your custom API service method
//             const result = await courseService.uploadImage(file);

//             if (result.success) {
//                 setForm(f => ({
//                     ...f,
//                     thumbnail: { url: result.url, publicId: result.publicId }
//                 }));
//             } else {
//                 alert('Failed to upload image');
//             }
//         } catch (error: any) {
//             console.error('Error uploading thumbnail:', error);
//             alert(error.response?.data?.message || 'An error occurred during file upload.');
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleThumbnailDelete = async () => {
//         if (!form.thumbnail?.publicId) return;

//         try {
//             setIsUploading(true);

//             // Using your custom API service method (it handles the encoding internally)
//             const result = await courseService.deleteImage(form.thumbnail.publicId);

//             if (result.success) {
//                 setForm(f => ({
//                     ...f,
//                     thumbnail: { url: '', publicId: '' }
//                 }));
//             } else {
//                 alert(result.message || 'Failed to delete image from server');
//             }
//         } catch (error: any) {
//             console.error('Error deleting thumbnail:', error);
//             alert(error.response?.data?.message || 'An error occurred while removing the image.');
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     // --- Your Existing Logic (Updated) ---

//     const handleSubmitConfirm = () => {
//         setConfirmState({
//             open: true, color: 'primary',
//             title: editingId ? 'Update Item' : 'Create New Item',
//             message: `Are you sure you want to ${editingId ? 'update' : 'create'} this ${form.itemType}?`,
//             action: async () => { await handleSubmit(); handleCloseConfirm(); },
//         });
//     };

//     const handleSubmit = async () => {
//         // payload automatic handles ...form containing your thumbnail object details
//         const payload = { ...form, parentId: parentId === 'root' ? null : parentId };

//         const res = editingId
//             ? await courseService.updateCourse(editingId, payload)
//             : await courseService.createCourse(payload);

//         if (res.success) {
//             setIsModalOpen(false);
//             setEditingId(null);
//             // UPDATED: Added thumbnail reset here so the next time the modal opens, it's fresh
//             setForm({ title: '', itemType: 'folder', content: '', thumbnail: { url: '', publicId: '' } });
//             loadData(parentId);
//             if (selectedPage && editingId === selectedPage.details._id) setSelectedPage(null);
//         }
//     };

//     // const handleSubmitConfirm = () => {
//     //     setConfirmState({
//     //         open: true, color: 'primary',
//     //         title: editingId ? 'Update Item' : 'Create New Item',
//     //         message: `Are you sure you want to ${editingId ? 'update' : 'create'} this ${form.itemType}?`,
//     //         action: async () => { await handleSubmit(); handleCloseConfirm(); },
//     //     });
//     // };

//     const handleExportCourseStudents = async (e: React.MouseEvent, item: any) => {
//         e.stopPropagation();
//         try {
//             const res = await courseService.exportCourseStudents(item._id);
//             if (res.success && res.data.length > 0) {
//                 exportUsersToExcel(res.data, `Course_${item.title.replace(/\s+/g, '_')}_Students`);
//             } else {
//                 alert('No students enrolled in this course.');
//             }
//         } catch { alert('Failed to export students'); }
//     };

//     // const handleSubmit = async () => {
//     //     const payload = { ...form, parentId: parentId === 'root' ? null : parentId };
//     //     const res = editingId
//     //         ? await courseService.updateCourse(editingId, payload)
//     //         : await courseService.createCourse(payload);
//     //     if (res.success) {
//     //         setIsModalOpen(false);
//     //         setEditingId(null);
//     //         setForm({ title: '', itemType: 'folder', content: '', thumbnail: "" });
//     //         loadData(parentId);
//     //         if (selectedPage && editingId === selectedPage.details._id) setSelectedPage(null);
//     //     }
//     // };

//     return (
//         <Box sx={{ p: 3 }}>
//             {/* Header */}
//             <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 4 }}>
//                 <Box>
//                     <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Course Curriculum</Typography>
//                     <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
//                         <Link
//                             component="button" variant="body2"
//                             onClick={() => { setParentId('root'); setBreadcrumbs([]); setSelectedPage(null); }}
//                             sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
//                         >Root</Link>
//                         {breadcrumbs.map(b => (
//                             <Typography key={b.id} variant="body2" color="text.secondary">{b.title}</Typography>
//                         ))}
//                     </Breadcrumbs>
//                 </Box>
//                 <Button
//                     variant="contained" startIcon={<Add />}
//                     onClick={() => { setEditingId(null); setForm({ title: '', itemType: 'folder', content: '', thumbnail: { url: '', publicId: '' } }); setIsModalOpen(true); }}
//                     disabled={!!selectedPage}
//                     sx={{ textTransform: 'none', px: 3 }}
//                 >New Item</Button>
//             </Stack>

//             {/* Table view */}
//             {!selectedPage ? (
//                 <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
//                     <Table>
//                         <TableHead sx={{ bgcolor: '#fcfcfc' }}>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
//                                 <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
//                                 <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
//                                 <TableCell sx={{ fontWeight: 700 }}>
//                                     <Tooltip title="Unique enrolled students">
//                                         <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
//                                             <People fontSize="small" /><span>Enrolled</span>
//                                         </Stack>
//                                     </Tooltip>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {parentId !== 'root' && (
//                                 <TableRow hover onClick={handleBack} sx={{ cursor: 'pointer' }}>
//                                     <TableCell colSpan={5}>
//                                         <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
//                                             <ArrowBack fontSize="small" color="action" />
//                                             <Typography variant="body2" sx={{ fontWeight: 600 }}>Go Back</Typography>
//                                         </Stack>
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                             {items.map((item: any) => (
//                                 <TableRow key={item._id} hover onClick={() => handleClick(item)} sx={{ cursor: 'pointer' }}>
//                                     <TableCell sx={{ width: '30%' }}>
//                                         <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
//                                             {item.itemType === 'folder'
//                                                 ? <Folder sx={{ color: '#FFB020' }} />
//                                                 : <Description sx={{ color: '#2196F3' }} />}
//                                             <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.title}</Typography>
//                                         </Stack>
//                                     </TableCell>
//                                     <TableCell sx={{ maxWidth: 250 }}>
//                                         <Typography
//                                             variant="caption"
//                                             sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
//                                         >
//                                             {item.itemType === 'folder'
//                                                 ? (item.content?.length > 30 ? `${item.content.slice(0, 30)}…` : item.content || 'No description')
//                                                 : (() => {
//                                                     const p = parseDriveFile(item.content || '');
//                                                     return p?.fileName ? `📎 ${p.fileName}` : 'File content';
//                                                 })()}
//                                         </Typography>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Chip
//                                             label={item.itemType} size="small" variant="outlined"
//                                             color={item.itemType === 'folder' ? 'warning' : 'primary'}
//                                             sx={{ textTransform: 'capitalize', fontSize: 11, height: 20 }}
//                                         />
//                                     </TableCell>
//                                     <TableCell>
//                                         <Chip
//                                             icon={<People sx={{ fontSize: '14px !important' }} />}
//                                             label={enrolledCounts[item._id] ?? '—'}
//                                             size="small" variant="outlined" color="default"
//                                             sx={{ fontSize: 11, height: 20 }}
//                                         />
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
//                                             <Tooltip title="Export Enrolled Students">
//                                                 <IconButton size="small" onClick={(e) => handleExportCourseStudents(e, item)} sx={{ color: '#0891B2' }}>
//                                                     <Download fontSize="small" />
//                                                 </IconButton>
//                                             </Tooltip>
//                                             <Tooltip title="Edit">
//                                                 <IconButton size="small" onClick={(e) => handleEdit(e, item)}>
//                                                     <Edit fontSize="small" />
//                                                 </IconButton>
//                                             </Tooltip>
//                                             <Tooltip title="Delete">
//                                                 <IconButton size="small" color="error" onClick={(e) => handleDelete(e, item._id, item.content)}>
//                                                     <Delete fontSize="small" />
//                                                 </IconButton>
//                                             </Tooltip>
//                                         </Stack>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             ) : (
//                 <Box sx={{ border: '1px solid #eee', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
//                     <Box sx={{ p: 3, bgcolor: '#fcfcfc', borderBottom: '1px solid #eee' }}>
//                         <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
//                                 <IconButton onClick={() => setSelectedPage(null)}><ArrowBack /></IconButton>
//                                 <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedPage.details.title}</Typography>
//                             </Stack>
//                             <Stack sx={{ flexDirection: 'row', gap: 2 }}>
//                                 <Button variant="outlined" startIcon={<Download />} onClick={(e) => handleExportCourseStudents(e, selectedPage.details)} sx={{ color: '#0891B2', borderColor: '#0891B2' }}>Export Students</Button>
//                                 <Button variant="outlined" startIcon={<Edit />} onClick={(e) => handleEdit(e, selectedPage.details)}>Edit Page</Button>
//                                 <Button variant="outlined" color="error" startIcon={<Delete />} onClick={(e) => { handleDelete(e, selectedPage.details._id, selectedPage.details.content); setSelectedPage(null); }}>Delete</Button>
//                             </Stack>
//                         </Stack>
//                     </Box>

//                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                         <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ px: 2 }}>
//                             <Tab label="Lesson Content" sx={{ fontWeight: 600, textTransform: 'none' }} />
//                             <Tab label={`Enrolled Students (${selectedPage.enrolledStudents.length})`} sx={{ fontWeight: 600, textTransform: 'none' }} />
//                         </Tabs>
//                     </Box>

//                     <Box sx={{ p: 4 }}>
//                         {tabValue === 0 && (
//                             <InlineFileViewer content={selectedPage.details.content || ''} />
//                         )}
//                         {tabValue === 1 && (
//                             <Box sx={{ maxWidth: 800 }}>
//                                 <TableContainer component={Paper} variant="outlined">
//                                     <Table size="small">
//                                         <TableHead sx={{ bgcolor: '#f9f9f9' }}>
//                                             <TableRow>
//                                                 <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
//                                                 <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
//                                                 <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {selectedPage.enrolledStudents.map((student: any, idx: number) => (
//                                                 <TableRow key={idx}>
//                                                     <TableCell>
//                                                         <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
//                                                             <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem' }}>{student.name[0]}</Avatar>
//                                                             <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.name}</Typography>
//                                                         </Stack>
//                                                     </TableCell>
//                                                     <TableCell>{student.email}</TableCell>
//                                                     <TableCell>{student.phone}</TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             </Box>
//                         )}
//                     </Box>
//                 </Box>
//             )}

//             {/* Create / Edit Dialog */}
//             {/* <Dialog
//                 open={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 fullWidth
//                 maxWidth={form.itemType === 'page' ? 'md' : 'sm'}
//                 slotProps={{ paper: { sx: { borderRadius: 3 } } }}
//             >
//                 <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Item' : 'Create New Item'}</DialogTitle>
//                 <Divider />
//                 <DialogContent>
//                     <Stack sx={{ gap: 3, mt: 1 }}>
//                         <TextField
//                             label="Title" fullWidth value={form.title}
//                             onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                             sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                         />
//                         {!editingId && (
//                             <TextField
//                                 select label="Type" value={form.itemType}
//                                 onChange={e => setForm(f => ({ ...f, itemType: e.target.value as any, content: '' }))}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             >
//                                 <MenuItem value="folder">Folder</MenuItem>
//                                 <MenuItem value="page">Page</MenuItem>
//                             </TextField>
//                         )}

//                         {form.itemType === 'folder' && (
//                             <TextField
//                                 label="Folder Description"
//                                 placeholder="Briefly describe what this module covers…"
//                                 fullWidth multiline rows={3} value={form.content}
//                                 onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         )}

//                         {form.itemType === 'page' && (
//                             <Box>
//                                 <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
//                                     Lesson File
//                                 </Typography>
//                                 <DriveFileUploader
//                                     value={form.content}
//                                     onChange={val => setForm(f => ({ ...f, content: val }))}
//                                 />
//                                 <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
//                                     Upload a new file or pick an existing one from your Google Drive. Files are made publicly accessible for students to view inline.
//                                 </Typography>
//                             </Box>
//                         )}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3 }}>
//                     <Button onClick={() => setIsModalOpen(false)} color="inherit">Cancel</Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleSubmitConfirm}
//                         disabled={form.itemType === 'page' && !form.content}
//                     >
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog> */}

//             <Dialog
//                 open={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 fullWidth
//                 maxWidth={form.itemType === 'page' ? 'md' : 'sm'}
//                 slotProps={{ paper: { sx: { borderRadius: 3 } } }}
//             >
//                 <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Item' : 'Create New Item'}</DialogTitle>
//                 <Divider />
//                 <DialogContent>
//                     <Stack sx={{ gap: 3, mt: 1 }}>
//                         <TextField
//                             label="Title" fullWidth value={form.title}
//                             onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
//                             sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                         />
//                         {!editingId && (
//                             <TextField
//                                 select label="Type" value={form.itemType}
//                                 onChange={e => setForm(f => ({ ...f, itemType: e.target.value as any, content: '' }))}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             >
//                                 <MenuItem value="folder">Folder</MenuItem>
//                                 <MenuItem value="page">Page</MenuItem>
//                             </TextField>
//                         )}

//                         {/* --- ADDED: Course Thumbnail Section --- */}
//                         <Box>
//                             <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
//                                 Course Thumbnail
//                             </Typography>

//                             {form.thumbnail?.url ? (
//                                 <Box sx={{ position: 'relative', width: 'fit-content', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
//                                     <img
//                                         src={form.thumbnail.url}
//                                         alt="Thumbnail Preview"
//                                         style={{ width: '180px', height: '110px', objectFit: 'cover', display: 'block' }}
//                                     />
//                                     <IconButton
//                                         size="small"
//                                         onClick={handleThumbnailDelete}
//                                         disabled={isUploading}
//                                         sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
//                                     >
//                                         <DeleteIcon fontSize="small" />
//                                     </IconButton>
//                                 </Box>
//                             ) : (
//                                 <Button
//                                     variant="outlined"
//                                     component="label"
//                                     startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
//                                     disabled={isUploading}
//                                     sx={{ borderRadius: 2, height: '56px', textTransform: 'none', borderStyle: 'dashed', borderWidth: 2 }}
//                                 >
//                                     {isUploading ? 'Uploading...' : 'Upload Thumbnail Image'}
//                                     <input type="file" accept="image/*" hidden onChange={handleThumbnailUpload} />
//                                 </Button>
//                             )}
//                         </Box>
//                         {/* -------------------------------------- */}

//                         {form.itemType === 'folder' && (
//                             <TextField
//                                 label="Folder Description"
//                                 placeholder="Briefly describe what this module covers…"
//                                 fullWidth multiline rows={3} value={form.content}
//                                 onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         )}

//                         {form.itemType === 'page' && (
//                             <Box>
//                                 <Typography variant="caption" sx={{ mb: 1.5, display: 'block', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
//                                     Lesson File
//                                 </Typography>
//                                 <DriveFileUploader
//                                     value={form.content}
//                                     onChange={val => setForm(f => ({ ...f, content: val }))}
//                                 />
//                                 <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
//                                     Upload a new file or pick an existing one from your Google Drive. Files are made publicly accessible for students to view inline.
//                                 </Typography>
//                             </Box>
//                         )}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3 }}>
//                     <Button onClick={() => setIsModalOpen(false)} color="inherit">Cancel</Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleSubmitConfirm}
//                         disabled={isUploading || (form.itemType === 'page' && !form.content)}
//                     >
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <ConfirmDialog
//                 open={confirmState.open}
//                 title={confirmState.title}
//                 message={confirmState.message}
//                 onConfirm={() => confirmState.action?.()}
//                 onCancel={handleCloseConfirm}
//                 confirmColor={confirmState.color}
//             />
//         </Box>
//     );
// };

// export default Courses;

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Typography, Button, Breadcrumbs, Link, Stack,
    Alert, Snackbar, useMediaQuery, useTheme
} from '@mui/material';
import { Add, ChevronRight } from '@mui/icons-material';

import { courseService } from '../services/api';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { exportUsersToExcel } from '../../../utils/excel';
import { parseDriveFile, deleteFileFromDrive } from '../services/googleApiServices';
import CourseTable from './CourseTable';
import type { ConfirmState, CourseFormState, CourseItem, PageDetails } from './types';
import PageDetailView from './PageDetailView';
import CourseFormDialog from './CourseFormDialog';
import UploadOverlay from '../../../components/UploadOverlay';

// ─── Default form state ────────────────────────────────────────────────────────
const defaultForm: CourseFormState = {
    title: '',
    itemType: 'folder',
    content: '',
    thumbnail: { url: '', publicId: '' },
};

// ─── Courses Page ──────────────────────────────────────────────────────────────
const Courses: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // ── State ──────────────────────────────────────────────────────────────────
    const [items, setItems] = useState<CourseItem[]>([]);
    const [parentId, setParentId] = useState('root');
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; title: string }[]>([]);

    const [selectedPage, setSelectedPage] = useState<PageDetails | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CourseFormState>(defaultForm);
    const [isUploading, setIsUploading] = useState(false);

    const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number>>({});

    const [confirmState, setConfirmState] = useState<ConfirmState>({
        open: false, title: '', message: '', action: null, color: 'primary',
    });

    // Toast for non-blocking errors / messages
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'error' | 'success' | 'info' }>({
        open: false, message: '', severity: 'info',
    });

    const showToast = (message: string, severity: 'error' | 'success' | 'info' = 'error') =>
        setToast({ open: true, message, severity });

    const handleCloseConfirm = () => setConfirmState(s => ({ ...s, open: false }));

    // ── Data loading ───────────────────────────────────────────────────────────
    const loadData = async (targetId: string) => {
        try {
            const res = await courseService.getSubItems(targetId);
            if (res.success) {
                setItems(res.data);
                fetchEnrolledCounts(res.data);
            } else {
                showToast('Failed to load course items. Please refresh the page.');
            }
        } catch (err: any) {
            showToast(err.message || 'Network error while loading items.');
        }
    };

    const fetchEnrolledCounts = async (courseItems: CourseItem[]) => {
        const results = await Promise.all(
            courseItems.map(item =>
                courseService.getEnrolledStudents(item._id)
                    .then(res => ({ id: item._id, count: res.success ? res.data.enrolledCount : 0 }))
                    .catch(() => ({ id: item._id, count: 0 }))
            )
        );
        const countMap: Record<string, number> = {};
        results.forEach(({ id, count }) => { countMap[id] = count; });
        setEnrolledCounts(countMap);
    };

    useEffect(() => { loadData(parentId); }, [parentId]);

    // ── Navigation ─────────────────────────────────────────────────────────────
    const handleItemClick = async (item: CourseItem) => {
        if (item.itemType === 'folder') {
            setBreadcrumbs(b => [...b, { id: item._id, title: item.title }]);
            setParentId(item._id);
            setSelectedPage(null);
        } else {
            try {
                const res = await courseService.getPageDetails(item._id);
                if (res.success) {
                    setSelectedPage(res.data);
                } else {
                    showToast('Could not load lesson details. Please try again.');
                }
            } catch (err: any) {
                showToast(err.message || 'Failed to open lesson.');
            }
        }
    };

    const handleBack = () => {
        setBreadcrumbs(b => {
            const next = [...b];
            next.pop();
            setParentId(next.length ? next[next.length - 1].id : 'root');
            return next;
        });
        setSelectedPage(null);
    };

    // ── CRUD ───────────────────────────────────────────────────────────────────
    const handleEdit = (e: React.MouseEvent, item: CourseItem) => {
        e.stopPropagation();
        setEditingId(item._id);
        setForm({
            title: item.title,
            itemType: item.itemType,
            content: item.content || '',
            thumbnail: item.thumbnail ?? { url: '', publicId: '' },
        });
        setIsModalOpen(true);
    };

    const handleDelete = (e: React.MouseEvent, id: string, content?: string) => {
        e.stopPropagation();
        setConfirmState({
            open: true,
            title: 'Delete Item',
            color: 'error',
            message: 'Are you sure? This will delete all sub-items as well. This action cannot be undone.',
            action: async () => {
                try {
                    if (content) {
                        const driveFile = parseDriveFile(content);
                        if (driveFile?.fileId) {
                            await deleteFileFromDrive(driveFile.fileId).catch(() => { });
                        }
                    }
                    const res = await courseService.deleteCourse(id);
                    if (res.success) {
                        loadData(parentId);
                        showToast('Item deleted successfully.', 'success');
                    } else {
                        showToast('Failed to delete item. Please try again.');
                    }
                } catch (err: any) {
                    showToast(err.message || 'An error occurred while deleting.');
                }
                handleCloseConfirm();
            },
        });
    };

    const handleSubmitConfirm = () => {
        if (!form.title.trim()) {
            showToast('Please enter a title before saving.');
            return;
        }
        setConfirmState({
            open: true,
            color: 'primary',
            title: editingId ? 'Update Item' : 'Create New Item',
            message: `Are you sure you want to ${editingId ? 'update' : 'create'} this ${form.itemType}?`,
            action: async () => {
                await handleSubmit();
                handleCloseConfirm();
            },
        });
    };

    const handleSubmit = async () => {
        const payload = { ...form, parentId: parentId === 'root' ? null : parentId };
        try {
            const res = editingId
                ? await courseService.updateCourse(editingId, payload)
                : await courseService.createCourse(payload);

            if (res.success) {
                setIsModalOpen(false);
                setEditingId(null);
                setForm(defaultForm);
                loadData(parentId);
                if (selectedPage && editingId === selectedPage.details._id) setSelectedPage(null);
                showToast(editingId ? 'Item updated successfully.' : 'Item created successfully.', 'success');
            } else {
                showToast(res.message || 'Failed to save. Please try again.');
            }
        } catch (err: any) {
            showToast(err.message || 'An unexpected error occurred.');
        }
    };

    // ── Thumbnail ──────────────────────────────────────────────────────────────
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
            const result = await courseService.uploadImage(file);
            if (result.success) {
                setForm(f => ({ ...f, thumbnail: { url: result.url, publicId: result.publicId } }));
                showToast('Thumbnail uploaded!', 'success');
            } else {
                // Option A: Quick and safe check using type casting
                showToast((result as any).message || 'Failed to upload thumbnail image.');
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || err.message || 'Error uploading thumbnail.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleThumbnailDelete = async () => {
        if (!form.thumbnail?.publicId) return;
        try {
            setIsUploading(true);
            const result = await courseService.deleteImage(form.thumbnail.publicId);
            if (result.success) {
                setForm(f => ({ ...f, thumbnail: { url: '', publicId: '' } }));
            } else {
                showToast(result.message || 'Failed to remove thumbnail.');
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || err.message || 'Error removing thumbnail.');
        } finally {
            setIsUploading(false);
        }
    };

    // ── Export ─────────────────────────────────────────────────────────────────
    const handleExportCourseStudents = async (e: React.MouseEvent, item: CourseItem) => {
        e.stopPropagation();
        try {
            const res = await courseService.exportCourseStudents(item._id);
            if (res.success && res.data.length > 0) {
                exportUsersToExcel(res.data, `Course_${item.title.replace(/\s+/g, '_')}_Students`);
                showToast('Export started!', 'success');
            } else {
                showToast('No students enrolled in this course.', 'info');
            }
        } catch (err: any) {
            showToast(err.message || 'Failed to export students.');
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* ── Header ── */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}

                sx={{
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 4
                }}
            >
                <Box>
                    <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 800, mb: 0.5 }}>
                        Course Curriculum
                    </Typography>
                    <Breadcrumbs
                        separator={<ChevronRight fontSize="small" />}
                        sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'wrap' } }}
                    >
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => { setParentId('root'); setBreadcrumbs([]); setSelectedPage(null); }}
                            sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                        >
                            Root
                        </Link>
                        {breadcrumbs.map((b, i) => (
                            i < breadcrumbs.length - 1 ? (
                                <Link
                                    key={b.id}
                                    component="button"
                                    variant="body2"
                                    onClick={() => {
                                        const next = breadcrumbs.slice(0, i + 1);
                                        setBreadcrumbs(next);
                                        setParentId(b.id);
                                        setSelectedPage(null);
                                    }}
                                    sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'none' }}
                                >
                                    {b.title}
                                </Link>
                            ) : (
                                <Typography key={b.id} variant="body2" color="text.secondary">{b.title}</Typography>
                            )
                        ))}
                    </Breadcrumbs>
                </Box>

                {!selectedPage && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => { setEditingId(null); setForm(defaultForm); setIsModalOpen(true); }}
                        sx={{ textTransform: 'none', px: 3, flexShrink: 0 }}
                        size={isMobile ? 'medium' : 'large'}
                    >
                        New Item
                    </Button>
                )}
            </Stack>

            {/* ── Main view ── */}
            <AnimatePresence mode="wait">
                {!selectedPage ? (
                    <motion.div
                        key="course-table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CourseTable
                            items={items}
                            parentId={parentId}
                            enrolledCounts={enrolledCounts}
                            onItemClick={handleItemClick}
                            onBack={handleBack}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onExport={handleExportCourseStudents}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="page-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PageDetailView
                            page={selectedPage}
                            onBack={() => setSelectedPage(null)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onExport={handleExportCourseStudents}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Create / Edit Dialog ── */}
            <CourseFormDialog
                open={isModalOpen}
                editingId={editingId}
                form={form}
                isUploading={isUploading}
                onClose={() => { setIsModalOpen(false); setForm(defaultForm); setEditingId(null); }}
                onFormChange={setForm}
                onSubmit={handleSubmitConfirm}
                onThumbnailUpload={handleThumbnailUpload}
                onThumbnailDelete={handleThumbnailDelete}
            />

            {/* ── Confirm Dialog ── */}
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={() => confirmState.action?.()}
                onCancel={handleCloseConfirm}
                confirmColor={confirmState.color}
            />

            {/* ── Toast notifications ── */}
            <Snackbar
                open={toast.open}
                autoHideDuration={5000}
                onClose={() => setToast(t => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={toast.severity}
                    onClose={() => setToast(t => ({ ...t, open: false }))}
                    variant="filled"
                    sx={{ width: '100%', maxWidth: 420, borderRadius: 2 }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            {/* ── Uploading Overlay ── */}
            <UploadOverlay open={isUploading} />
        </Box>
    );
};

export default Courses;