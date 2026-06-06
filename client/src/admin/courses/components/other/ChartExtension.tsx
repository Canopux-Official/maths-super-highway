// ChartExtension.tsx
// Drop this file into your project and import ChartExtension into your Editor.
//
// npm install recharts @tiptap/core
// (recharts is already a peer dep in most setups)

import React, { useState, useCallback } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    PieChart, Pie, Cell, ScatterChart, Scatter,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
    Box, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Select, MenuItem, FormControl, InputLabel,
    Tab, Tabs, IconButton, Tooltip as MuiTooltip, Typography,
    Chip, Snackbar, Alert,
} from '@mui/material';
import {
    BarChart as BarChartIcon, ShowChart, PieChart as PieChartIcon,
    ScatterPlot, Radar as RadarIcon, StackedBarChart,
    Edit, Delete, Add, Remove,
} from '@mui/icons-material';

// ─── Palette ───────────────────────────────────────────────────────────────
const PALETTE = [
    '#1D4ED8', '#7C3AED', '#0D9488', '#DC2626', '#EA580C',
    '#CA8A04', '#059669', '#DB2777', '#0891B2', '#65A30D',
];

// ─── Types ─────────────────────────────────────────────────────────────────
export type ChartType =
    | 'bar' | 'horizontalBar' | 'stacked' | 'line'
    | 'area' | 'pie' | 'donut' | 'scatter' | 'radar' | 'histogram';

export interface DataRow { [key: string]: string | number }

export interface ChartAttrs {
    chartType: ChartType;
    title: string;
    data: DataRow[];
    keys: string[];
    labelKey: string;
    colors: string[];
    width: number;
    height: number;
}

// ─── Default sample data ────────────────────────────────────────────────────
const DEFAULT_DATA: DataRow[] = [
    { label: 'Jan', value: 40, value2: 24 },
    { label: 'Feb', value: 30, value2: 13 },
    { label: 'Mar', value: 20, value2: 38 },
    { label: 'Apr', value: 27, value2: 39 },
    { label: 'May', value: 18, value2: 48 },
    { label: 'Jun', value: 23, value2: 38 },
];

// ─── Histogram helper ───────────────────────────────────────────────────────
const buildHistogram = (rawValues: number[], bins = 8) => {
    if (!rawValues.length) return [];
    const min = Math.min(...rawValues);
    const max = Math.max(...rawValues);
    const binSize = (max - min) / bins || 1;
    const buckets = Array.from({ length: bins }, (_, i) => ({
        label: `${(min + i * binSize).toFixed(1)}–${(min + (i + 1) * binSize).toFixed(1)}`,
        count: 0,
    }));
    rawValues.forEach(v => {
        const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
        buckets[idx].count++;
    });
    return buckets;
};

