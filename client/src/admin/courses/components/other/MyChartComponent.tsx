import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { Typography, Paper } from '@mui/material';

interface MyChartComponentProps {
    title: string;
}

// Sample mock data to display in the lesson
const mockData = [
    { name: 'Assignment 1', AvgScore: 75, HighScore: 95 },
    { name: 'Quiz 1', AvgScore: 82, HighScore: 100 },
    { name: 'Assignment 2', AvgScore: 68, HighScore: 90 },
    { name: 'Mid Term', AvgScore: 70, HighScore: 98 },
];

const MyChartComponent: React.FC<MyChartComponentProps> = ({ title }) => {
    console.log(title)

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, my: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a202c' }}>
                {title}
            </Typography>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={mockData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                        <YAxis stroke="#718096" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        {/* You can change these colors to match your platform theme */}
                        <Bar dataKey="AvgScore" fill="#3182ce" radius={[4, 4, 0, 0]} name="Average Score" />
                        <Bar dataKey="HighScore" fill="#319795" radius={[4, 4, 0, 0]} name="Highest Score" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
};

export default MyChartComponent;