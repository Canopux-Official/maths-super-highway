// import React from 'react';
// import {
//   BarChart, Bar, LineChart, Line, AreaChart, Area,
//   PieChart, Pie, Cell, ScatterChart, Scatter,
//   RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import { Paper, Typography, Box } from '@mui/material';

// interface DynamicRechartProps {
//   type: string;
//   title: string;
//   data: any[];
//   keys: string[];
//   labelKey: string;
//   colors: string[];
//   width: number;
//   height: number;
// }

// const DynamicRechart: React.FC<DynamicRechartProps> = ({
//   type,
//   title,
//   data,
//   keys,
//   labelKey,
//   colors,
//   height
// }) => {
//   // Default fallback color palette if colors array arrives empty
//   const defaultColors = ['#1D4ED8', '#7C3AED', '#0D9488', '#DC2626', '#EA580C', '#CA8A04'];
//   const palette = colors.length > 0 ? colors : defaultColors;

//   // Helper function to render the correct chart type based on the 'type' prop
//   const renderChart = () => {
//     switch (type?.toLowerCase()) {
//       case 'pie':
//         return (
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey={keys[0]}
//               nameKey={labelKey}
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               label
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         );

//       case 'donut':
//         return (
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey={keys[0]}
//               nameKey={labelKey}
//               cx="50%"
//               cy="50%"
//               innerRadius={60} // Creates the hollow donut inner circle
//               outerRadius={80}
//               label
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         );

//       case 'line':
//         return (
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//             <XAxis dataKey={labelKey} stroke="#64748b" />
//             <YAxis stroke="#64748b" />
//             <Tooltip />
//             <Legend />
//             {keys.map((key, index) => (
//               <Line
//                 key={key}
//                 type="monotone"
//                 dataKey={key}
//                 stroke={palette[index % palette.length]}
//                 strokeWidth={2}
//                 activeDot={{ r: 8 }}
//               />
//             ))}
//           </LineChart>
//         );

//       case 'area':
//         return (
//           <AreaChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//             <XAxis dataKey={labelKey} stroke="#64748b" />
//             <YAxis stroke="#64748b" />
//             <Tooltip />
//             <Legend />
//             {keys.map((key, index) => (
//               <Area
//                 key={key}
//                 type="monotone"
//                 dataKey={key}
//                 stroke={palette[index % palette.length]}
//                 fill={palette[index % palette.length]}
//                 fillOpacity={0.2}
//               />
//             ))}
//           </AreaChart>
//         );

//       case 'radar':
//         return (
//           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
//             <PolarGrid stroke="#e2e8f0" />
//             <PolarAngleAxis dataKey={labelKey} stroke="#64748b" />
//             <PolarRadiusAxis stroke="#64748b" />
//             {keys.map((key, index) => (
//               <Radar
//                 key={key}
//                 name={key}
//                 dataKey={key}
//                 stroke={palette[index % palette.length]}
//                 fill={palette[index % palette.length]}
//                 fillOpacity={0.3}
//               />
//             ))}
//             <Tooltip />
//             <Legend />
//           </RadarChart>
//         );

//       case 'scatter':
//         return (
//           <ScatterChart>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//             {/* For scatter charts, XAxis usually needs a numerical value from data */}
//             <XAxis type="category" dataKey={labelKey} stroke="#64748b" />
//             <YAxis type="number" stroke="#64748b" />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//             <Legend />
//             {keys.map((key, index) => (
//               <Scatter
//                 key={key}
//                 name={key}
//                 data={data}
//                 fill={palette[index % palette.length]}
//               />
//             ))}
//           </ScatterChart>
//         );

//       case 'bar':
//       default:
//         return (
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//             <XAxis dataKey={labelKey} stroke="#64748b" />
//             <YAxis stroke="#64748b" />
//             <Tooltip />
//             <Legend />
//             {keys.map((key, index) => (
//               <Bar
//                 key={key}
//                 dataKey={key}
//                 fill={palette[index % palette.length]}
//                 radius={[4, 4, 0, 0]}
//               />
//             ))}
//           </BarChart>
//         );
//     }
//   };

//   return (
//     <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2, my: 3, bgcolor: '#fafbfd' }}>
//       <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
//         {title}
//       </Typography>

//       <Box sx={{ width: '100%', height: height }}>
//         <ResponsiveContainer width="100%" height="100%">
//           {renderChart()}
//         </ResponsiveContainer>
//       </Box>
//     </Paper>
//   );
// };

// export default DynamicRechart;

import React from 'react';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    PieChart, Pie, Cell, ScatterChart, Scatter,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

interface DynamicRechartProps {
    type:     string;
    title:    string;
    data:     any[];
    keys:     string[];
    labelKey: string;
    colors:   string[];
    width:    number;
    height:   number;
}

const DEFAULT_COLORS = [
    '#1D4ED8', '#7C3AED', '#0D9488', '#DC2626', '#EA580C',
    '#CA8A04', '#059669', '#DB2777', '#0891B2', '#65A30D',
];

// ─── Histogram helper (mirrors ChartExtension.tsx) ──────────────────────────
const buildHistogram = (rawValues: number[], bins = 8) => {
    if (!rawValues.length) return [];
    const min = Math.min(...rawValues);
    const max = Math.max(...rawValues);
    const binSize = (max - min) / bins || 1;
    return Array.from({ length: bins }, (_, i) => ({
        label: `${(min + i * binSize).toFixed(1)}–${(min + (i + 1) * binSize).toFixed(1)}`,
        count: 0,
    })).map((bucket, i) => {
        rawValues.forEach(v => {
            if (Math.min(Math.floor((v - min) / binSize), bins - 1) === i) {
                bucket.count++;
            }
        });
        return bucket;
    });
};

