// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   Alert,
//   Breadcrumbs,
//   Link,
//   Chip,
//   Skeleton,
// } from '@mui/material';
// import FolderOpenIcon from '@mui/icons-material/FolderOpen';
// import ArticleIcon from '@mui/icons-material/Article';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import HomeIcon from '@mui/icons-material/Home';

// import { courseService } from '../services/api';
// import CoursePageDetail from './CoursePageDetails';
// import CourseItemCard from './CourseItemCard';

// interface CourseItem {
//   _id: string;
//   title: string;
//   itemType: 'folder' | 'page';
//   parentId: string | null;
//   isActive: boolean;
//   order: number;
//   content: string;
//   thumbnail?: { url: string; publicId: string };
// }

// interface BreadcrumbEntry {
//   id: string;
//   title: string;
// }

// const AllCoursesTab: React.FC = () => {
//   const [items, setItems] = useState<CourseItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([]);
//   const [, setCurrentFolder] = useState<string>('root');
//   const [selectedPage, setSelectedPage] = useState<string | null>(null);
//   const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number | null>>({});

//   const loadItems = useCallback(async (folderId: string) => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await courseService.getSubItems(folderId);
//       const courseItems: CourseItem[] = res.data || [];
//       setItems(courseItems);

//       // Initialise counts to null (skeleton state)
//       const initial: Record<string, null> = {};
//       courseItems.forEach((i) => { initial[i._id] = null; });
//       setEnrolledCounts(initial);

//       // Fetch all enrolled counts in parallel
//       const counts = await Promise.all(
//         courseItems.map((item) =>
//           courseService
//             .getEnrolledStudents(item._id)
//             .then((r) => ({ id: item._id, count: r.success ? r.data.enrolledCount : 0 }))
//             .catch(() => ({ id: item._id, count: 0 }))
//         )
//       );
//       const countMap: Record<string, number> = {};
//       counts.forEach(({ id, count }) => { countMap[id] = count; });
//       setEnrolledCounts(countMap);
//     } catch (err: any) {
//       setError(
//         err?.response?.data?.message ||
//           'Failed to load courses. Please check your connection and try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadItems('root');
//   }, [loadItems]);

//   const handleFolderClick = (item: CourseItem) => {
//     setBreadcrumbs((prev) => [...prev, { id: item._id, title: item.title }]);
//     setCurrentFolder(item._id);
//     setSelectedPage(null);
//     loadItems(item._id);
//   };

//   const handlePageClick = (item: CourseItem) => {
//     setBreadcrumbs((prev) => [...prev, { id: item._id, title: item.title }]);
//     setSelectedPage(item._id);
//   };

//   const handleBreadcrumbClick = (index: number) => {
//     if (index === -1) {
//       setBreadcrumbs([]);
//       setCurrentFolder('root');
//       setSelectedPage(null);
//       loadItems('root');
//     } else {
//       const target = breadcrumbs[index];
//       setBreadcrumbs(breadcrumbs.slice(0, index + 1));
//       setSelectedPage(null);
//       setCurrentFolder(target.id);
//       loadItems(target.id);
//     }
//   };

//   const handleBackFromPage = () => {
//     setBreadcrumbs((prev) => prev.slice(0, -1));
//     setSelectedPage(null);
//   };

//   // ── Page detail view ───────────────────────────────────────────
//   if (selectedPage) {
//     return (
//       <CoursePageDetail
//         pageId={selectedPage}
//         onBack={handleBackFromPage}
//         breadcrumbs={breadcrumbs}
//         onBreadcrumbClick={handleBreadcrumbClick}
//       />
//     );
//   }

//   const folderCount = items.filter((i) => i.itemType === 'folder').length;
//   const pageCount = items.filter((i) => i.itemType === 'page').length;

//   return (
//     <Box sx={{ py: { xs: 1, sm: 2 } }}>

