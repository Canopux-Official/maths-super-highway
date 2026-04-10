// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Breadcrumbs,
//   Link,
//   Chip,
// } from "@mui/material";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ArticleIcon from "@mui/icons-material/Article";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import HomeIcon from "@mui/icons-material/Home";
// import { courseService } from "../services/api";
// import CoursePageDetail from "./CoursePageDetails";
// import CourseItemCard from "./CourseItemCard";

// interface CourseItem {
//   _id: string;
//   title: string;
//   itemType: "folder" | "page";
//   parentId: string | null;
//   isActive: boolean;
//   order: number;
// }

// interface BreadcrumbEntry {
//   id: string;
//   title: string;
// }

// const AllCoursesTab: React.FC = () => {
//   const [items, setItems] = useState<CourseItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([]);
//   const [currentFolder, setCurrentFolder] = useState<string>("root");
//   const [selectedPage, setSelectedPage] = useState<string | null>(null);

//   const loadItems = useCallback(async (folderId: string) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await courseService.getSubItems(folderId);
//       setItems(res.data || []);
//     } catch {
//       setError("Failed to load courses. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadItems("root");
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
//       setCurrentFolder("root");
//       setSelectedPage(null);
//       loadItems("root");
//     } else {
//       const target = breadcrumbs[index];
//       const newCrumbs = breadcrumbs.slice(0, index + 1);
//       setBreadcrumbs(newCrumbs);
//       setSelectedPage(null);
//       setCurrentFolder(target.id);
//       loadItems(target.id);
//     }
//   };

//   const handleBackFromPage = () => {
//     const newCrumbs = breadcrumbs.slice(0, -1);
//     setBreadcrumbs(newCrumbs);
//     setSelectedPage(null);
//   };

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

//   return (
//     <Box>
//       {/* Breadcrumbs */}
//       <Box sx={{ mb: 3 }}>
//         <Breadcrumbs
//           separator={<NavigateNextIcon fontSize="small" />}
//           sx={{ "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" } }}
//         >
//           <Link
//             component="button"
//             underline="hover"
//             onClick={() => handleBreadcrumbClick(-1)}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 0.5,
//               color: breadcrumbs.length === 0 ? "text.primary" : "text.secondary",
//               fontWeight: breadcrumbs.length === 0 ? 600 : 400,
//               fontSize: "0.875rem",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               p: 0,
//             }}
//           >
//             <HomeIcon sx={{ fontSize: 16 }} />
//             All Courses
//           </Link>
//           {breadcrumbs.map((crumb, idx) => (
//             <Link
//               key={crumb.id}
//               component="button"
//               underline="hover"
//               onClick={() => handleBreadcrumbClick(idx)}
//               sx={{
//                 color: idx === breadcrumbs.length - 1 ? "text.primary" : "text.secondary",
//                 fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
//                 fontSize: "0.875rem",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 p: 0,
//               }}
//             >
//               {crumb.title}
//             </Link>
//           ))}
//         </Breadcrumbs>
//       </Box>

//       {/* Stats chips */}
//       {!loading && !error && (
//         <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
//           <Chip
//             icon={<FolderOpenIcon sx={{ fontSize: 14 }} />}
//             label={`${items.filter((i) => i.itemType === "folder").length} Folders`}
//             size="small"
//             sx={{ bgcolor: "action.hover", fontSize: "0.75rem" }}
//           />
//           <Chip
//             icon={<ArticleIcon sx={{ fontSize: 14 }} />}
//             label={`${items.filter((i) => i.itemType === "page").length} Pages`}
//             size="small"
//             sx={{ bgcolor: "action.hover", fontSize: "0.75rem" }}
//           />
//         </Box>
//       )}

//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
//           <CircularProgress size={32} />
//         </Box>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {!loading && !error && items.length === 0 && (
//         <Box
//           sx={{
//             textAlign: "center",
//             py: 8,
//             color: "text.secondary",
//           }}
//         >
//           <FolderOpenIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
//           <Typography variant="body2">No items found in this folder.</Typography>
//         </Box>
//       )}

//       {!loading && !error && items.length > 0 && (
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
//           {items.map((item) => (
//             <Box
//               key={item._id}
//               sx={{
//                 width: {
//                   xs: "100%",
//                   sm: "calc(50% - 8px)",
//                   md: "calc(33.333% - 11px)",
//                 },
//               }}
//             >
//               <CourseItemCard
//                 item={item}
//                 onClick={() =>
//                   item.itemType === "folder"
//                     ? handleFolderClick(item)
//                     : handlePageClick(item)
//                 }
//               />
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AllCoursesTab;

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  Skeleton,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { courseService } from "../services/api";
import CoursePageDetail from "./CoursePageDetails";
import CourseItemCard from "./CourseItemCard";

