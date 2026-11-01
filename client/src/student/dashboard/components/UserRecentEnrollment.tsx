// import React from 'react';
// import {
//   Card, CardContent, Typography, Box,
//   Divider, Chip
// } from '@mui/material';
// import FolderOpenIcon from '@mui/icons-material/FolderOpen';
// import type { UserStats } from '../services/api';


// interface UserRecentEnrollmentsProps {
//   recent: UserStats['enrollments']['recent'];
// }

// const UserRecentEnrollments: React.FC<UserRecentEnrollmentsProps> = ({ recent }) => {
//   return (
//     <Card variant="outlined" sx={{ borderRadius: 2 }}>
//       <CardContent>
//         <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
//           Recently Enrolled
//         </Typography>

//         {recent.length === 0 ? (
//           <Typography variant="body2" color="text.secondary">
//             No enrollments yet.
//           </Typography>
//         ) : (
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
//             {recent.map((entry, index) => (
//               <Box key={entry.course._id}>
//                 <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
//                   <FolderOpenIcon sx={{ color: '#1A237E', fontSize: 18, mt: 0.2 }} />
//                   <Box sx={{ flex: 1 }}>
//                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                       {entry.course.title}
//                     </Typography>
//                     {entry.course.content && (
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         sx={{
//                           display: '-webkit-box',
//                           WebkitLineClamp: 1,
//                           WebkitBoxOrient: 'vertical',
//                           overflow: 'hidden',
//                         }}
//                       >
//                         {entry.course.content.replace(/<[^>]*>?/gm, "")}
//                       </Typography>
//                     )}
//                     <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
//                       <Typography variant="caption" color="text.disabled">
//                         Enrolled {new Date(entry.enrolledAt).toLocaleDateString('en-IN')}
//                       </Typography>
//                       {!entry.course.isActive && (
//                         <Chip label="Inactive" size="small" color="warning" variant="outlined" />
//                       )}
//                     </Box>
//                   </Box>
//                 </Box>
//                 {index < recent.length - 1 && <Divider />}
//               </Box>
//             ))}
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default UserRecentEnrollments;

import React from 'react';
import {
  Card, CardContent, Typography, Box,
  Divider, Chip, Stack
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { UserStats } from '../services/api';

interface UserRecentEnrollmentsProps {
  recent: UserStats['enrollments']['recent'];
}

// ─── Format date as "6 Jun 2026, 12:25 PM" ───────────────────────────────────
const formatEnrolledAt = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const UserRecentEnrollments: React.FC<UserRecentEnrollmentsProps> = ({ recent }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Recently Enrolled
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Course Hierarchy & Topics
          </Typography>
        </Box>

        {recent.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No enrollments yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recent.map((entry, index) => {
              const breadcrumbs: string[] = entry.course?.breadcrumb || [];

              return (
                <Box key={entry.course?._id || index}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.75 }}>

                    {/* Icon */}
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        bgcolor: '#E8EAF6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      <AccountTreeOutlinedIcon sx={{ fontSize: 18, color: '#1A237E' }} />
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Tree Breadcrumb Path */}
                      {breadcrumbs.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                          {breadcrumbs.map((crumb: string, i: number) => (
                            <React.Fragment key={i}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  color: '#475569',
                                  bgcolor: '#F1F5F9',
                                  px: 0.75,
                                  py: 0.15,
                                  borderRadius: '4px',
                                  border: '1px solid #E2E8F0',
                                }}
                              >
                                {crumb}
                              </Typography>
                              <NavigateNextIcon sx={{ fontSize: 11, color: '#94A3B8' }} />
                            </React.Fragment>
                          ))}
                        </Box>
                      )}

                      {/* Topic Title + Tags */}
                      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0A1628' }}>
                          {entry.course?.title || 'Unknown Course'}
                        </Typography>
                        {entry.course?.tags && entry.course.tags.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {entry.course.tags.map((t: string) => (
                              <Chip
                                key={t}
                                label={t}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.62rem',
                                  fontWeight: 600,
                                  bgcolor: 'rgba(26,35,126,0.08)',
                                  color: '#1A237E',
                                  border: '1px solid rgba(26,35,126,0.15)',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        {!entry.course?.isActive && (
                          <Chip label="Inactive" size="small" color="warning" variant="outlined" sx={{ height: 18, fontSize: '0.62rem' }} />
                        )}
                      </Stack>

                      {/* Enrolled at — with clock icon */}
                      <Stack
                        sx={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 0.6,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          Enrolled on {formatEnrolledAt(entry.enrolledAt)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>

                  {index < recent.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRecentEnrollments;