//       {/* ── Breadcrumbs ── */}
//       <Box
//         sx={{
//           mb: { xs: 2, sm: 3 },
//           px: { xs: 1.2, sm: 1.5 },
//           py: 1,
//           bgcolor: '#f7f8fa',
//           borderRadius: 2,
//           border: '1px solid #efefef',
//           overflowX: 'auto',
//           WebkitOverflowScrolling: 'touch',
//           '&::-webkit-scrollbar': { display: 'none' },
//         }}
//       >
//         <Breadcrumbs
//           maxItems={3}
//           itemsAfterCollapse={2}
//           itemsBeforeCollapse={1}
//           separator={
//             <NavigateNextIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#bbb' }} />
//           }
//           sx={{
//             flexWrap: 'nowrap',
//             whiteSpace: 'nowrap',
//             '& .MuiBreadcrumbs-li': { display: 'inline-flex', alignItems: 'center' },
//           }}
//         >
//           <Link
//             component="button"
//             underline="none"
//             onClick={() => handleBreadcrumbClick(-1)}
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: 0.5,
//               color: breadcrumbs.length === 0 ? '#1A237E' : 'text.secondary',
//               fontWeight: breadcrumbs.length === 0 ? 700 : 400,
//               fontSize: { xs: '0.78rem', sm: '0.82rem' },
//               fontFamily: "'DM Sans', sans-serif",
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               p: 0,
//               '&:hover': { color: '#1A237E' },
//             }}
//           >
//             <HomeIcon sx={{ fontSize: { xs: 14, sm: 15 } }} />
//             All Courses
//           </Link>

//           {breadcrumbs.map((crumb, idx) => (
//             <Link
//               key={crumb.id}
//               component="button"
//               underline="none"
//               onClick={() => handleBreadcrumbClick(idx)}
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: 0.5,
//                 color: idx === breadcrumbs.length - 1 ? '#1A237E' : 'text.secondary',
//                 fontWeight: idx === breadcrumbs.length - 1 ? 700 : 400,
//                 fontSize: { xs: '0.78rem', sm: '0.82rem' },
//                 fontFamily: "'DM Sans', sans-serif",
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 p: 0,
//                 maxWidth: { xs: '120px', sm: '220px' },
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 whiteSpace: 'nowrap',
//                 '&:hover': { color: '#1A237E' },
//               }}
//             >
//               {idx < breadcrumbs.length - 1 && (
//                 <FolderOpenIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />
//               )}
//               {crumb.title}
//             </Link>
//           ))}
//         </Breadcrumbs>
//       </Box>

//       {/* ── Stats chips ── */}
//       {!loading && !error && items.length > 0 && (
//         <Box sx={{ display: 'flex', gap: 1, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
//           {folderCount > 0 && (
//             <Chip
//               icon={
//                 <FolderOpenIcon
//                   sx={{ fontSize: '13px !important', color: '#1A237E !important' }}
//                 />
//               }
//               label={`${folderCount} Folder${folderCount !== 1 ? 's' : ''}`}
//               size="small"
//               sx={{ bgcolor: '#E8EAF6', color: '#1A237E', fontWeight: 600, fontSize: '0.7rem' }}
//             />
//           )}
//           {pageCount > 0 && (
//             <Chip
//               icon={
//                 <ArticleIcon
//                   sx={{ fontSize: '13px !important', color: '#2E7D32 !important' }}
//                 />
//               }
//               label={`${pageCount} Page${pageCount !== 1 ? 's' : ''}`}
//               size="small"
//               sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontSize: '0.7rem' }}
//             />
//           )}
//         </Box>
//       )}

//       {/* ── Skeleton loading ── */}
//       {loading && (
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}>
//           {[1, 2, 3].map((i) => (
//             <Skeleton
//               key={i}
//               variant="rectangular"
//               sx={{
//                 width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
//                 height: { xs: 290, sm: 240 },
//                 borderRadius: '14px',
//               }}
//             />
//           ))}
//         </Box>
//       )}

//       {/* ── Error ── */}
//       {error && (
//         <Alert
//           severity="error"
//           sx={{ mb: 2, borderRadius: 2, fontSize: { xs: '0.8rem', sm: '1rem' } }}
//           onClose={() => setError('')}
//         >
//           {error}
//         </Alert>
//       )}