// ─── Chart renderer (exported so RichContentRenderer can reuse it) ──────────
export const renderChart = (attrs: ChartAttrs) => {
    const { chartType, data, keys, labelKey, colors, height } = attrs;
    const h = height || 300;

    if (chartType === 'histogram') {
        const raw = data.map(r => Number(r[keys[0] || 'value'])).filter(n => !isNaN(n));
        const histData = buildHistogram(raw);
        return (
            <ResponsiveContainer width="100%" height={h}>
                <BarChart data={histData} barCategoryGap="2%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={colors[0] || PALETTE[0]} radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'bar' || chartType === 'stacked') {
        return (
            <ResponsiveContainer width="100%" height={h}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Bar
                            key={k} dataKey={k}
                            fill={colors[i] || PALETTE[i % PALETTE.length]}
                            stackId={chartType === 'stacked' ? 'stack' : undefined}
                            radius={chartType !== 'stacked' ? [3, 3, 0, 0] : undefined}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'horizontalBar') {
        return (
            <ResponsiveContainer width="100%" height={h}>
                <BarChart layout="vertical" data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey={labelKey} type="category" width={60} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Bar key={k} dataKey={k} fill={colors[i] || PALETTE[i % PALETTE.length]} radius={[0, 3, 3, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'line') {
        return (
            <ResponsiveContainer width="100%" height={h}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Line
                            key={k} type="monotone" dataKey={k}
                            stroke={colors[i] || PALETTE[i % PALETTE.length]}
                            strokeWidth={2} dot={{ r: 3 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'area') {
        return (
            <ResponsiveContainer width="100%" height={h}>
                <AreaChart data={data}>
                    <defs>
                        {keys.map((k, i) => (
                            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors[i] || PALETTE[i % PALETTE.length]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={colors[i] || PALETTE[i % PALETTE.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Area
                            key={k} type="monotone" dataKey={k}
                            stroke={colors[i] || PALETTE[i % PALETTE.length]}
                            fill={`url(#grad-${k})`} strokeWidth={2}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'pie' || chartType === 'donut') {
        const pieData = data.map(row => ({
            name: String(row[labelKey]),
            value: Number(row[keys[0]] || 0),
        }));
        return (
            <ResponsiveContainer width="100%" height={h}>
                <PieChart>
                    <Pie
                        data={pieData} dataKey="value" nameKey="name"
                        cx="50%" cy="50%"
                        innerRadius={chartType === 'donut' ? '45%' : 0}
                        outerRadius="70%"
                        paddingAngle={chartType === 'donut' ? 3 : 0}
                        label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {pieData.map((_, i) => (
                            <Cell key={i} fill={colors[i] || PALETTE[i % PALETTE.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'scatter') {
        return (
            <ResponsiveContainer width="100%" height={h}>
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={keys[0] || 'value'} name={keys[0]} tick={{ fontSize: 11 }} />
                    <YAxis dataKey={keys[1] || 'value2'} name={keys[1]} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={data} fill={colors[0] || PALETTE[0]} />
                </ScatterChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === 'radar') {
        return (
            <ResponsiveContainer width="100%" height={h}>
                <RadarChart data={data}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Radar
                            key={k} dataKey={k} name={k}
                            stroke={colors[i] || PALETTE[i % PALETTE.length]}
                            fill={colors[i] || PALETTE[i % PALETTE.length]}
                            fillOpacity={0.25}
                        />
                    ))}
                </RadarChart>
            </ResponsiveContainer>
        );
    }

    return <Typography color="error">Unknown chart type</Typography>;
};

// ─── Chart type picker items ────────────────────────────────────────────────
const CHART_TYPES: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'bar', label: 'Bar', icon: <BarChartIcon fontSize="small" /> },
    { type: 'horizontalBar', label: 'H-Bar', icon: <BarChartIcon fontSize="small" sx={{ transform: 'rotate(90deg)' }} /> },
    { type: 'stacked', label: 'Stacked', icon: <StackedBarChart fontSize="small" /> },
    { type: 'histogram', label: 'Histogram', icon: <BarChartIcon fontSize="small" /> },
    { type: 'line', label: 'Line', icon: <ShowChart fontSize="small" /> },
    { type: 'area', label: 'Area', icon: <ShowChart fontSize="small" /> },
    { type: 'pie', label: 'Pie', icon: <PieChartIcon fontSize="small" /> },
    { type: 'donut', label: 'Donut', icon: <PieChartIcon fontSize="small" /> },
    { type: 'scatter', label: 'Scatter', icon: <ScatterPlot fontSize="small" /> },
    { type: 'radar', label: 'Radar', icon: <RadarIcon fontSize="small" /> },
];

// ─── Dialog for creating / editing a chart ──────────────────────────────────
interface ChartDialogProps {
    open: boolean;
    initial?: Partial<ChartAttrs>;
    onClose: () => void;
    onSave: (attrs: ChartAttrs) => void;
}

const ChartDialog: React.FC<ChartDialogProps> = ({ open, initial, onClose, onSave }) => {
    const [chartType, setChartType] = useState<ChartType>(initial?.chartType ?? 'bar');
    const [title, setTitle] = useState(initial?.title ?? 'My Chart');
    const [height, setHeight] = useState(initial?.height ?? 300);
    const [labelKey, setLabelKey] = useState(initial?.labelKey ?? 'label');
    const [keys, setKeys] = useState<string[]>(initial?.keys ?? ['value']);
    const [colors, setColors] = useState<string[]>(initial?.colors ?? [...PALETTE]);
    const [data, setData] = useState<DataRow[]>(initial?.data ?? DEFAULT_DATA);
    const [tab, setTab] = useState(0);
    const [rawCsv, setRawCsv] = useState('');

    const parseCsv = () => {
        const lines = rawCsv.trim().split('\n').filter(Boolean);
        if (lines.length < 2) return;
        const headers = lines[0].split(',').map(h => h.trim());
        const rows: DataRow[] = lines.slice(1).map(line => {
            const vals = line.split(',');
            const row: DataRow = {};
            headers.forEach((h, i) => {
                const v = vals[i]?.trim() ?? '';
                row[h] = isNaN(Number(v)) ? v : Number(v);
            });
            return row;
        });
        setData(rows);
        setLabelKey(headers[0]);
        setKeys(headers.slice(1));
    };

    const addRow = () => {
        const blank: DataRow = { [labelKey]: `Item${data.length + 1}` };
        keys.forEach(k => { blank[k] = 0; });
        setData([...data, blank]);
    };

    const removeRow = (i: number) => setData(data.filter((_, idx) => idx !== i));

    const updateCell = (rowIdx: number, col: string, val: string) => {
        const updated = [...data];
        updated[rowIdx] = { ...updated[rowIdx], [col]: isNaN(Number(val)) ? val : Number(val) };
        setData(updated);
    };

    const addKey = () => {
        const k = `series${keys.length + 1}`;
        setKeys([...keys, k]);
        setData(data.map(r => ({ ...r, [k]: 0 })));
    };

    const removeKey = (k: string) => {
        setKeys(keys.filter(x => x !== k));
        setData(data.map(r => { const { [k]: _, ...rest } = r; return rest; }));
    };

    const allCols = [labelKey, ...keys];

    const preview: ChartAttrs = { chartType, title, data, keys, labelKey, colors, width: 600, height };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
            slotProps={{ paper: { sx: { borderRadius: '16px', overflow: 'hidden' } } }}>
            <DialogTitle sx={{
                bgcolor: '#0F172A', color: '#F8FAFC',
                fontWeight: 700, fontSize: '1rem', py: 2, px: 3,
            }}>
                {initial ? 'Edit Chart' : 'Insert Chart'}
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: 'flex', minHeight: 520 }}>
                {/* Left panel */}
                <Box sx={{ width: 260, borderRight: '1px solid #E2E8F0', p: 2, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                    <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Chart Type
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {CHART_TYPES.map(ct => (
                                <Chip
                                    key={ct.type}
                                    icon={ct.icon as any}
                                    label={ct.label}
                                    size="small"
                                    onClick={() => setChartType(ct.type)}
                                    sx={{
                                        cursor: 'pointer', fontSize: '0.72rem',
                                        bgcolor: chartType === ct.type ? '#1D4ED8' : '#F1F5F9',
                                        color: chartType === ct.type ? '#fff' : '#475569',
                                        '& .MuiChip-icon': { color: 'inherit' },
                                        '&:hover': { bgcolor: chartType === ct.type ? '#1D4ED8' : '#E2E8F0' },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <TextField label="Chart Title" size="small" value={title}
                        onChange={e => setTitle(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />

                    <TextField label="Height (px)" size="small" type="number" value={height}
                        onChange={e => setHeight(Number(e.target.value))}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }} />

                    <FormControl size="small">
                        <InputLabel>Label / X column</InputLabel>
                        <Select value={labelKey} label="Label / X column" onChange={e => setLabelKey(e.target.value)}
                            sx={{ borderRadius: '8px', fontSize: '0.85rem' }}>
                            {allCols.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Box>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', mb: 0.75, textTransform: 'uppercase' }}>
                            Series / Columns
                        </Typography>
                        {keys.map((k, i) => (
                            <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '3px', bgcolor: colors[i] || PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.8rem', flex: 1, color: '#334155' }}>{k}</Typography>
                                {keys.length > 1 && (
                                    <IconButton size="small" onClick={() => removeKey(k)}>
                                        <Remove sx={{ fontSize: 14 }} />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Button size="small" startIcon={<Add />} onClick={addKey}
                            sx={{ mt: 0.5, fontSize: '0.75rem', textTransform: 'none' }}>
                            Add series
                        </Button>
                    </Box>
                </Box>

                {/* Right panel */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)}
                        sx={{ borderBottom: '1px solid #E2E8F0', px: 2, minHeight: 40 }}
                        slotProps={{ indicator: { sx: { backgroundColor: '#1D4ED8' } } }}>
                        <Tab label="Data Table" sx={{ fontSize: '0.78rem', minHeight: 40, textTransform: 'none' }} />
                        <Tab label="Paste CSV" sx={{ fontSize: '0.78rem', minHeight: 40, textTransform: 'none' }} />
                        <Tab label="Preview" sx={{ fontSize: '0.78rem', minHeight: 40, textTransform: 'none' }} />
                    </Tabs>

                    {tab === 0 && (
                        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem' }}>
                                    <thead>
                                        <tr>
                                            {allCols.map(c => (
                                                <th key={c} style={{ padding: '4px 8px', textAlign: 'left', borderBottom: '2px solid #E2E8F0', color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                    {c}
                                                </th>
                                            ))}
                                            <th style={{ width: 32 }} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row, ri) => (
                                            <tr key={ri}>
                                                {allCols.map(c => (
                                                    <td key={c} style={{ padding: '2px 4px' }}>
                                                        <input
                                                            value={String(row[c] ?? '')}
                                                            onChange={e => updateCell(ri, c, e.target.value)}
                                                            style={{
                                                                border: '1px solid #E2E8F0', borderRadius: 4,
                                                                padding: '3px 6px', fontSize: '0.8rem',
                                                                width: c === labelKey ? 80 : 70, outline: 'none',
                                                            }}
                                                        />
                                                    </td>
                                                ))}
                                                <td>
                                                    <IconButton size="small" onClick={() => removeRow(ri)}>
                                                        <Remove sx={{ fontSize: 13 }} />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                            <Button size="small" startIcon={<Add />} onClick={addRow}
                                sx={{ mt: 1, fontSize: '0.75rem', textTransform: 'none' }}>
                                Add row
                            </Button>
                        </Box>
                    )}

                    {tab === 1 && (
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                                Paste CSV. First row = headers (first column = label).
                            </Typography>
                            <TextField
                                multiline minRows={8} fullWidth
                                value={rawCsv}
                                onChange={e => setRawCsv(e.target.value)}
                                placeholder={"label,value,value2\nJan,40,24\nFeb,30,13"}
                                sx={{ fontFamily: 'monospace', '& textarea': { fontSize: '0.8rem' } }}
                            />
                            <Button variant="outlined" size="small" onClick={parseCsv}
                                sx={{ alignSelf: 'flex-start', textTransform: 'none', borderRadius: '8px' }}>
                                Parse CSV
                            </Button>
                        </Box>
                    )}

                    {tab === 2 && (
                        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {title && (
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                                    {title}
                                </Typography>
                            )}
                            {renderChart(preview)}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 1.5, borderTop: '1px solid #F1F5F9', gap: 1 }}>
                <Button onClick={onClose} sx={{ textTransform: 'none', borderRadius: '8px', color: '#64748B' }}>
                    Cancel
                </Button>
                <Button
                    variant="contained" disableElevation
                    onClick={() => onSave({ chartType, title, data, keys, labelKey, colors, width: 600, height })}
                    sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#1D4ED8' }}
                >
                    {initial ? 'Update Chart' : 'Insert Chart'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── Chart Node View (renders inside the editor) ────────────────────────────
const ChartNodeView: React.FC<any> = ({ node, updateAttributes, deleteNode }) => {
    const [editing, setEditing] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'info' }>({
        open: false, message: '', severity: 'success',
    });
    const attrs = node.attrs as ChartAttrs;

    const showToast = (message: string, severity: 'success' | 'info' = 'success') => {
        setToast({ open: true, message, severity });
    };

    return (
        <NodeViewWrapper>
            <Box
                contentEditable={false}
                sx={{
                    my: 2, p: 2,
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    bgcolor: '#FAFBFD',
                    position: 'relative',
                    '&:hover .chart-actions': { opacity: 1 },
                }}
            >
                <Box className="chart-actions" sx={{
                    position: 'absolute', top: 8, right: 8,
                    display: 'flex', gap: 0.5,
                    opacity: 0, transition: 'opacity 0.15s',
                }}>
                    <MuiTooltip title="Edit chart">
                        <IconButton size="small" onClick={() => setEditing(true)}
                            sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', width: 28, height: 28 }}>
                            <Edit sx={{ fontSize: 14, color: '#475569' }} />
                        </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Delete chart">
                        <IconButton size="small" onClick={deleteNode}
                            sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', width: 28, height: 28 }}>
                            <Delete sx={{ fontSize: 14, color: '#DC2626' }} />
                        </IconButton>
                    </MuiTooltip>
                </Box>

                {attrs.title && (
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', mb: 1 }}>
                        {attrs.title}
                    </Typography>
                )}
                {renderChart(attrs)}

                {editing && (
                    <ChartDialog
                        open
                        initial={attrs}
                        onClose={() => setEditing(false)}
                        onSave={newAttrs => {
                            updateAttributes(newAttrs);
                            setEditing(false);
                            showToast('Chart updated successfully!');
                        }}
                    />
                )}

                <Snackbar
                    open={toast.open}
                    autoHideDuration={2500}
                    onClose={() => setToast(t => ({ ...t, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity={toast.severity}
                        onClose={() => setToast(t => ({ ...t, open: false }))}
                        sx={{ borderRadius: '10px', fontWeight: 600 }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            </Box>
        </NodeViewWrapper>
    );
};

// ─── TipTap Node definition ─────────────────────────────────────────────────
// KEY FIX: renderHTML now serialises all chart data as JSON in data-* attributes.
// This is what gets stored in the DB (as part of the HTML string in `content`).
// RichContentRenderer.tsx parses these attributes to re-hydrate charts on the
// read-only view page without dangerouslySetInnerHTML limitations.
export const ChartExtension = Node.create({
    name: 'chart',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            chartType:  { default: 'bar' },
            title:      { default: '' },
            data:       { default: [] },
            keys:       { default: ['value'] },
            labelKey:   { default: 'label' },
            colors:     { default: [...PALETTE] },
            width:      { default: 600 },
            height:     { default: 300 },
        };
    },

    // ─── parseHTML: read data-* attributes back into Tiptap node attrs ───────
    parseHTML() {
        return [{
            tag: 'div[data-type="chart"]',
            getAttrs: (el) => {
                const dom = el as HTMLElement;
                const safeJSON = (str: string | null, fallback: any) => {
                    if (!str) return fallback;
                    try { return JSON.parse(str); } catch { return fallback; }
                };
                return {
                    chartType: dom.getAttribute('data-chart-type') || 'bar',
                    title:     dom.getAttribute('data-title') || '',
                    data:      safeJSON(dom.getAttribute('data-data'), []),
                    keys:      safeJSON(dom.getAttribute('data-keys'), ['value']),
                    labelKey:  dom.getAttribute('data-label-key') || 'label',
                    colors:    safeJSON(dom.getAttribute('data-colors'), [...PALETTE]),
                    width:     Number(dom.getAttribute('data-width') || 600),
                    height:    Number(dom.getAttribute('data-height') || 300),
                };
            },
        }];
    },

    // ─── renderHTML: serialise all attrs into data-* so they survive DB round-trip
    renderHTML({ HTMLAttributes }) {
        const { chartType, title, data, keys, labelKey, colors, width, height } = HTMLAttributes;
        return [
            'div',
            mergeAttributes({
                'data-type':       'chart',
                'data-chart-type': chartType,
                'data-title':      title ?? '',
                'data-data':       JSON.stringify(data ?? []),
                'data-keys':       JSON.stringify(keys ?? ['value']),
                'data-label-key':  labelKey ?? 'label',
                'data-colors':     JSON.stringify(colors ?? PALETTE),
                'data-width':      String(width ?? 600),
                'data-height':     String(height ?? 300),
                // Human-readable fallback so the stored HTML isn't a blank div
                style: 'display:block;padding:8px;border:1px solid #E2E8F0;border-radius:8px;background:#FAFBFD;',
            }),
            // Inner text so the stored HTML carries a hint (not rendered in editor — atom:true)
            `[Chart: ${title || chartType}]`,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ChartNodeView);
    },
});

// ─── Toolbar button + dialog trigger ───────────────────────────────────────
export const InsertChartButton: React.FC<{ editor: any }> = ({ editor }) => {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(false);

    const insertChart = useCallback((attrs: ChartAttrs) => {
        editor.chain().focus().insertContent({ type: 'chart', attrs }).run();
        setOpen(false);
        setToast(true);
    }, [editor]);

    return (
        <>
            <MuiTooltip title="Insert chart" placement="top" arrow>
                <IconButton
                    size="small"
                    onClick={() => setOpen(true)}
                    sx={{
                        borderRadius: '6px', width: 28, height: 28,
                        color: '#64748B',
                        border: '1px solid transparent',
                        '&:hover': { bgcolor: 'rgba(100,116,139,0.08)', color: '#334155' },
                        transition: 'all 0.12s ease',
                    }}
                >
                    <BarChartIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </MuiTooltip>

            <ChartDialog open={open} onClose={() => setOpen(false)} onSave={insertChart} />

            <Snackbar
                open={toast}
                autoHideDuration={2500}
                onClose={() => setToast(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    onClose={() => setToast(false)}
                    sx={{ borderRadius: '10px', fontWeight: 600 }}
                >
                    ✅ Chart inserted successfully!
                </Alert>
            </Snackbar>
        </>
    );
};