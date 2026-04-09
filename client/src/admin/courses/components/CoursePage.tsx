// import React, { useEffect, useState } from 'react';
// import {
//     Box, Typography, Button, Card, CardActionArea, CardContent,
//     Breadcrumbs, Link, Dialog, DialogTitle, DialogContent,
//     TextField, MenuItem, DialogActions, Stack, Avatar, IconButton, Tooltip
// } from '@mui/material';
// import {
//     Folder, Description, Add, ChevronRight,
//     ArrowBack, School, Email, Edit, Delete, MoreVert
// } from '@mui/icons-material';
// import Editor from '../components/TiptapEditor';
// import { courseService } from '../services/api';

// const Courses = () => {
//     const [items, setItems] = useState([]);
//     const [parentId, setParentId] = useState('root');
//     const [breadcrumbs, setBreadcrumbs] = useState<{ id: string, title: string }[]>([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedPage, setSelectedPage] = useState<any>(null);
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [form, setForm] = useState({ title: '', itemType: 'folder' as 'folder' | 'page', content: '' });

//     const loadData = async (targetId: string) => {
//         const res = await courseService.getSubItems(targetId);
//         if (res.success) setItems(res.data);
//     };

//     useEffect(() => { loadData(parentId); }, [parentId]);

//     const handleClick = async (item: any) => {
//         if (item.itemType === 'folder') {
//             setBreadcrumbs([...breadcrumbs, { id: item._id, title: item.title }]);
//             setParentId(item._id);
//             setSelectedPage(null);
//         } else {
//             const res = await courseService.getPageDetails(item._id);
//             if (res.success) setSelectedPage(res.data);
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
//         e.stopPropagation(); // Prevents navigation
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
//         let res;
//         if (editingId) {
//             res = await courseService.updateCourse(editingId, payload);
//         } else {
//             res = await courseService.createCourse(payload);
//         }

//         if (res.success) {
//             setIsModalOpen(false);
//             setEditingId(null);
//             setForm({ title: '', itemType: 'folder', content: '' });
//             loadData(parentId);
//             if (selectedPage && editingId === selectedPage.details._id) setSelectedPage(null);
//         }
//     };

//     return (
//         <Box sx={{ p: 1 }}>
//             {/* Header Area */}
//             <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3, display: 'flex' }}>
//                 <Box>
//                     <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>Course Curriculum</Typography>
//                     <Breadcrumbs separator={<ChevronRight sx={{ fontSize: 'small' }} />}>
//                         <Link component="button" onClick={() => { setParentId('root'); setBreadcrumbs([]); setSelectedPage(null); }} sx={{ cursor: 'pointer', textDecoration: 'none', fontSize: '0.875rem' }}>Root</Link>
//                         {breadcrumbs.map(b => <Typography key={b.id} sx={{ fontSize: '0.875rem' }} color="text.secondary">{b.title}</Typography>)}
//                     </Breadcrumbs>
//                 </Box>
//                 <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingId(null); setIsModalOpen(true); }} disabled={!!selectedPage} sx={{ borderRadius: 2 }}>New Item</Button>
//             </Stack>

//             {!selectedPage ? (
//                 <>
//                     {parentId !== 'root' && <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>Back</Button>}
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
//                         {items.map((item: any) => (
//                             <Box key={item._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)', lg: 'calc(25% - 18px)' } }}>
//                                 <Card variant="outlined" sx={{ borderRadius: 3, position: 'relative' }}>
//                                     {/* Action Buttons overlay */}
//                                     <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 2, display: 'flex', gap: 0.5 }}>
//                                         <IconButton size="small" onClick={(e) => handleEdit(e, item)} sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}><Edit fontSize="small" /></IconButton>
//                                         <IconButton size="small" onClick={(e) => handleDelete(e, item._id)} sx={{ bgcolor: 'rgba(255,255,255,0.8)', color: 'error.main' }}><Delete fontSize="small" /></IconButton>
//                                     </Box>

//                                     <CardActionArea onClick={() => handleClick(item)}>
//                                         <CardContent sx={{ textAlign: 'center', py: 3 }}>
//                                             {item.itemType === 'folder' ? <Folder sx={{ fontSize: 50, color: 'primary.main' }} /> : <Description sx={{ fontSize: 50, color: 'info.main' }} />}
//                                             <Typography sx={{ fontWeight: 600, mt: 1 }}>{item.title}</Typography>
//                                             <Typography variant="caption" color="text.secondary">{item.itemType}</Typography>
//                                         </CardContent>
//                                     </CardActionArea>
//                                 </Card>
//                             </Box>
//                         ))}
//                     </Box>
//                 </>
//             ) : (
//                 <Box sx={{ mt: 2, p: { xs: 2, md: 4 }, bgcolor: 'white', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//                     <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3, display: 'flex' }}>
//                         <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center', display: 'flex' }}>
//                             <Button startIcon={<ArrowBack />} onClick={() => setSelectedPage(null)}>Close</Button>
//                             <Typography variant="h4" sx={{ fontWeight: 800 }}>{selectedPage.details.title}</Typography>
//                         </Stack>
//                         <Stack sx={{ flexDirection: 'row', gap: 1, display: 'flex' }}>
//                             <Button variant="outlined" startIcon={<Edit />} onClick={(e) => handleEdit(e, selectedPage.details)}>Edit Page</Button>
//                             <Button variant="outlined" color="error" startIcon={<Delete />} onClick={(e) => { handleDelete(e, selectedPage.details._id); setSelectedPage(null); }}>Delete</Button>
//                         </Stack>
//                     </Stack>