//       {/* ── Empty state ── */}
//       {!loading && !error && items.length === 0 && (
//         <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 10 }, color: 'text.secondary' }}>
//           <FolderOpenIcon sx={{ fontSize: { xs: 36, sm: 44 }, mb: 1.5, opacity: 0.3 }} />
//           <Typography
//             sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}
//           >
//             This folder is empty
//           </Typography>
//           <Typography variant="caption" sx={{ display: 'block', px: 2 }}>
//             No folders or pages have been added yet.
//           </Typography>
//         </Box>
//       )}

//       {/* ── Card grid ── */}
//       {!loading && !error && items.length > 0 && (
//         <Box
//           sx={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: { xs: 2, sm: 3 },
//             justifyContent: 'flex-start',
//           }}
//         >
//           {items.map((item) => (
//             <CourseItemCard
//               key={item._id}
//               item={item}
//               enrolledCount={enrolledCounts[item._id] ?? null}
//               onClick={() =>
//                 item.itemType === 'folder'
//                   ? handleFolderClick(item)
//                   : handlePageClick(item)
//               }
//             />
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AllCoursesTab;

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  Skeleton,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArticleIcon from '@mui/icons-material/Article';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { courseService } from '../services/api';
import CoursePageDetail from './CoursePageDetails';
import CourseItemCard from './CourseItemCard';

interface CourseItem {
  _id: string;
  title: string;
  itemType: 'folder' | 'page';
  parentId: string | null;
  isActive: boolean;
  order: number;
  content: string;
  thumbnail?: { url: string; publicId: string };
}

interface BreadcrumbEntry {
  id: string;
  title: string;
}

// Shape of the navigation state passed from EnrolledCoursesTab
interface LocationState {
  openPageId?: string | null;
  openFolderId?: string | null;
  openTitle?: string;
}

