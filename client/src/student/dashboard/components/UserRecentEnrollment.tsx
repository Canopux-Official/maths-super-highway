import React from 'react';
import {
  Card, CardContent, Typography, Box,
  Divider, Chip
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import type { UserStats } from '../services/api';


interface UserRecentEnrollmentsProps {
  recent: UserStats['enrollments']['recent'];
}

const UserRecentEnrollments: React.FC<UserRecentEnrollmentsProps> = ({ recent }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Recently Enrolled
        </Typography>

        {recent.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No enrollments yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recent.map((entry, index) => (
              <Box key={entry.course._id}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
                  <FolderOpenIcon sx={{ color: '#1A237E', fontSize: 18, mt: 0.2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {entry.course.title}
                    </Typography>
                    {entry.course.content && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {entry.course.content.replace(/<[^>]*>?/gm, "")}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.disabled">
                        Enrolled {new Date(entry.enrolledAt).toLocaleDateString('en-IN')}
                      </Typography>
                      {!entry.course.isActive && (
                        <Chip label="Inactive" size="small" color="warning" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </Box>
                {index < recent.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRecentEnrollments;
