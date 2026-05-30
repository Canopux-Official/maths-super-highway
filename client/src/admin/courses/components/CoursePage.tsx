


// import React, { useEffect, useState } from 'react';
// import {
//     Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Paper, Breadcrumbs, Link, Dialog, DialogTitle,
//     DialogContent, TextField, MenuItem, DialogActions, Stack, Avatar,
//     IconButton, Tabs, Tab, Divider, Chip, Tooltip
// } from '@mui/material';
// import {
//     Folder, Description, Add, ChevronRight,
//     ArrowBack, Edit, Delete, People
// } from '@mui/icons-material';
// import Editor from '../components/TiptapEditor';
// import { courseService } from '../services/api';

// const Courses = () => {
//     const [items, setItems] = useState<any[]>([]);
//     const [parentId, setParentId] = useState('root');
//     const [breadcrumbs, setBreadcrumbs] = useState<{ id: string, title: string }[]>([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedPage, setSelectedPage] = useState<any>(null);
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [form, setForm] = useState({ title: '', itemType: 'folder' as 'folder' | 'page', content: '' });
//     const [tabValue, setTabValue] = useState(0);
//     const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number>>({});

//     const loadData = async (targetId: string) => {
//         const res = await courseService.getSubItems(targetId);
//         if (res.success) {
//             setItems(res.data);
//             // Fetch enrolled count for each item in parallel
//             fetchEnrolledCounts(res.data);
//         }
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
//             setBreadcrumbs([...breadcrumbs, { id: item._id, title: item.title }]);
//             setParentId(item._id);
//             setSelectedPage(null);
//         } else {
//             const res = await courseService.getPageDetails(item._id);
//             if (res.success) {
//                 setSelectedPage(res.data);
//                 setTabValue(0);
//             }
//         }
//     };

//     const handleBack = () => {
//         const newBread = [...breadcrumbs];
//         newBread.pop();
//         setBreadcrumbs(newBread);
//         setParentId(newBread.length ? newBread[newBread.length - 1].id : 'root');
//         setSelectedPage(null);
//     };

//     const handleEdit = (e: React.MouseEvent, item: any) => {
//         e.stopPropagation();
//         setEditingId(item._id);
//         setForm({ title: item.title, itemType: item.itemType, content: item.content || '' });
//         setIsModalOpen(true);
//     };

//     const handleDelete = async (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         if (window.confirm("Are you sure? This will delete all sub-items as well.")) {
//             const res = await courseService.deleteCourse(id);
//             if (res.success) loadData(parentId);
//         }
//     };

//     const handleSubmit = async () => {
//         const payload = { ...form, parentId: parentId === 'root' ? null : parentId };
//         let res = editingId
//             ? await courseService.updateCourse(editingId, payload)
//             : await courseService.createCourse(payload);
//         if (res.success) {
//             setIsModalOpen(false);
//             setEditingId(null);
//             setForm({ title: '', itemType: 'folder', content: '' });
//             loadData(parentId);
//             if (selectedPage && editingId === selectedPage.details._id) setSelectedPage(null);
//         }
//     };

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
//                         >
//                             Root
//                         </Link>
//                         {breadcrumbs.map(b => (
//                             <Typography key={b.id} variant="body2" color="text.secondary">{b.title}</Typography>
//                         ))}
//                     </Breadcrumbs>
//                 </Box>
//                 <Button
//                     variant="contained" startIcon={<Add />}
//                     onClick={() => { setEditingId(null); setIsModalOpen(true); }}
//                     disabled={!!selectedPage}
//                     sx={{ textTransform: 'none', px: 3 }}
//                 >
//                     New Item
//                 </Button>
//             </Stack>

//             {!selectedPage ? (
//                 <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
//                     <Table>
//                         <TableHead sx={{ bgcolor: '#fcfcfc' }}>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
//                                 <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
//                                 <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
//                                 {/* ── NEW COLUMN ── */}
//                                 <TableCell sx={{ fontWeight: 700 }}>
//                                     <Tooltip title="Unique enrolled students">
//                                         <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
//                                             <People fontSize="small" />
//                                             <span>Enrolled</span>
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
//                                                 ? (item.content?.length > 30 ? `${item.content.slice(0, 30)}...` : item.content || 'No description')
//                                                 : 'Rich text content...'}
//                                         </Typography>
//                                     </TableCell>

//                                     <TableCell>
//                                         <Chip
//                                             label={item.itemType} size="small" variant="outlined"
//                                             color={item.itemType === 'folder' ? 'warning' : 'primary'}
//                                             sx={{ textTransform: 'capitalize', fontSize: 11, height: 20 }}
//                                         />
//                                     </TableCell>

