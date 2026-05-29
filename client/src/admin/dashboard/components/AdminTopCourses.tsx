import React from 'react';
import {
  Card, CardContent, Typography,
  Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import type { AdminStats } from '../services/api';

interface AdminTopCoursesProps {
  topCourses: AdminStats['enrollments']['topCourses'];
}

const AdminTopCourses: React.FC<AdminTopCoursesProps> = ({ topCourses }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Top Enrolled Courses
        </Typography>

        {topCourses.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No enrollment data yet.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Enrolled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topCourses.map((course, index) => (
                <TableRow key={course.courseId} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {course.enrolledCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTopCourses;