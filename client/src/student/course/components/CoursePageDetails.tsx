// import React, { useEffect, useState, useRef } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Breadcrumbs,
//   Link,
//   CircularProgress,
//   Alert,
//   Chip,
//   Tooltip,
// } from "@mui/material";

// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import HomeIcon from "@mui/icons-material/Home";
// import PeopleIcon from "@mui/icons-material/People";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// import { courseService } from "../services/api";
// import { enrollmentService } from "../../enrollment/services/api";
// import TestimonialsScroller from "../../testimonial/components/TestimonialScroller";
// import ConfirmDialog from "../../../components/ConfirmDialog";import { parseDriveFile } from "../../../admin/courses/services/googleApiServices";
// ;

// interface BreadcrumbEntry {
//   id: string;
//   title: string;
// }

// interface Props {
//   pageId: string;
//   onBack: () => void;
//   breadcrumbs: BreadcrumbEntry[];
//   onBreadcrumbClick: (index: number) => void;
// }

// interface PageData {
//   title: string;
//   content: string;
//   stats: {
//     enrolledCount: number;
//   };
//   testimonials: any[];
// }

// /* ─── Read Progress Bar ─── */
// const ReadProgress: React.FC = () => {
//   const [pct, setPct] = useState(0);

//   useEffect(() => {
//     const onScroll = () => {
//       const el = document.documentElement;
//       const scrolled = el.scrollTop;
//       const total = el.scrollHeight - el.clientHeight;
//       setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0);
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         height: 3,
//         zIndex: 9999,
//         width: `${pct}%`,
//         background: "linear-gradient(90deg, #06B6D4, #1D4ED8)",
//         transition: "width 0.1s linear",
//         borderRadius: "0 2px 2px 0",
//       }}
//     />
//   );
// };