//                                     {/* ── Enrolled count cell ── */}
//                                     <TableCell>
//                                         <Chip
//                                             icon={<People sx={{ fontSize: '14px !important' }} />}
//                                             label={enrolledCounts[item._id] ?? '—'}
//                                             size="small"
//                                             variant="outlined"
//                                             color="default"
//                                             sx={{ fontSize: 11, height: 20 }}
//                                         />
//                                     </TableCell>

//                                     <TableCell align="right">
//                                         <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
//                                             <IconButton size="small" onClick={(e) => handleEdit(e, item)}>
//                                                 <Edit fontSize="small" />
//                                             </IconButton>
//                                             <IconButton size="small" color="error" onClick={(e) => handleDelete(e, item._id)}>
//                                                 <Delete fontSize="small" />
//                                             </IconButton>
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
//                                 <Button variant="outlined" startIcon={<Edit />} onClick={(e) => handleEdit(e, selectedPage.details)}>Edit Page</Button>
//                                 <Button variant="outlined" color="error" startIcon={<Delete />} onClick={(e) => { handleDelete(e, selectedPage.details._id); setSelectedPage(null); }}>Delete</Button>
//                             </Stack>
//                         </Stack>
//                     </Box>

//                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                         <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ px: 2 }}>
//                             <Tab label="Lesson Content" sx={{ fontWeight: 600, textTransform: 'none' }} />
//                             <Tab
//                                 label={`Enrolled Students (${selectedPage.enrolledStudents.length})`}
//                                 sx={{ fontWeight: 600, textTransform: 'none' }}
//                             />
//                         </Tabs>
//                     </Box>

//                     <Box sx={{ p: 4 }}>
//                         {tabValue === 0 && (
//                             <Box
//                                 dangerouslySetInnerHTML={{ __html: selectedPage.details.content || '<p>No content available.</p>' }}
//                                 sx={{ minHeight: 400 }}
//                             />
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

//             {/* Dialog */}
//             <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 3, p: 0 } } }}>
//                 <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Item' : 'Create New Item'}</DialogTitle>
//                 <Divider />
//                 <DialogContent>
//                     <Stack sx={{ gap: 3, mt: 1 }}>
//                         <TextField
//                             label="Title" fullWidth value={form.title}
//                             onChange={e => setForm({ ...form, title: e.target.value })}
//                             sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                         />
//                         {!editingId && (
//                             <TextField
//                                 select label="Type" value={form.itemType}
//                                 onChange={e => setForm({ ...form, itemType: e.target.value as any })}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             >
//                                 <MenuItem value="folder">Folder</MenuItem>
//                                 <MenuItem value="page">Page</MenuItem>
//                             </TextField>
//                         )}
//                         {form.itemType === 'folder' && (
//                             <TextField
//                                 label="Folder Description" placeholder="Briefly describe what this module covers..."
//                                 fullWidth multiline rows={3} value={form.content}
//                                 onChange={e => setForm({ ...form, content: e.target.value })}
//                                 sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
//                             />
//                         )}
//                         {form.itemType === 'page' && (
//                             <Box>
//                                 <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
//                                     Lesson Content
//                                 </Typography>
//                                 <Editor value={form.content} onChange={html => setForm({ ...form, content: html })} />
//                             </Box>
//                         )}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 3 }}>
//                     <Button onClick={() => setIsModalOpen(false)} color="inherit">Cancel</Button>
//                     <Button variant="contained" onClick={handleSubmit}>Save Changes</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default Courses;

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Breadcrumbs, Link, Dialog, DialogTitle,
    DialogContent, TextField, MenuItem, DialogActions, Stack, Avatar,
    IconButton, Tabs, Tab, Divider, Chip, Tooltip
} from '@mui/material';
import {
    Folder, Description, Add, ChevronRight,
    ArrowBack, Edit, Delete, People
} from '@mui/icons-material';
import Editor from '../components/TiptapEditor';
import { courseService } from '../services/api';