interface CourseItem {
  _id: string;
  title: string;
  itemType: "folder" | "page";
  parentId: string | null;
  isActive: boolean;
  order: number;
  content: string;
}

interface BreadcrumbEntry {
  id: string;
  title: string;
}

const CARD_WIDTH = {
  xs: "100%",
  sm: "calc(50% - 12px)",
  md: "calc(33.333% - 16px)",
};

const AllCoursesTab: React.FC = () => {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const loadItems = useCallback(async (folderId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await courseService.getSubItems(folderId);
      setItems(res.data || []);
    } catch {
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems("root");
  }, [loadItems]);

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
      setCurrentFolder("root");
      setSelectedPage(null);
      loadItems("root");
    } else {
      const target = breadcrumbs[index];
      const newCrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newCrumbs);
      setSelectedPage(null);
      setCurrentFolder(target.id);
      loadItems(target.id);
    }
  };

  const handleBackFromPage = () => {
    setBreadcrumbs((prev) => prev.slice(0, -1));
    setSelectedPage(null);
  };

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

  const folderCount = items.filter((i) => i.itemType === "folder").length;
  const pageCount = items.filter((i) => i.itemType === "page").length;

  return (
    <Box sx={{ py: 2 }}>

      {/* ── Breadcrumbs ── */}
      <Box
        sx={{
          mb: 3,
          p: 1.5,
          bgcolor: "#f7f8fa",
          borderRadius: 2,
          border: "1px solid #efefef",
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 16, color: "#bbb" }} />}
          sx={{ "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" } }}
        >
          <Link
            component="button"
            underline="none"
            onClick={() => handleBreadcrumbClick(-1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: breadcrumbs.length === 0 ? "#1A237E" : "text.secondary",
              fontWeight: breadcrumbs.length === 0 ? 700 : 400,
              fontSize: "0.82rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              p: 0,
              "&:hover": { color: "#1A237E" },
            }}
          >
            <HomeIcon sx={{ fontSize: 15 }} />
            All Courses
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <Link
              key={crumb.id}
              component="button"
              underline="none"
              onClick={() => handleBreadcrumbClick(idx)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: idx === breadcrumbs.length - 1 ? "#1A237E" : "text.secondary",
                fontWeight: idx === breadcrumbs.length - 1 ? 700 : 400,
                fontSize: "0.82rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                p: 0,
                "&:hover": { color: "#1A237E" },
              }}
            >
              {idx < breadcrumbs.length - 1 && (
                <FolderOpenIcon sx={{ fontSize: 14 }} />
              )}
              {crumb.title}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>

      {/* ── Stats chips (only when loaded) ── */}
      {!loading && !error && items.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {folderCount > 0 && (
            <Chip
              icon={<FolderOpenIcon sx={{ fontSize: "14px !important", color: "#1A237E !important" }} />}
              label={`${folderCount} Folder${folderCount !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                bgcolor: "#E8EAF6",
                color: "#1A237E",
                fontWeight: 600,
                fontSize: "0.72rem",
                border: "none",
              }}
            />
          )}
          {pageCount > 0 && (
            <Chip
              icon={<ArticleIcon sx={{ fontSize: "14px !important", color: "#2E7D32 !important" }} />}
              label={`${pageCount} Page${pageCount !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                fontWeight: 600,
                fontSize: "0.72rem",
                border: "none",
              }}
            />
          )}
        </Box>
      )}

      {/* ── Skeleton loading ── */}
      {loading && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              sx={{ width: CARD_WIDTH, height: 110, borderRadius: 3 }}
            />
          ))}
        </Box>
      )}

      {/* ── Error ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && items.length === 0 && (
        <Box sx={{ textAlign: "center", py: 10, color: "text.secondary" }}>
          <FolderOpenIcon sx={{ fontSize: 44, mb: 1.5, opacity: 0.3 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            This folder is empty
          </Typography>
          <Typography variant="caption">
            No folders or pages have been added yet.
          </Typography>
        </Box>
      )}

      {/* ── Card grid ── */}
      {!loading && !error && items.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
          {items.map((item) => (
            <CourseItemCard
              key={item._id}
              item={item}
              onClick={() =>
                item.itemType === "folder"
                  ? handleFolderClick(item)
                  : handlePageClick(item)
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AllCoursesTab;