// /* ─── Stat Pill ─── */
// const StatPill: React.FC<{
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }> = ({ icon, label, value }) => (
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       gap: 1.25,
//       bgcolor: "rgba(255,255,255,0.07)",
//       border: "1px solid rgba(255,255,255,0.10)",
//       borderRadius: "10px",
//       px: 1.75,
//       py: 1,
//     }}
//   >
//     <Box
//       sx={{
//         width: 30,
//         height: 30,
//         borderRadius: "8px",
//         bgcolor: "rgba(6,182,212,0.18)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {icon}
//     </Box>
//     <Box>
//       <Typography
//         sx={{
//           fontSize: "0.72rem",
//           color: "rgba(255,255,255,0.45)",
//           fontFamily: "'DM Sans', sans-serif",
//           lineHeight: 1,
//         }}
//       >
//         {label}
//       </Typography>
//       <Typography
//         sx={{
//           fontSize: "0.88rem",
//           color: "#fff",
//           fontWeight: 700,
//           fontFamily: "'DM Sans', sans-serif",
//           lineHeight: 1.3,
//         }}
//       >
//         {value}
//       </Typography>
//     </Box>
//   </Box>
// );

// /* ─── Drive File Viewer ─── */
// interface DriveViewerProps {
//   content: string;
//   title: string;
// }

// const DriveFileViewer: React.FC<DriveViewerProps> = ({ content, title }) => {
//   const parsed = parseDriveFile(content);
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   if (!parsed?.previewLink) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           py: 10,
//           gap: 2,
//           color: "#94A3B8",
//         }}
//       >
//         <MenuBookIcon sx={{ fontSize: 48, opacity: 0.3 }} />
//         <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>
//           No file attached to this lesson.
//         </Typography>
//       </Box>
//     );
//   }

//   const isGoogleDoc = parsed.webViewLink?.includes("docs.google.com/document");
//   const isGoogleSlides = parsed.webViewLink?.includes("docs.google.com/presentation");
//   const isGoogleSheets = parsed.webViewLink?.includes("docs.google.com/spreadsheets");

//   let embedUrl = parsed.previewLink || "";

//   if (isGoogleDoc && parsed.fileId) {
//     embedUrl = `https://docs.google.com/document/d/${parsed.fileId}/preview`;
//   } else if (isGoogleSlides && parsed.fileId) {
//     embedUrl = `https://docs.google.com/presentation/d/${parsed.fileId}/embed?start=false&loop=false&delayms=3000`;
//   } else if (isGoogleSheets && parsed.fileId) {
//     embedUrl = `https://docs.google.com/spreadsheets/d/${parsed.fileId}/preview`;
//   }

//   return (
//     <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
//       {/* Toolbar */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           px: { xs: 2, sm: 3 },
//           py: 1.5,
//           borderBottom: "1px solid #F1F5F9",
//           bgcolor: "#FAFBFD",
//           gap: 1,
//           flexWrap: "wrap",
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <MenuBookIcon sx={{ fontSize: 16, color: "#1D4ED8" }} />
//           <Typography
//             sx={{
//               fontWeight: 700,
//               fontSize: "0.85rem",
//               color: "#0F172A",
//               fontFamily: "'DM Sans', sans-serif",
//               letterSpacing: "-0.01em",
//               maxWidth: { xs: 160, sm: 300 },
//               overflow: "hidden",
//               whiteSpace: "nowrap",
//               textOverflow: "ellipsis",
//             }}
//           >
//             {parsed.fileName}
//           </Typography>
//         </Box>

//         <Tooltip title="Open in Google Drive">
//           <Button
//             size="small"
//             variant="outlined"
//             startIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
//             component="a"
//             href={parsed.webViewLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             sx={{
//               textTransform: "none",
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 600,
//               fontSize: "0.78rem",
//               borderColor: "#CBD5E1",
//               color: "#475569",
//               borderRadius: "8px",
//               px: 1.5,
//               py: 0.5,
//               "&:hover": {
//                 borderColor: "#1D4ED8",
//                 color: "#1D4ED8",
//                 bgcolor: "#EFF6FF",
//               },
//             }}
//           >
//             Open in Drive
//           </Button>
//         </Tooltip>
//       </Box>

//       {/* Iframe */}
//       <Box
//         sx={{
//           position: "relative",
//           width: "100%",
//           height: { xs: "calc(100svh - 80px)", sm: "calc(100vh - 100px)" },
//           minHeight: 500,
//           bgcolor: "#F8FAFC",
//         }}
//       >
//         <iframe
//           ref={iframeRef}
//           src={embedUrl}
//           title={parsed.fileName}
//           allow="autoplay"
//           style={{
//             width: "100%",
//             height: "100%",
//             border: "none",
//             display: "block",
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// /* ─── Main Component ─── */
// const CoursePageDetail: React.FC<Props> = ({
//   pageId,
//   onBack,
//   breadcrumbs,
//   onBreadcrumbClick,
// }) => {
//   const [pageData, setPageData] = useState<PageData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [enrollLoading, setEnrollLoading] = useState(false);
//   const [enrollSuccess, setEnrollSuccess] = useState("");
//   const [enrollError, setEnrollError] = useState("");
//   const [enrollConfirmOpen, setEnrollConfirmOpen] = useState(false);
//   const [unenrollConfirmOpen, setUnenrollConfirmOpen] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const [pageRes, enrollRes] = await Promise.all([
//           courseService.getPageDetails(pageId),
//           enrollmentService.checkEnrollment(pageId),
//         ]);

//         setPageData(pageRes.data);
//         setIsEnrolled(enrollRes.enrolled || false);
//       } catch {
//         setError("Failed to load course details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [pageId]);

//   const handleEnroll = async () => {
//     setEnrollLoading(true);
//     setEnrollError("");
//     setEnrollSuccess("");
//     setEnrollConfirmOpen(false);

//     try {
//       await enrollmentService.enrollInCourse(pageId);
//       setIsEnrolled(true);
//       setEnrollSuccess("You're in! Welcome to the course 🎉");

//       if (pageData) {
//         setPageData({
//           ...pageData,
//           stats: { enrolledCount: pageData.stats.enrolledCount + 1 },
//         });
//       }
//     } catch (err: any) {
//       setEnrollError(err?.response?.data?.message || "Enrollment failed. Please try again.");
//     } finally {
//       setEnrollLoading(false);
//     }
//   };

//   const handleUnenroll = async () => {
//     setEnrollLoading(true);
//     setEnrollError("");
//     setEnrollSuccess("");
//     setUnenrollConfirmOpen(false);

//     try {
//       await enrollmentService.unenrollFromCourse(pageId);
//       setIsEnrolled(false);
//       setEnrollSuccess("You have successfully unenrolled from the course.");

//       if (pageData) {
//         setPageData({
//           ...pageData,
//           stats: { enrolledCount: Math.max(0, pageData.stats.enrolledCount - 1) },
//         });
//       }
//     } catch (err: any) {
//       setEnrollError(err?.response?.data?.message || "Unenrollment failed. Please try again.");
//     } finally {
//       setEnrollLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           py: 14,
//           gap: 2,
//         }}
//       >
//         <CircularProgress size={36} thickness={3} sx={{ color: "#1D4ED8" }} />
//         <Typography
//           sx={{
//             color: "#94A3B8",
//             fontSize: "0.85rem",
//             fontFamily: "'DM Sans', sans-serif",
//           }}
//         >
//           Loading lesson…
//         </Typography>
//       </Box>
//     );
//   }

//   if (error || !pageData) {
//     return (
//       <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
//         {error || "Course not found."}
//       </Alert>
//     );
//   }

//   return (
//     <>
//       <ReadProgress />

//       <ConfirmDialog
//         open={enrollConfirmOpen}
//         title="Enroll in Course"
//         message="Are you sure you want to enroll in this course?"
//         onConfirm={handleEnroll}
//         onCancel={() => setEnrollConfirmOpen(false)}
//         confirmColor="primary"
//         confirmText="Enroll"
//       />

//       <ConfirmDialog
//         open={unenrollConfirmOpen}
//         title="Unenroll from Course"
//         message="Are you sure you want to unenroll from this course? You will lose access to its contents."
//         onConfirm={handleUnenroll}
//         onCancel={() => setUnenrollConfirmOpen(false)}
//         confirmColor="error"
//         confirmText="Unenroll"
//       />

//       <Box sx={{ fontFamily: "'DM Sans', sans-serif" }}>
//         {/* Breadcrumbs */}
//         <Box
//           sx={{
//             mb: 3,
//             display: "inline-flex",
//             alignItems: "center",
//             px: 1.5,
//             py: 0.75,
//             bgcolor: "#F8FAFC",
//             borderRadius: "8px",
//             border: "1px solid #E2E8F0",
//           }}
//         >
//           <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 13, color: "#CBD5E1" }} />}>
//             <Link
//               component="button"
//               underline="none"
//               onClick={() => onBreadcrumbClick(-1)}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 0.5,
//                 color: "#64748B",
//                 fontSize: "0.75rem",
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontWeight: 500,
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 "&:hover": { color: "#1D4ED8" },
//               }}
//             >
//               <HomeIcon sx={{ fontSize: 13 }} /> All Courses
//             </Link>

//             {breadcrumbs.slice(0, -1).map((crumb, idx) => (
//               <Link
//                 key={crumb.id}
//                 component="button"
//                 underline="none"
//                 onClick={() => onBreadcrumbClick(idx)}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   color: "#64748B",
//                   fontSize: "0.75rem",
//                   fontFamily: "'DM Sans', sans-serif",
//                   fontWeight: 500,
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   "&:hover": { color: "#1D4ED8" },
//                 }}
//               >
//                 <FolderOpenIcon sx={{ fontSize: 12 }} /> {crumb.title}
//               </Link>
//             ))}

//             <Typography
//               sx={{
//                 color: "#0F172A",
//                 fontSize: "0.75rem",
//                 fontWeight: 700,
//                 fontFamily: "'DM Sans', sans-serif",
//               }}
//             >
//               {pageData.title}
//             </Typography>
//           </Breadcrumbs>
//         </Box>

//         {/* Back Button */}
//         <Box sx={{ mb: 3 }}>
//           <Button
//             startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
//             onClick={onBack}
//             size="small"
//             sx={{
//               textTransform: "none",
//               color: "#475569",
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 600,
//               fontSize: "0.82rem",
//               bgcolor: "transparent",
//               borderRadius: "8px",
//               px: 1.5,
//               py: 0.6,
//               border: "1px solid #E2E8F0",
//               "&:hover": {
//                 bgcolor: "#F1F5F9",
//                 borderColor: "#CBD5E1",
//               },
//             }}
//           >
//             Back to course
//           </Button>
//         </Box>

//         {/* Hero Card */}
//         <Box
//           sx={{
//             background: "linear-gradient(135deg, #0A1628 0%, #0F2952 50%, #1D4ED8 100%)",
//             borderRadius: "20px",
//             p: { xs: 3, sm: 4 },
//             mb: 3,
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           {/* Decorative elements */}
//           <Box
//             sx={{
//               position: "absolute",
//               top: -40,
//               right: -40,
//               width: 160,
//               height: 160,
//               borderRadius: "50%",
//               background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
//               pointerEvents: "none",
//             }}
//           />
//           <Box
//             sx={{
//               position: "absolute",
//               bottom: -30,
//               left: "20%",
//               width: 120,
//               height: 120,
//               borderRadius: "50%",
//               background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)",
//               pointerEvents: "none",
//             }}
//           />

//           <Box sx={{ position: "relative", zIndex: 1 }}>
//             {/* Lesson Tag */}
//             <Box
//               sx={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 0.75,
//                 mb: 2,
//                 bgcolor: "rgba(6,182,212,0.15)",
//                 border: "1px solid rgba(6,182,212,0.3)",
//                 borderRadius: "6px",
//                 px: 1.25,
//                 py: 0.4,
//               }}
//             >
//               <MenuBookIcon sx={{ fontSize: 12, color: "#06B6D4" }} />
//               <Typography
//                 sx={{
//                   fontSize: "0.7rem",
//                   color: "#06B6D4",
//                   fontWeight: 700,
//                   letterSpacing: "0.06em",
//                   textTransform: "uppercase",
//                   fontFamily: "'DM Sans', sans-serif",
//                 }}
//               >
//                 Lesson
//               </Typography>
//             </Box>

//             {/* Title + Enroll Button */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: { xs: "flex-start", sm: "center" },
//                 justifyContent: "space-between",
//                 gap: 2,
//                 flexWrap: "wrap",
//                 mb: 3,
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontFamily: "'DM Sans', sans-serif",
//                   fontWeight: 800,
//                   fontSize: { xs: "1.2rem", sm: "1.55rem" },
//                   color: "#fff",
//                   lineHeight: 1.2,
//                   letterSpacing: "-0.025em",
//                   flex: 1,
//                 }}
//               >
//                 {pageData.title}
//               </Typography>

//               <Box sx={{ flexShrink: 0, display: "flex", gap: 1, alignItems: "center" }}>
//                 {isEnrolled ? (
//                   <>
//                     <Chip
//                       icon={<CheckCircleIcon sx={{ color: "#4ADE80 !important", fontSize: "15px !important" }} />}
//                       label="Enrolled"
//                       sx={{
//                         bgcolor: "rgba(22,163,74,0.15)",
//                         color: "#4ADE80",
//                         fontWeight: 700,
//                         fontFamily: "'DM Sans', sans-serif",
//                         fontSize: "0.8rem",
//                         border: "1px solid rgba(74,222,128,0.3)",
//                         px: 0.5,
//                       }}
//                     />
//                     <Button
//                       variant="outlined"
//                       onClick={() => setUnenrollConfirmOpen(true)}
//                       disabled={enrollLoading}
//                       size="small"
//                       sx={{
//                         color: "#F87171",
//                         borderColor: "rgba(248,113,113,0.3)",
//                         textTransform: "none",
//                         fontWeight: 600,
//                         fontFamily: "'DM Sans', sans-serif",
//                         "&:hover": {
//                           borderColor: "#F87171",
//                           bgcolor: "rgba(248,113,113,0.08)",
//                         },
//                       }}
//                     >
//                       {enrollLoading ? "Wait…" : "Unenroll"}
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     onClick={() => setEnrollConfirmOpen(true)}
//                     disabled={enrollLoading}
//                     disableElevation
//                     sx={{
//                       background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
//                       color: "#fff",
//                       fontWeight: 700,
//                       textTransform: "none",
//                       borderRadius: "11px",
//                       px: 3.5,
//                       py: 1.1,
//                       fontSize: "0.88rem",
//                       fontFamily: "'DM Sans', sans-serif",
//                       letterSpacing: "-0.01em",
//                       "&:hover": {
//                         background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
//                         boxShadow: "0 6px 20px rgba(6,182,212,0.4)",
//                         transform: "translateY(-1px)",
//                       },
//                     }}
//                   >
//                     {enrollLoading ? "Enrolling…" : "Enroll Now →"}
//                   </Button>
//                 )}
//               </Box>
//             </Box>

//             {/* Stats */}
//             <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
//               <StatPill
//                 icon={<PeopleIcon sx={{ fontSize: 14, color: "#06B6D4" }} />}
//                 label="Enrolled"
//                 value={pageData.stats.enrolledCount.toLocaleString()}
//               />
//             </Box>
//           </Box>
//         </Box>

//         {/* Success / Error Alerts */}
//         {(enrollSuccess || enrollError) && (
//           <Box sx={{ mt: 2.5 }}>
//             {enrollSuccess && (
//               <Alert
//                 severity="success"
//                 sx={{
//                   borderRadius: "10px",
//                   bgcolor: "rgba(22,163,74,0.15)",
//                   color: "#4ADE80",
//                   border: "1px solid rgba(74,222,128,0.2)",
//                   "& .MuiAlert-icon": { color: "#4ADE80" },
//                   fontFamily: "'DM Sans', sans-serif",
//                 }}
//               >
//                 {enrollSuccess}
//               </Alert>
//             )}
//             {enrollError && (
//               <Alert severity="error" sx={{ borderRadius: "10px", fontFamily: "'DM Sans', sans-serif" }}>
//                 {enrollError}
//               </Alert>
//             )}
//           </Box>
//         )}

//         {/* Lesson Content */}
//         <Box
//           sx={{
//             bgcolor: "#fff",
//             border: "1px solid #E9EEF5",
//             borderRadius: "18px",
//             overflow: "hidden",
//             mb: 4,
//             boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
//           }}
//         >
//           <Box
//             sx={{
//               px: { xs: 3, sm: 4 },
//               py: 2,
//               borderBottom: "1px solid #F1F5F9",
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//               bgcolor: "#FAFBFD",
//             }}
//           >
//             <Box
//               sx={{
//                 width: 32,
//                 height: 32,
//                 borderRadius: "9px",
//                 bgcolor: "#EFF6FF",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <MenuBookIcon sx={{ fontSize: 16, color: "#1D4ED8" }} />
//             </Box>
//             <Typography
//               sx={{
//                 fontWeight: 700,
//                 fontSize: "0.9rem",
//                 color: "#0F172A",
//                 fontFamily: "'DM Sans', sans-serif",
//                 letterSpacing: "-0.01em",
//               }}
//             >
//               Lesson Content
//             </Typography>
//           </Box>

//           <DriveFileViewer content={pageData.content || ""} title={pageData.title} />
//         </Box>

//         {/* Testimonials */}
//         <Box
//           sx={{
//             bgcolor: "#FAFBFD",
//             border: "1px solid #E9EEF5",
//             borderRadius: "18px",
//             p: { xs: 3, sm: 4 },
//             boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
//             <Typography
//               sx={{
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontWeight: 800,
//                 fontSize: "1.05rem",
//                 color: "#0F172A",
//                 letterSpacing: "-0.02em",
//               }}
//             >
//               What students say
//             </Typography>
//             {pageData.testimonials.length > 0 && (
//               <Chip
//                 label={`${pageData.testimonials.length} review${pageData.testimonials.length !== 1 ? "s" : ""}`}
//                 size="small"
//                 sx={{
//                   bgcolor: "#EFF6FF",
//                   color: "#1D4ED8",
//                   fontWeight: 700,
//                   fontSize: "0.7rem",
//                   fontFamily: "'DM Sans', sans-serif",
//                   border: "1px solid #BFDBFE",
//                 }}
//               />
//             )}
//           </Box>
//           <TestimonialsScroller courseId={pageId} initialTestimonials={pageData.testimonials} />
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default CoursePageDetail;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { courseService } from '../services/api';
import { enrollmentService } from '../../enrollment/services/api';
import ConfirmDialog from '../../../components/ConfirmDialog';

import ReadProgress from './ReadProgress';
import PageHeroCard from './PageHeroCard';
import LessonContentCard from './LessonContentCard';
import PageBreadcrumbs from './PageBreadCrumbs';
import TestimonialsCard from './TestimonialCard';

// ── Types ────────────────────────────────────────────────────────
interface BreadcrumbEntry {
  id: string;
  title: string;
}

interface PageData {
  title: string;
  content: string;
  stats: { enrolledCount: number };
  testimonials: any[];
}

interface Props {
  pageId: string;
  onBack: () => void;
  breadcrumbs: BreadcrumbEntry[];
  onBreadcrumbClick: (index: number) => void;
}

// ── Component ───────────────────────────────────────────────────
const CoursePageDetail: React.FC<Props> = ({
  pageId,
  onBack,
  breadcrumbs,
  onBreadcrumbClick,
}) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Enrollment state
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [enrollConfirmOpen, setEnrollConfirmOpen] = useState(false);
  const [unenrollConfirmOpen, setUnenrollConfirmOpen] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [pageRes, enrollRes] = await Promise.all([
          courseService.getPageDetails(pageId),
          enrollmentService.checkEnrollment(pageId),
        ]);
        setPageData(pageRes.data);
        setIsEnrolled(enrollRes.enrolled || false);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load course details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pageId]);

  // ── Enroll ─────────────────────────────────────────────────────
  const handleEnroll = async () => {
    setEnrollLoading(true);
    setEnrollError('');
    setEnrollSuccess('');
    setEnrollConfirmOpen(false);
    try {
      await enrollmentService.enrollInCourse(pageId);
      setIsEnrolled(true);
      setEnrollSuccess("You're in! Welcome to the course 🎉");
      if (pageData) {
        setPageData({
          ...pageData,
          stats: { enrolledCount: pageData.stats.enrolledCount + 1 },
        });
      }
    } catch (err: any) {
      setEnrollError(
        err?.response?.data?.message || 'Enrollment failed. Please try again.'
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  // ── Unenroll ───────────────────────────────────────────────────
  const handleUnenroll = async () => {
    setEnrollLoading(true);
    setEnrollError('');
    setEnrollSuccess('');
    setUnenrollConfirmOpen(false);
    try {
      await enrollmentService.unenrollFromCourse(pageId);
      setIsEnrolled(false);
      setEnrollSuccess('You have successfully unenrolled from the course.');
      if (pageData) {
        setPageData({
          ...pageData,
          stats: { enrolledCount: Math.max(0, pageData.stats.enrolledCount - 1) },
        });
      }
    } catch (err: any) {
      setEnrollError(
        err?.response?.data?.message || 'Unenrollment failed. Please try again.'
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 10, sm: 14 },
          gap: 2,
        }}
      >
        <CircularProgress size={36} thickness={3} sx={{ color: '#1D4ED8' }} />
        <Typography
          sx={{
            color: '#94A3B8',
            fontSize: '0.85rem',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading lesson…
        </Typography>
      </Box>
    );
  }

  // ── Error state ────────────────────────────────────────────────
  if (error || !pageData) {
    return (
      <Box sx={{ p: { xs: 2, sm: 0 } }}>
        <Alert
          severity="error"
          sx={{ mt: 2, borderRadius: '12px', fontFamily: "'DM Sans', sans-serif" }}
          action={
            <Button
              size="small"
              onClick={() => window.location.reload()}
              sx={{ textTransform: 'none', fontFamily: "'DM Sans', sans-serif" }}
            >
              Retry
            </Button>
          }
        >
          {error || 'Course not found. It may have been removed or you may not have access.'}
        </Alert>
      </Box>
    );
  }

  // ── Main render ────────────────────────────────────────────────
  return (
    <>
      <ReadProgress />

      {/* Enroll confirm */}
      <ConfirmDialog
        open={enrollConfirmOpen}
        title="Enroll in Course"
        message="Are you sure you want to enroll in this course?"
        onConfirm={handleEnroll}
        onCancel={() => setEnrollConfirmOpen(false)}
        confirmColor="primary"
        confirmText="Enroll"
      />

      {/* Unenroll confirm */}
      <ConfirmDialog
        open={unenrollConfirmOpen}
        title="Unenroll from Course"
        message="Are you sure you want to unenroll? You will lose access to this course's content."
        onConfirm={handleUnenroll}
        onCancel={() => setUnenrollConfirmOpen(false)}
        confirmColor="error"
        confirmText="Unenroll"
      />

      <Box sx={{ fontFamily: "'DM Sans', sans-serif", px: { xs: 0, sm: 0 } }}>
        {/* Breadcrumbs */}
        <PageBreadcrumbs
          breadcrumbs={breadcrumbs}
          currentTitle={pageData.title}
          onBreadcrumbClick={onBreadcrumbClick}
        />

        {/* Back button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: '15px !important' }} />}
            onClick={onBack}
            size="small"
            sx={{
              textTransform: 'none',
              color: '#475569',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: { xs: '0.78rem', sm: '0.82rem' },
              bgcolor: 'transparent',
              borderRadius: '8px',
              px: 1.5,
              py: 0.6,
              border: '1px solid #E2E8F0',
              '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' },
            }}
          >
            Back to course
          </Button>
        </Box>

        {/* Hero card */}
        <PageHeroCard
          title={pageData.title}
          enrolledCount={pageData.stats.enrolledCount}
          isEnrolled={isEnrolled}
          enrollLoading={enrollLoading}
          onEnroll={() => setEnrollConfirmOpen(true)}
          onUnenroll={() => setUnenrollConfirmOpen(true)}
        />

        {/* Enroll success / error alerts */}
        {(enrollSuccess || enrollError) && (
          <Box sx={{ mt: 2.5, mb: 1 }}>
            {enrollSuccess && (
              <Alert
                severity="success"
                onClose={() => setEnrollSuccess('')}
                sx={{
                  borderRadius: '10px',
                  bgcolor: 'rgba(22,163,74,0.15)',
                  color: '#166534',
                  border: '1px solid rgba(74,222,128,0.2)',
                  '& .MuiAlert-icon': { color: '#16a34a' },
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {enrollSuccess}
              </Alert>
            )}
            {enrollError && (
              <Alert
                severity="error"
                onClose={() => setEnrollError('')}
                sx={{ borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", mt: 1 }}
              >
                {enrollError}
              </Alert>
            )}
          </Box>
        )}

        {/* Lesson content — PDF or Drive iframe */}
        <LessonContentCard content={pageData.content || ''} />

        {/* Testimonials */}
        <TestimonialsCard pageId={pageId} testimonials={pageData.testimonials} />
      </Box>
    </>
  );
};

export default CoursePageDetail;