//                     <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
//                         <Box sx={{ flex: 2 }}>
//                             <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>Lesson Content</Typography>
//                             <Box sx={{ p: 3, bgcolor: '#f9fbf9', borderRadius: 2, minHeight: '300px', border: '1px solid #edf2f0', '& img': { maxWidth: '100%' } }} dangerouslySetInnerHTML={{ __html: selectedPage.details.content }} />
//                         </Box>
//                         <Box sx={{ flex: 1 }}>
//                             <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}>Enrolled Students ({selectedPage.enrolledStudents.length})</Typography>
//                             <Stack spacing={2}>
//                                 {selectedPage.enrolledStudents.map((student: any, idx: number) => (
//                                     <Card key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
//                                         <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center', display: 'flex' }}>
//                                             <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}><School /></Avatar>
//                                             <Box>
//                                                 <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>{student.name}</Typography>
//                                                 <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5, display: 'flex' }}>
//                                                     <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
//                                                     <Typography variant="caption">{student.email}</Typography>
//                                                 </Stack>
//                                             </Box>
//                                         </Stack>
//                                     </Card>
//                                 ))}
//                             </Stack>
//                         </Box>
//                     </Box>
//                 </Box>
//             )}

//             <Dialog open={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); }} fullWidth maxWidth="md">
//                 <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Item' : 'Create New Item'}</DialogTitle>
//                 <DialogContent dividers>
//                     <Stack spacing={2} sx={{ mt: 1 }}>
//                         <TextField label="Title" fullWidth value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
//                         {!editingId && (
//                              <TextField select label="Type" value={form.itemType} onChange={e => setForm({ ...form, itemType: e.target.value as any })}>
//                                 <MenuItem value="folder">Folder</MenuItem>
//                                 <MenuItem value="page">Page</MenuItem>
//                             </TextField>
//                         )}
//                         {form.itemType === 'page' && (
//                             <Box>
//                                 <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>Lesson Content</Typography>
//                                 <Editor value={form.content} onChange={html => setForm({ ...form, content: html })} />
//                             </Box>
//                         )}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ p: 2 }}>
//                     <Button onClick={() => { setIsModalOpen(false); setEditingId(null); }}>Cancel</Button>
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
    IconButton, Tabs, Tab, Divider, Chip
} from '@mui/material';
import {
    Folder, Description, Add, ChevronRight,
    ArrowBack, Edit, Delete
} from '@mui/icons-material';
import Editor from '../components/TiptapEditor';
import { courseService } from '../services/api';