const Courses = () => {
    const [items, setItems] = useState<any[]>([]);
    const [parentId, setParentId] = useState('root');
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string, title: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<any>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', itemType: 'folder' as 'folder' | 'page', content: '' });
    const [tabValue, setTabValue] = useState(0);
    const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number>>({});

    const loadData = async (targetId: string) => {
        const res = await courseService.getSubItems(targetId);
        if (res.success) {
            setItems(res.data);
            fetchEnrolledCounts(res.data);
        }
    };

    const fetchEnrolledCounts = async (courseItems: any[]) => {
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

    const handleClick = async (item: any) => {
        if (item.itemType === 'folder') {
            setBreadcrumbs([...breadcrumbs, { id: item._id, title: item.title }]);
            setParentId(item._id);
            setSelectedPage(null);
        } else {
            const res = await courseService.getPageDetails(item._id);
            if (res.success) {
                setSelectedPage(res.data);
                setTabValue(0);
            }
        }
    };

    const handleBack = () => {
        const newBread = [...breadcrumbs];
        newBread.pop();
        setBreadcrumbs(newBread);
        setParentId(newBread.length ? newBread[newBread.length - 1].id : 'root');
        setSelectedPage(null);
    };

    const handleEdit = (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        setEditingId(item._id);
        setForm({ title: item.title, itemType: item.itemType, content: item.content || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure? This will delete all sub-items as well.")) {
            const res = await courseService.deleteCourse(id);
            if (res.success) loadData(parentId);
        }
    };

    const handleSubmit = async () => {
        const payload = { ...form, parentId: parentId === 'root' ? null : parentId };
        let res = editingId
            ? await courseService.updateCourse(editingId, payload)
            : await courseService.createCourse(payload);
        if (res.success) {
            setIsModalOpen(false);
            setEditingId(null);
            setForm({ title: '', itemType: 'folder', content: '' });
            loadData(parentId);
            if (selectedPage && editingId === selectedPage.details._id) setSelectedPage(null);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Course Curriculum</Typography>
                    <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
                        <Link
                            component="button" variant="body2"
                            onClick={() => { setParentId('root'); setBreadcrumbs([]); setSelectedPage(null); }}
                            sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                        >
                            Root
                        </Link>
                        {breadcrumbs.map(b => (
                            <Typography key={b.id} variant="body2" color="text.secondary">{b.title}</Typography>
                        ))}
                    </Breadcrumbs>
                </Box>
                <Button
                    variant="contained" startIcon={<Add />}
                    onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                    disabled={!!selectedPage}
                    sx={{ textTransform: 'none', px: 3 }}
                >
                    New Item
                </Button>
            </Stack>

            {!selectedPage ? (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fcfcfc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>
                                    <Tooltip title="Unique enrolled students">
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                                            <People fontSize="small" />
                                            <span>Enrolled</span>
                                        </Stack>
                                    </Tooltip>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {parentId !== 'root' && (
                                <TableRow hover onClick={handleBack} sx={{ cursor: 'pointer' }}>
                                    <TableCell colSpan={5}>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                            <ArrowBack fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Go Back</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                            {items.map((item: any) => (
                                <TableRow key={item._id} hover onClick={() => handleClick(item)} sx={{ cursor: 'pointer' }}>
                                    <TableCell sx={{ width: '30%' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                            {item.itemType === 'folder'
                                                ? <Folder sx={{ color: '#FFB020' }} />
                                                : <Description sx={{ color: '#2196F3' }} />}
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.title}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 250 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                                        >
                                            {item.itemType === 'folder'
                                                ? (item.content?.length > 30 ? `${item.content.slice(0, 30)}...` : item.content || 'No description')
                                                : 'Rich text content...'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.itemType} size="small" variant="outlined"
                                            color={item.itemType === 'folder' ? 'warning' : 'primary'}
                                            sx={{ textTransform: 'capitalize', fontSize: 11, height: 20 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={<People sx={{ fontSize: '14px !important' }} />}
                                            label={enrolledCounts[item._id] ?? '—'}
                                            size="small"
                                            variant="outlined"
                                            color="default"
                                            sx={{ fontSize: 11, height: 20 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
                                            <IconButton size="small" onClick={(e) => handleEdit(e, item)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={(e) => handleDelete(e, item._id)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ border: '1px solid #eee', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
                    <Box sx={{ p: 3, bgcolor: '#fcfcfc', borderBottom: '1px solid #eee' }}>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                <IconButton onClick={() => setSelectedPage(null)}><ArrowBack /></IconButton>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedPage.details.title}</Typography>
                            </Stack>
                            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
                                <Button variant="outlined" startIcon={<Edit />} onClick={(e) => handleEdit(e, selectedPage.details)}>Edit Page</Button>
                                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={(e) => { handleDelete(e, selectedPage.details._id); setSelectedPage(null); }}>Delete</Button>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ px: 2 }}>
                            <Tab label="Lesson Content" sx={{ fontWeight: 600, textTransform: 'none' }} />
                            <Tab
                                label={`Enrolled Students (${selectedPage.enrolledStudents.length})`}
                                sx={{ fontWeight: 600, textTransform: 'none' }}
                            />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        {tabValue === 0 && (
                            <Box
                                dangerouslySetInnerHTML={{ __html: selectedPage.details.content || '<p>No content available.</p>' }}
                                sx={{
                                    minHeight: 400,

                                    // Headings
                                    '& h1': { fontSize: '2rem', fontWeight: 700, mt: 3, mb: 1.5, lineHeight: 1.3 },
                                    '& h2': { fontSize: '1.5rem', fontWeight: 700, mt: 3, mb: 1.5, lineHeight: 1.3 },
                                    '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 2.5, mb: 1, lineHeight: 1.4 },
                                    '& h4': { fontSize: '1.1rem', fontWeight: 600, mt: 2, mb: 1 },

                                    // ✅ FIX: removed `color: 'text.primary'` from <p>.
                                    //    A hardcoded paragraph color overrides any inline color spans
                                    //    that the editor places inside paragraphs via TextStyle marks.
                                    '& p': { fontSize: '0.975rem', lineHeight: 1.8, mb: 1.5 },
                                    '& p:empty': { display: 'none' },

                                    // Lists
                                    '& ul': { pl: 3, mb: 1.5, listStyleType: 'disc' },
                                    '& ol': { pl: 3, mb: 1.5, listStyleType: 'decimal' },
                                    '& li': { fontSize: '0.975rem', lineHeight: 1.8, mb: 0.5 },
                                    '& li::marker': { color: 'text.secondary' },

                                    // Nested lists
                                    '& ul ul, & ol ol, & ul ol, & ol ul': { mt: 0.5, mb: 0 },

                                    // Blockquote
                                    '& blockquote': {
                                        borderLeft: '4px solid',
                                        borderColor: 'primary.main',
                                        pl: 2,
                                        ml: 0,
                                        my: 2,
                                        color: 'text.secondary',
                                        fontStyle: 'italic',
                                    },

                                    // Inline code
                                    '& code': {
                                        bgcolor: '#f3f4f6',
                                        px: 0.75,
                                        py: 0.25,
                                        borderRadius: 1,
                                        fontSize: '0.85rem',
                                        fontFamily: 'monospace',
                                        color: '#d63384',
                                    },

                                    // Code block
                                    '& pre': {
                                        bgcolor: '#1e1e1e',
                                        color: '#d4d4d4',
                                        p: 2,
                                        borderRadius: 2,
                                        overflowX: 'auto',
                                        my: 2,
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        fontFamily: 'monospace',
                                        '& code': {
                                            bgcolor: 'transparent',
                                            p: 0,
                                            color: 'inherit',
                                            fontSize: 'inherit',
                                        },
                                    },

                                    // Links
                                    '& a': { color: 'primary.main', textDecoration: 'underline', '&:hover': { opacity: 0.8 } },

                                    // Images
                                    '& img': { maxWidth: '100%', borderRadius: 1, my: 1, display: 'block' },

                                    // ✅ FIX: strong and em now use `inherit` instead of no color / implicit
                                    //    browser defaults. Without `color: inherit`, some MUI theme resets
                                    //    or browser UA stylesheets push a fixed color onto <strong> that
                                    //    fights the inline style applied by the editor's Color extension.
                                    '& strong': { fontWeight: 700, color: 'inherit' },
                                    '& em': { fontStyle: 'italic', color: 'inherit' },

                                    // ✅ FIX: ensure <span> elements (used by Tiptap's TextStyle mark to
                                    //    carry inline color/fontSize/fontFamily) are never overridden by
                                    //    a catch-all rule. `color: inherit` lets the inline style win.
                                    '& span': { color: 'inherit' },

                                    // Horizontal rule
                                    '& hr': { my: 3, borderColor: 'divider' },

                                    // Tables
                                    '& table': { width: '100%', borderCollapse: 'collapse', my: 2 },
                                    '& th': { bgcolor: '#f9f9f9', fontWeight: 700, border: '1px solid #e0e0e0', p: 1, textAlign: 'left', fontSize: '0.875rem' },
                                    '& td': { border: '1px solid #e0e0e0', p: 1, fontSize: '0.875rem', verticalAlign: 'top' },
                                    '& tr:nth-of-type(even) td': { bgcolor: '#fafafa' },
                                }}
                            />
                        )}
                        {tabValue === 1 && (
                            <Box sx={{ maxWidth: 800 }}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedPage.enrolledStudents.map((student: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                                            <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem' }}>{student.name[0]}</Avatar>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.name}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>{student.email}</TableCell>
                                                    <TableCell>{student.phone}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            {/* Dialog */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 3, p: 0 } } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Item' : 'Create New Item'}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack sx={{ gap: 3, mt: 1 }}>
                        <TextField
                            label="Title" fullWidth value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        {!editingId && (
                            <TextField
                                select label="Type" value={form.itemType}
                                onChange={e => setForm({ ...form, itemType: e.target.value as any })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="folder">Folder</MenuItem>
                                <MenuItem value="page">Page</MenuItem>
                            </TextField>
                        )}
                        {form.itemType === 'folder' && (
                            <TextField
                                label="Folder Description" placeholder="Briefly describe what this module covers..."
                                fullWidth multiline rows={3} value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        )}
                        {form.itemType === 'page' && (
                            <Box>
                                <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Lesson Content
                                </Typography>
                                <Editor value={form.content} onChange={html => setForm({ ...form, content: html })} />
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Courses;