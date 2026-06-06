import React from 'react';
import {
    Box, Typography, Stack, IconButton, Tooltip, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Avatar, useMediaQuery, useTheme, Card,
    CardActionArea, CardContent
} from '@mui/material';
import {
    Folder, Description, ArrowBack, Edit, Delete,
    Download, People
} from '@mui/icons-material';
import { parseDriveFile } from '../services/googleApiServices';
import type { CourseItem } from './types';

interface CourseTableProps {
    items: CourseItem[];
    parentId: string;
    enrolledCounts: Record<string, number>;
    onItemClick: (item: CourseItem) => void;
    onBack: () => void;
    onEdit: (e: React.MouseEvent, item: CourseItem) => void;
    onDelete: (e: React.MouseEvent, id: string, content?: string) => void;
    onExport: (e: React.MouseEvent, item: CourseItem) => void;
}

// ── Small helper: item icon or thumbnail ─────────────────────────────────────
const ItemIcon: React.FC<{ item: CourseItem; size?: number }> = ({ item, size = 40 }) => {
    if (item.thumbnail?.url) {
        return (
            <Avatar
                src={item.thumbnail.url}
                alt={item.title}
                variant="rounded"
                sx={{ width: size, height: size, borderRadius: 1.5 }}
            />
        );
    }
    return (
        <Avatar
            variant="rounded"
            sx={{
                width: size,
                height: size,
                borderRadius: 1.5,
                bgcolor: item.itemType === 'folder' ? '#FFF3E0' : '#E3F2FD',
            }}
        >
            {item.itemType === 'folder'
                ? <Folder sx={{ color: '#FFB020', fontSize: size * 0.55 }} />
                : <Description sx={{ color: '#2196F3', fontSize: size * 0.55 }} />
            }
        </Avatar>
    );
};

// ── Mobile card layout ────────────────────────────────────────────────────────
const MobileItemCard: React.FC<{
    item: CourseItem;
    enrolledCount: number | undefined;
    onItemClick: (item: CourseItem) => void;
    onEdit: (e: React.MouseEvent, item: CourseItem) => void;
    onDelete: (e: React.MouseEvent, id: string, content?: string) => void;
    onExport: (e: React.MouseEvent, item: CourseItem) => void;
}> = ({ item, enrolledCount, onItemClick, onEdit, onDelete, onExport }) => {
    const fileLabel = (() => {
        if (item.itemType === 'folder') {
            return item.content?.length ? (item.content.length > 40 ? `${item.content.slice(0, 40)}…` : item.content) : 'No description';
        }
        const p = parseDriveFile(item.content || '');
        return p?.fileName ? `📎 ${p.fileName}` : 'File content';
    })();

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                mb: 1.5,
                '&:hover': { boxShadow: 3, borderColor: 'primary.main' },
                transition: 'all 0.15s',
            }}
        >
            <CardActionArea onClick={() => onItemClick(item)} sx={{ p: 0 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" sx = {{gap:1.5, alignItems:"flex-start"}}>
                        <ItemIcon item={item} size={46} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" sx={{ alignItems: "center",gap:1 ,mb:0.5}}  >
                                <Typography variant="body2" sx={{ fontWeight: 700, flex: 1 }} noWrap>
                                    {item.title}
                                </Typography>
                                <Chip
                                    label={item.itemType}
                                    size="small"
                                    variant="outlined"
                                    color={item.itemType === 'folder' ? 'warning' : 'primary'}
                                    sx={{ textTransform: 'capitalize', fontSize: 10, height: 18, flexShrink: 0 }}
                                />
                            </Stack>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                {fileLabel}
                            </Typography>
                            <Stack direction="row" sx={{ gap: 1, mt: 1, alignItems: "center" }}>
                                <Chip
                                    icon={<People sx={{ fontSize: '12px !important' }} />}
                                    label={enrolledCount ?? '—'}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: 10, height: 18 }}
                                />
                            </Stack>
                        </Box>
                        {/* Action buttons — stop propagation so clicks don't open item */}
                        <Stack direction="column"  sx={{ flexShrink: 0 , gap:0.5}}>
                            <Tooltip title="Export Students">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onExport(e, item); }} sx={{ color: '#0891B2', p: 0.5 }}>
                                    <Download sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(e, item); }} sx={{ p: 0.5 }}>
                                    <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(e, item._id, item.content); }} sx={{ p: 0.5 }}>
                                    <Delete sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