const Courses = () => {
    const [items, setItems] = useState([]);
    const [parentId, setParentId] = useState('root');
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string, title: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<any>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', itemType: 'folder' as 'folder' | 'page', content: '' });
    const [tabValue, setTabValue] = useState(0);

    const loadData = async (targetId: string) => {
        const res = await courseService.getSubItems(targetId);
        if (res.success) setItems(res.data);
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
        let res = editingId ? await courseService.updateCourse(editingId, payload) : await courseService.createCourse(payload);
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
            {/* --- Main Header --- */}
            <Stack sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                mb: 4
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Course Curriculum</Typography>
                    <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
                        <Link component="button" variant="body2" onClick={() => { setParentId('root'); setBreadcrumbs([]); setSelectedPage(null); }} sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>Root</Link>
                        {breadcrumbs.map(b => (
                            <Typography key={b.id} variant="body2" color="text.secondary">{b.title}</Typography>
                        ))}
                    </Breadcrumbs>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                    disabled={!!selectedPage}
                    sx={{ textTransform: 'none', px: 3 }}
                >
                    New Item
                </Button>
            </Stack>

            {!selectedPage ? (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    {/* <Table>
                        <TableHead sx={{ bgcolor: '#fcfcfc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {parentId !== 'root' && (
                                <TableRow hover onClick={handleBack} sx={{ cursor: 'pointer' }}>
                                    <TableCell colSpan={3}>
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                            <ArrowBack fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Go Back</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                            {items.map((item: any) => (
                                <TableRow key={item._id} hover onClick={() => handleClick(item)} sx={{ cursor: 'pointer' }}>
                                    <TableCell>
                                        <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                            {item.itemType === 'folder' ? <Folder sx={{ color: '#FFB020' }} /> : <Description sx={{ color: '#2196F3' }} />}
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.title}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={item.itemType} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
                                            <IconButton size="small" onClick={(e) => handleEdit(e, item)}><Edit fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={(e) => handleDelete(e, item._id)}><Delete fontSize="small" /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> */}
                    <Table>
                        <TableHead sx={{ bgcolor: '#fcfcfc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Go Back Row */}
                            {parentId !== 'root' && (
                                <TableRow hover onClick={handleBack} sx={{ cursor: 'pointer' }}>
                                    <TableCell colSpan={4}> {/* Increased colSpan to 4 */}
                                        <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                            <ArrowBack fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Go Back</Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Items Rows */}
                            {items.map((item: any) => (
                                <TableRow key={item._id} hover onClick={() => handleClick(item)} sx={{ cursor: 'pointer' }}>
                                    {/* Name Column */}
                                    <TableCell sx={{ width: '30%' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                            {item.itemType === 'folder' ? <Folder sx={{ color: '#FFB020' }} /> : <Description sx={{ color: '#2196F3' }} />}
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.title}</Typography>
                                        </Stack>
                                    </TableCell>

                                    {/* Description Column */}
                                    <TableCell sx={{ maxWidth: 250 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                                // Keep these to handle any weird overflow edge cases
                                                display: 'block',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {item.itemType === 'folder'
                                                ? (item.content?.length > 30
                                                    ? `${item.content.slice(0, 30)}...`
                                                    : item.content || 'No description')
                                                : 'Rich text content...'}
                                        </Typography>
                                    </TableCell>

                                    {/* Type Column */}
                                    <TableCell>
                                        <Chip
                                            label={item.itemType}
                                            size="small"
                                            variant="outlined"
                                            color={item.itemType === 'folder' ? 'warning' : 'primary'}
                                            sx={{ textTransform: 'capitalize', fontSize: 11, height: 20 }}
                                        />
                                    </TableCell>

                                    {/* Actions Column */}
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
                    {/* --- Page View Header --- */}
                    <Box sx={{ p: 3, bgcolor: '#fcfcfc', borderBottom: '1px solid #eee' }}>
                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                <IconButton onClick={() => setSelectedPage(null)}><ArrowBack /></IconButton>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedPage.details.title}</Typography>
                            </Stack>
                            {/* Spaced out Edit/Delete buttons */}
                            <Stack sx={{ flexDirection: 'row', gap: 2 }}>
                                <Button variant="outlined" startIcon={<Edit />} onClick={(e) => handleEdit(e, selectedPage.details)}>Edit Page</Button>
                                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={(e) => { handleDelete(e, selectedPage.details._id); setSelectedPage(null); }}>Delete</Button>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} sx={{ px: 2 }}>
                            <Tab label="Lesson Content" sx={{ fontWeight: 600, textTransform: 'none' }} />
                            <Tab label={`Enrolled Students (${selectedPage.enrolledStudents.length})`} sx={{ fontWeight: 600, textTransform: 'none' }} />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        {tabValue === 0 && (
                            <Box dangerouslySetInnerHTML={{ __html: selectedPage.details.content || '<p>No content available.</p>' }} sx={{ minHeight: 400 }} />
                        )}
                        {tabValue === 1 && (
                            <Box sx={{ maxWidth: 800 }}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>phone</TableCell>
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

            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullWidth
                maxWidth="sm" // Set to sm for a cleaner look as we discussed
                slotProps={{ paper: { sx: { borderRadius: 3, p: 0 } } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editingId ? 'Edit Item' : 'Create New Item'}
                </DialogTitle>
                <Divider />

                <DialogContent>
                    <Stack sx={{ gap: 3, mt: 1, display: 'flex' }}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        {!editingId && (
                            <TextField
                                select
                                label="Type"
                                value={form.itemType}
                                onChange={e => setForm({ ...form, itemType: e.target.value as any })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="folder">Folder</MenuItem>
                                <MenuItem value="page">Page</MenuItem>
                            </TextField>
                        )}

                        {/* DESCRIPTION FOR FOLDER */}
                        {form.itemType === 'folder' && (
                            <TextField
                                label="Folder Description"
                                placeholder="Briefly describe what this module covers..."
                                fullWidth
                                multiline
                                rows={3}
                                value={form.content} // Make sure to add 'description' to your initial state
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        )}

                        {/* EDITOR FOR PAGE */}
                        {form.itemType === 'page' && (
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{ mb: 1, display: 'block', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}
                                >
                                    Lesson Content
                                </Typography>
                                <Editor
                                    value={form.content}
                                    onChange={html => setForm({ ...form, content: html })}
                                />
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