const AllCoursesTab: React.FC = () => {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([]);
  const [, setCurrentFolder] = useState<string>('root');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number | null>>({});

  const location = useLocation();

  const loadItems = useCallback(async (folderId: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getSubItems(folderId);
      const courseItems: CourseItem[] = res.data || [];
      setItems(courseItems);

      // Initialise counts to null (skeleton state)
      const initial: Record<string, null> = {};
      courseItems.forEach((i) => { initial[i._id] = null; });
      setEnrolledCounts(initial);

      // Fetch all enrolled counts in parallel
      const counts = await Promise.all(
        courseItems.map((item) =>
          courseService
            .getEnrolledStudents(item._id)
            .then((r) => ({ id: item._id, count: r.success ? r.data.enrolledCount : 0 }))
            .catch(() => ({ id: item._id, count: 0 }))
        )
      );
      const countMap: Record<string, number> = {};
      counts.forEach(({ id, count }) => { countMap[id] = count; });
      setEnrolledCounts(countMap);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to load courses. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initial load ──────────────────────────────────────────────
  useEffect(() => {
    loadItems('root');
  }, [loadItems]);

  // ── Deep-link: open item from EnrolledCoursesTab navigation ──
  useEffect(() => {
    const state = location.state as LocationState | null;
    if (!state) return;

    if (state.openPageId) {
      // Jump straight into the page detail view
      setBreadcrumbs(
        state.openTitle ? [{ id: state.openPageId, title: state.openTitle }] : []
      );
      setCurrentFolder('root');
      setSelectedPage(state.openPageId);
    } else if (state.openFolderId) {
      // Navigate into the folder
      setBreadcrumbs(
        state.openTitle ? [{ id: state.openFolderId, title: state.openTitle }] : []
      );
      setCurrentFolder(state.openFolderId);
      setSelectedPage(null);
      loadItems(state.openFolderId);
    }
  }, [location.state, loadItems]);

  const handleFolderClick = (item: CourseItem) => {
    setBreadcrumbs((prev) => [...prev, { id: item._id, title: item.title }]);
    setCurrentFolder(item._id);
    setSelectedPage(null);
    loadItems(item._id);
  };

  const handlePageClick = (item: CourseItem) => {
    setBreadcrumbs((prev) => [...prev, { id: item._id, title: item.title }]);
    setSelectedPage(item._id);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setBreadcrumbs([]);
      setCurrentFolder('root');
      setSelectedPage(null);
      loadItems('root');
    } else {
      const target = breadcrumbs[index];
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      setSelectedPage(null);
      setCurrentFolder(target.id);
      loadItems(target.id);
    }
  };

  const handleBackFromPage = () => {
    setBreadcrumbs((prev) => prev.slice(0, -1));
    setSelectedPage(null);
  };

  // ── Page detail view ───────────────────────────────────────────
  if (selectedPage) {
    return (
      <CoursePageDetail
        pageId={selectedPage}
        onBack={handleBackFromPage}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
      />
    );
  }

  const folderCount = items.filter((i) => i.itemType === 'folder').length;
  const pageCount = items.filter((i) => i.itemType === 'page').length;

  return (
    <Box sx={{ py: { xs: 1, sm: 2 } }}>

      {/* ── Breadcrumbs ── */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3 },
          px: { xs: 1.2, sm: 1.5 },
          py: 1,
          bgcolor: '#f7f8fa',
          borderRadius: 2,
          border: '1px solid #efefef',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Breadcrumbs
          maxItems={3}
          itemsAfterCollapse={2}
          itemsBeforeCollapse={1}
          separator={
            <NavigateNextIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#bbb' }} />
          }
          sx={{
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            '& .MuiBreadcrumbs-li': { display: 'inline-flex', alignItems: 'center' },
          }}
        >
          <Link
            component="button"
            underline="none"
            onClick={() => handleBreadcrumbClick(-1)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: breadcrumbs.length === 0 ? '#1A237E' : 'text.secondary',
              fontWeight: breadcrumbs.length === 0 ? 700 : 400,
              fontSize: { xs: '0.78rem', sm: '0.82rem' },
              fontFamily: "'DM Sans', sans-serif",
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: 0,
              '&:hover': { color: '#1A237E' },
            }}
          >
            <HomeIcon sx={{ fontSize: { xs: 14, sm: 15 } }} />
            All Courses
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <Link
              key={crumb.id}
              component="button"
              underline="none"
              onClick={() => handleBreadcrumbClick(idx)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: idx === breadcrumbs.length - 1 ? '#1A237E' : 'text.secondary',
                fontWeight: idx === breadcrumbs.length - 1 ? 700 : 400,
                fontSize: { xs: '0.78rem', sm: '0.82rem' },
                fontFamily: "'DM Sans', sans-serif",
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                p: 0,
                maxWidth: { xs: '120px', sm: '220px' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&:hover': { color: '#1A237E' },
              }}
            >
              {idx < breadcrumbs.length - 1 && (
                <FolderOpenIcon sx={{ fontSize: { xs: 13, sm: 14 } }} />
              )}
              {crumb.title}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>

      {/* ── Stats chips ── */}
      {!loading && !error && items.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
          {folderCount > 0 && (
            <Chip
              icon={
                <FolderOpenIcon
                  sx={{ fontSize: '13px !important', color: '#1A237E !important' }}
                />
              }
              label={`${folderCount} Folder${folderCount !== 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: '#E8EAF6', color: '#1A237E', fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
          {pageCount > 0 && (
            <Chip
              icon={
                <ArticleIcon
                  sx={{ fontSize: '13px !important', color: '#2E7D32 !important' }}
                />
              }
              label={`${pageCount} Page${pageCount !== 1 ? 's' : ''}`}
              size="small"
              sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      )}

      {/* ── Skeleton loading ── */}
      {loading && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                height: { xs: 290, sm: 240 },
                borderRadius: '14px',
              }}
            />
          ))}
        </Box>
      )}

      {/* ── Error ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2, fontSize: { xs: '0.8rem', sm: '1rem' } }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 10 }, color: 'text.secondary' }}>
          <FolderOpenIcon sx={{ fontSize: { xs: 36, sm: 44 }, mb: 1.5, opacity: 0.3 }} />
          <Typography
            sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}
          >
            This folder is empty
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', px: 2 }}>
            No folders or pages have been added yet.
          </Typography>
        </Box>
      )}

      {/* ── Card grid ── */}
      {!loading && !error && items.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 2, sm: 3 },
            justifyContent: 'flex-start',
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CourseItemCard
                key={item._id}
                item={item}
                enrolledCount={enrolledCounts[item._id] ?? null}
                onClick={() =>
                  item.itemType === 'folder'
                    ? handleFolderClick(item)
                    : handlePageClick(item)
                }
              />
            ))}
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
};

export default AllCoursesTab;