// ── Main CourseTable ──────────────────────────────────────────────────────────
const CourseTable: React.FC<CourseTableProps> = ({
    items, parentId, enrolledCounts,
    onItemClick, onBack, onEdit, onDelete, onExport,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return (
            <Box>
                {parentId !== 'root' && (
                    <Card
                        variant="outlined"
                        sx={{ borderRadius: 2, mb: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                        onClick={onBack}
                    >
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Stack direction="row" sx={{ gap: 1,alignItems:"center" }}>
                                <ArrowBack fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Go Back</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
                {items.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                        <Folder sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                        <Typography variant="body2">No items here yet.</Typography>
                    </Box>
                )}
                {items.map(item => (
                    <MobileItemCard
                        key={item._id}
                        item={item}
                        enrolledCount={enrolledCounts[item._id]}
                        onItemClick={onItemClick}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onExport={onExport}
                    />
                ))}
            </Box>
        );
    }

    // ── Desktop table ─────────────────────────────────────────────────────────
    return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
                <TableHead sx={{ bgcolor: '#fcfcfc' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                            <Tooltip title="Unique enrolled students">
                                <Stack direction="row" sx={{alignItems:"center", gap:0.5}}>
                                    <People fontSize="small" /><span>Enrolled</span>
                                </Stack>
                            </Tooltip>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {parentId !== 'root' && (
                        <TableRow hover onClick={onBack} sx={{ cursor: 'pointer' }}>
                            <TableCell colSpan={5}>
                                <Stack direction="row" sx  = {{gap: 1, alignItems: "center" }}>
                                    <ArrowBack fontSize="small" color="action" />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Go Back</Typography>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    )}
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                                <Folder sx={{ fontSize: 40, opacity: 0.2, display: 'block', mx: 'auto', mb: 1 }} />
                                <Typography variant="body2">No items here yet.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {items.map((item) => {
                        const fileLabel = (() => {
                            if (item.itemType === 'folder') {
                                return item.content?.length
                                    ? (item.content.length > 40 ? `${item.content.slice(0, 40)}…` : item.content)
                                    : 'No description';
                            }
                            const p = parseDriveFile(item.content || '');
                            return p?.fileName ? `📎 ${p.fileName}` : 'File content';
                        })();

                        return (
                            <TableRow
                                key={item._id}
                                hover
                                onClick={() => onItemClick(item)}
                                sx={{ cursor: 'pointer', '& td': { py: 1.5 } }}
                            >
                                <TableCell sx={{ width: '35%' }}>
                                    <Stack direction="row" sx = {{gap:1.5, alignItems:"center"}}>
                                        <ItemIcon item={item} size={44} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 220 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            display: 'block',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {fileLabel}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.itemType}
                                        size="small"
                                        variant="outlined"
                                        color={item.itemType === 'folder' ? 'warning' : 'primary'}
                                        sx={{ textTransform: 'capitalize', fontSize: 11, height: 22 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        icon={<People sx={{ fontSize: '14px !important' }} />}
                                        label={enrolledCounts[item._id] ?? '—'}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: 11, height: 22 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 0.5 }}>
                                        <Tooltip title="Export Enrolled Students">
                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onExport(e, item); }} sx={{ color: '#0891B2' }}>
                                                <Download fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(e, item); }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(e, item._id, item.content); }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CourseTable;