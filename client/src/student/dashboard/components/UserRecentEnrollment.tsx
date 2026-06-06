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
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { UserStats } from '../services/api';

interface UserRecentEnrollmentsProps {
  recent: UserStats['enrollments']['recent'];
}

// ─── Detect if content is a Google Drive / PDF JSON blob ─────────────────────
const isDriveContent = (content: string): boolean => {
  if (!content) return false;
  try {
    const parsed = JSON.parse(content);
    return !!(parsed.fileId || parsed.webViewLink || parsed.previewLink);
  } catch {
    return false;
  }
};

// ─── Strip HTML tags and return plain text ────────────────────────────────────
const stripHtml = (html: string): string =>
  html.replace(/<[^>]*>?/gm, "").trim();

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
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Recently Enrolled
        </Typography>

        {recent.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No enrollments yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recent.map((entry, index) => {
              const isPdf = isDriveContent(entry.course?.content);
              const isFolder = entry.course?.itemType === "folder";
              const plainText = !isPdf && entry.course?.content
                ? stripHtml(entry.course.content)
                : "";

              return (
                <Box key={entry.course?._id}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>

                    {/* Icon */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: isFolder ? '#E8EAF6' : '#F3E5F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      {isFolder ? (
                        <FolderOpenIcon sx={{ fontSize: 16, color: '#1A237E' }} />
                      ) : isPdf ? (
                        <PictureAsPdfOutlinedIcon sx={{ fontSize: 16, color: '#6A1B9A' }} />
                      ) : (
                        <ArticleOutlinedIcon sx={{ fontSize: 16, color: '#6A1B9A' }} />
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {entry.course?.title}
                        </Typography>
                        {!entry.course?.isActive && (
                          <Chip label="Inactive" size="small" color="warning" variant="outlined" />
                        )}
                      </Stack>

                      {/* Content preview — only for non-PDF, non-empty plain text */}
                      {isPdf ? (
                        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
                          <PictureAsPdfOutlinedIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                            PDF attached — visit the Courses tab to view
                          </Typography>
                        </Stack>
                      ) : plainText ? (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mt: 0.3,
                          }}
                        >
                          {plainText}
                        </Typography>
                      ) : null}

                      {/* Enrolled at — with clock icon */}
                      <Stack
                        sx={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 0.4,
                          mt: 0.6,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {formatEnrolledAt(entry.enrolledAt)}
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