const DynamicRechart: React.FC<DynamicRechartProps> = ({
    type, title, data, keys, labelKey, colors, height,
}) => {
    const palette = colors?.length > 0 ? colors : DEFAULT_COLORS;
    const h       = height || 300;
    const t       = type?.toLowerCase();

    const renderChart = () => {

        // ── Histogram ─────────────────────────────────────────────────────
        if (t === 'histogram') {
            const raw      = data.map(r => Number(r[keys[0] || 'value'])).filter(n => !isNaN(n));
            const histData = buildHistogram(raw);
            return (
                <BarChart data={histData} barCategoryGap="2%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={palette[0]} radius={[3, 3, 0, 0]} />
                </BarChart>
            );
        }

        // ── Bar (vertical) ────────────────────────────────────────────────
        if (t === 'bar') {
            return (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Bar key={k} dataKey={k}
                            fill={palette[i % palette.length]}
                            radius={[3, 3, 0, 0]}
                        />
                    ))}
                </BarChart>
            );
        }

        // ── Horizontal bar ────────────────────────────────────────────────
        if (t === 'horizontalbar') {
            return (
                <BarChart layout="vertical" data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey={labelKey} type="category" width={60} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Bar key={k} dataKey={k}
                            fill={palette[i % palette.length]}
                            radius={[0, 3, 3, 0]}
                        />
                    ))}
                </BarChart>
            );
        }

        // ── Stacked bar ───────────────────────────────────────────────────
        if (t === 'stacked') {
            return (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Bar key={k} dataKey={k}
                            fill={palette[i % palette.length]}
                            stackId="stack"
                        />
                    ))}
                </BarChart>
            );
        }

        // ── Line ──────────────────────────────────────────────────────────
        if (t === 'line') {
            return (
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Line key={k} type="monotone" dataKey={k}
                            stroke={palette[i % palette.length]}
                            strokeWidth={2} dot={{ r: 3 }}
                        />
                    ))}
                </LineChart>
            );
        }

        // ── Area ──────────────────────────────────────────────────────────
        if (t === 'area') {
            return (
                <AreaChart data={data}>
                    {/* Gradient defs — mirrors ChartExtension */}
                    <defs>
                        {keys.map((k, i) => (
                            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={palette[i % palette.length]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={palette[i % palette.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Area key={k} type="monotone" dataKey={k}
                            stroke={palette[i % palette.length]}
                            fill={`url(#grad-${k})`}
                            strokeWidth={2}
                        />
                    ))}
                </AreaChart>
            );
        }

        // ── Pie ───────────────────────────────────────────────────────────
        if (t === 'pie') {
            const pieData = data.map(row => ({
                name:  String(row[labelKey]),
                value: Number(row[keys[0]] ?? 0),
            }));
            return (
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name"
                        cx="50%" cy="50%"
                        outerRadius="70%"
                        label={({ name, percent }) =>
                            `${name} ${((percent as number) * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {pieData.map((_, i) => (
                            <Cell key={i} fill={palette[i % palette.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            );
        }

        // ── Donut ─────────────────────────────────────────────────────────
        if (t === 'donut') {
            const pieData = data.map(row => ({
                name:  String(row[labelKey]),
                value: Number(row[keys[0]] ?? 0),
            }));
            return (
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name"
                        cx="50%" cy="50%"
                        innerRadius="45%" outerRadius="70%"
                        paddingAngle={3}
                        label={({ name, percent }) =>
                            `${name} ${((percent as number) * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {pieData.map((_, i) => (
                            <Cell key={i} fill={palette[i % palette.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            );
        }

        // ── Scatter ───────────────────────────────────────────────────────
        // Scatter in recharts needs data shaped as objects with x/y numeric fields.
        // We use keys[0] as the x-axis key and keys[1] as the y-axis key — exactly
        // as ChartExtension does. The labelKey column is ignored for scatter.
        if (t === 'scatter') {
            const xKey = keys[0] || 'value';
            const yKey = keys[1] || 'value2';
            return (
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey={xKey} name={xKey} type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey={yKey} name={yKey} type="number" tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {/* Pass the whole dataset as a single Scatter series */}
                    <Scatter data={data} fill={palette[0]} />
                </ScatterChart>
            );
        }

        // ── Radar ─────────────────────────────────────────────────────────
        if (t === 'radar') {
            return (
                <RadarChart data={data}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    {keys.length > 1 && <Legend />}
                    {keys.map((k, i) => (
                        <Radar key={k} dataKey={k} name={k}
                            stroke={palette[i % palette.length]}
                            fill={palette[i % palette.length]}
                            fillOpacity={0.25}
                        />
                    ))}
                </RadarChart>
            );
        }

        // ── Fallback (should never reach here with a valid type) ───────────
        return (
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey={labelKey} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {keys.map((k, i) => (
                    <Bar key={k} dataKey={k}
                        fill={palette[i % palette.length]}
                        radius={[4, 4, 0, 0]}
                    />
                ))}
            </BarChart>
        );
    };

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: 2, my: 3, bgcolor: '#FAFBFD' }}>
            {title && (
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0F172A' }}>
                    {title}
                </Typography>
            )}
            <Box sx={{ width: '100%', height: h }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default DynamicRechart;