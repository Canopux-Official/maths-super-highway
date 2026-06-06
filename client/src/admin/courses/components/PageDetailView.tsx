import React, { useState } from 'react';
import {
    Box, Typography, Stack, Button, Tabs, Tab,
    IconButton, Avatar, TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, Paper, useMediaQuery, useTheme,
    Card, CardContent
} from '@mui/material';
import { ArrowBack, Edit, Delete, Download } from '@mui/icons-material';
import InlineFileViewer from './InlineFileViewer';
import type { PageDetails } from './types';

interface PageDetailViewProps {
    page: PageDetails;
    onBack: () => void;
    onEdit: (e: React.MouseEvent, item: any) => void;
    onDelete: (e: React.MouseEvent, id: string, content?: string) => void;
    onExport: (e: React.MouseEvent, item: any) => void;
}

const PageDetailView: React.FC<PageDetailViewProps> = ({
    page, onBack, onEdit, onDelete, onExport,
}) => {
    const [tabValue, setTabValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ border: '1px solid #eee', borderRadius: 3, overflow: 'hidden', bgcolor: 'white' }}>
            {/* Header */}
            <Box
                sx={{
                    p: { xs: 2, sm: 3 },
                    bgcolor: '#fcfcfc',
                    borderBottom: '1px solid #eee',
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: {
                            xs: 'flex-start',
                            sm: 'center',
                        },
                        gap: 2,
                    }}
                >
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', minWidth: 0 }}>
                        <IconButton onClick={onBack} size={isMobile ? 'small' : 'medium'}>
                            <ArrowBack />
                        </IconButton>
                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            sx={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {page.details.title}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"

                        sx={{
                            flexShrink: 0, gap: 1,
                            flexWrap: "wrap"
                        }}
                    >
                        <Button
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            startIcon={<Download />}
                            onClick={(e) => onExport(e, page.details)}
                            sx={{ color: '#0891B2', borderColor: '#0891B2', textTransform: 'none' }}
                        >
                            {isMobile ? 'Export' : 'Export Students'}
                        </Button>
                        <Button
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            startIcon={<Edit />}
                            onClick={(e) => onEdit(e, page.details)}
                            sx={{ textTransform: 'none' }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            size={isMobile ? 'small' : 'medium'}
                            color="error"
                            startIcon={<Delete />}
                            onClick={(e) => { onDelete(e, page.details._id, page.details.content); onBack(); }}
                            sx={{ textTransform: 'none' }}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, val) => setTabValue(val)}
                    sx={{ px: { xs: 1, sm: 2 } }}
                    variant={isMobile ? 'fullWidth' : 'standard'}
                >
                    <Tab label="Lesson Content" sx={{ fontWeight: 600, textTransform: 'none' }} />
                    <Tab
                        label={`Enrolled (${page.enrolledStudents.length})`}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                    />
                </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
                {tabValue === 0 && (
                    <InlineFileViewer content={page.details.content || ''} />
                )}

                {tabValue === 1 && (
                    <Box sx={{ maxWidth: 800 }}>
                        {isMobile ? (
                            // Mobile: cards instead of table
                            <Stack sx={{ gap: 1.5 }}>
                                {page.enrolledStudents.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }} >
                                        No students enrolled yet.
                                    </Typography>
                                )}
                                {page.enrolledStudents.map((student, idx) => (
                                    <Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                                                <Avatar sx={{ width: 36, height: 36, fontSize: '0.85rem', bgcolor: 'primary.main' }}>
                                                    {student.name?.[0]?.toUpperCase() ?? '?'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{student.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                                                    {student.phone && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            {student.phone}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        ) : (
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
                                        {page.enrolledStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                                    No students enrolled yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {page.enrolledStudents.map((student, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                                                        <Avatar sx={{ width: 30, height: 30, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                                                            {student.name?.[0]?.toUpperCase() ?? '?'}
                                                        </Avatar>
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
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default PageDetailView;