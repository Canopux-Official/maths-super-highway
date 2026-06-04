
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
//   Divider,
// } from "@mui/material";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import HomeIcon from "@mui/icons-material/Home";
// import PeopleIcon from "@mui/icons-material/People";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import { courseService } from "../services/api";
// import { enrollmentService } from "../../enrollment/services/api";
// import TestimonialsScroller from "../../testimonial/components/TestimonialScroller";

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
//   stats: { enrolledCount: number };
//   testimonials: any[];
// }

// /* ─── tiny read-progress bar ─── */
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
//     <Box sx={{
//       position: "fixed", top: 0, left: 0, height: 3, zIndex: 9999,
//       width: `${pct}%`,
//       background: "linear-gradient(90deg, #06B6D4, #1D4ED8)",
//       transition: "width 0.1s linear",
//       borderRadius: "0 2px 2px 0",
//     }} />
//   );
// };

// /* ─── stat pill ─── */
// const StatPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
//   <Box sx={{
//     display: "flex", alignItems: "center", gap: 1.25,
//     bgcolor: "rgba(255,255,255,0.07)",
//     border: "1px solid rgba(255,255,255,0.10)",
//     borderRadius: "10px", px: 1.75, py: 1,
//   }}>
//     <Box sx={{
//       width: 30, height: 30, borderRadius: "8px",
//       bgcolor: "rgba(6,182,212,0.18)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//     }}>
//       {icon}
//     </Box>
//     <Box>
//       <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
//         {label}
//       </Typography>
//       <Typography sx={{ fontSize: "0.88rem", color: "#fff", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>
//         {value}
//       </Typography>
//     </Box>
//   </Box>
// );

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
//   const contentRef = useRef<HTMLDivElement>(null);

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
//       setEnrollError(
//         err?.response?.data?.message || "Enrollment failed. Please try again."
//       );
//     } finally {
//       setEnrollLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 14, gap: 2 }}>
//         <CircularProgress size={36} thickness={3} sx={{ color: "#1D4ED8" }} />
//         <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
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

//       <Box sx={{ fontFamily: "'DM Sans', sans-serif" }}>

//         {/* ── Breadcrumb ── */}
//         <Box sx={{
//           mb: 3, display: "inline-flex", alignItems: "center",
//           px: 1.5, py: 0.75,
//           bgcolor: "#F8FAFC", borderRadius: "8px",
//           border: "1px solid #E2E8F0",
//         }}>
//           <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 13, color: "#CBD5E1" }} />}>
//             <Link component="button" underline="none" onClick={() => onBreadcrumbClick(-1)}
//               sx={{
//                 display: "flex", alignItems: "center", gap: 0.5,
//                 color: "#64748B", fontSize: "0.75rem",
//                 fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
//                 background: "none", border: "none", cursor: "pointer",
//                 "&:hover": { color: "#1D4ED8" }, transition: "color 0.15s",
//               }}>
//               <HomeIcon sx={{ fontSize: 13 }} /> All Courses
//             </Link>
//             {breadcrumbs.slice(0, -1).map((crumb, idx) => (
//               <Link key={crumb.id} component="button" underline="none" onClick={() => onBreadcrumbClick(idx)}
//                 sx={{
//                   display: "flex", alignItems: "center", gap: 0.5,
//                   color: "#64748B", fontSize: "0.75rem",
//                   fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
//                   background: "none", border: "none", cursor: "pointer",
//                   "&:hover": { color: "#1D4ED8" }, transition: "color 0.15s",
//                 }}>
//                 <FolderOpenIcon sx={{ fontSize: 12 }} /> {crumb.title}
//               </Link>
//             ))}
//             <Typography sx={{ color: "#0F172A", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
//               {pageData.title}
//             </Typography>
//           </Breadcrumbs>
//         </Box>

//         {/* ── Back Button ── */}
//         <Box sx={{ mb: 3 }}>
//           <Button
//             startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
//             onClick={onBack}
//             size="small"
//             sx={{
//               textTransform: "none", color: "#475569",
//               fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem",
//               bgcolor: "transparent", borderRadius: "8px", px: 1.5, py: 0.6,
//               border: "1px solid #E2E8F0",
//               "&:hover": { bgcolor: "#F1F5F9", borderColor: "#CBD5E1" },
//               transition: "all 0.15s",
//             }}
//           >
//             Back to course
//           </Button>
//         </Box>

//         {/* ── Hero Card ── */}
//         <Box sx={{
//           background: "linear-gradient(135deg, #0A1628 0%, #0F2952 50%, #1D4ED8 100%)",
//           borderRadius: "20px",
//           p: { xs: 3, sm: 4 },
//           mb: 3,
//           position: "relative",
//           overflow: "hidden",
//         }}>
//           {/* Decorative orbs */}
//           <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
//           <Box sx={{ position: "absolute", bottom: -30, left: "20%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
//           <Box sx={{ position: "absolute", top: "40%", right: "15%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

//           {/* Dot-grid texture */}
//           <Box sx={{
//             position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
//             backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
//             backgroundSize: "20px 20px",
//           }} />

//           <Box sx={{ position: "relative", zIndex: 1 }}>
//             {/* Tag */}
//             <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, mb: 2, bgcolor: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "6px", px: 1.25, py: 0.4 }}>
//               <MenuBookIcon sx={{ fontSize: 12, color: "#06B6D4" }} />
//               <Typography sx={{ fontSize: "0.7rem", color: "#06B6D4", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
//                 Lesson
//               </Typography>
//             </Box>

//             {/* Title + Enroll row */}
//             <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 3 }}>
//               <Typography sx={{
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontWeight: 800,
//                 fontSize: { xs: "1.2rem", sm: "1.55rem" },
//                 color: "#fff",
//                 lineHeight: 1.2,
//                 letterSpacing: "-0.025em",
//                 flex: 1,
//               }}>
//                 {pageData.title}
//               </Typography>

//               <Box sx={{ flexShrink: 0 }}>
//                 {isEnrolled ? (
//                   <Chip
//                     icon={<CheckCircleIcon sx={{ color: "#4ADE80 !important", fontSize: "15px !important" }} />}
//                     label="Enrolled"
//                     sx={{
//                       bgcolor: "rgba(22,163,74,0.15)",
//                       color: "#4ADE80",
//                       fontWeight: 700,
//                       fontFamily: "'DM Sans', sans-serif",
//                       fontSize: "0.8rem",
//                       border: "1px solid rgba(74,222,128,0.3)",
//                       px: 0.5,
//                     }}
//                   />
//                 ) : (
//                   <Button
//                     variant="contained"
//                     onClick={handleEnroll}
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
//                       boxShadow: "0 0 0 0 rgba(6,182,212,0.5)",
//                       "&:hover": {
//                         background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
//                         boxShadow: "0 6px 20px rgba(6,182,212,0.4)",
//                         transform: "translateY(-1px)",
//                       },
//                       "&:disabled": { opacity: 0.5 },
//                       transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
//                     }}
//                   >
//                     {enrollLoading ? "Enrolling…" : "Enroll Now →"}
//                   </Button>
//                 )}
//               </Box>
//             </Box>

//             {/* Stat pills row */}
//             <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
//               <StatPill
//                 icon={<PeopleIcon sx={{ fontSize: 14, color: "#06B6D4" }} />}
//                 label="Enrolled"
//                 value={pageData.stats.enrolledCount.toLocaleString()}
//               />
//             </Box>
//           </Box>

//           {/* Alerts */}
//           {(enrollSuccess || enrollError) && (
//             <Box sx={{ mt: 2.5, position: "relative", zIndex: 1 }}>
//               {enrollSuccess && (
//                 <Alert severity="success" sx={{
//                   borderRadius: "10px",
//                   bgcolor: "rgba(22,163,74,0.15)",
//                   color: "#4ADE80",
//                   border: "1px solid rgba(74,222,128,0.2)",
//                   "& .MuiAlert-icon": { color: "#4ADE80" },
//                   fontFamily: "'DM Sans', sans-serif",
//                 }}>{enrollSuccess}</Alert>
//               )}
//               {enrollError && (
//                 <Alert severity="error" sx={{ borderRadius: "10px", fontFamily: "'DM Sans', sans-serif" }}>
//                   {enrollError}
//                 </Alert>
//               )}
//             </Box>
//           )}
//         </Box>

//         {/* ── Lesson Content Card ── */}
//         <Box sx={{
//           bgcolor: "#fff",
//           border: "1px solid #E9EEF5",
//           borderRadius: "18px",
//           overflow: "hidden",
//           mb: 4,
//           boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
//         }}>
//           {/* Card header strip */}
//           <Box sx={{
//             px: { xs: 3, sm: 4 }, py: 2,
//             borderBottom: "1px solid #F1F5F9",
//             display: "flex", alignItems: "center", gap: 1.5,
//             bgcolor: "#FAFBFD",
//           }}>
//             <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <MenuBookIcon sx={{ fontSize: 16, color: "#1D4ED8" }} />
//             </Box>
//             <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}>
//               Lesson Content
//             </Typography>
//           </Box>

//           {/* Rich content area */}
//           <Box
//             ref={contentRef}
//             dangerouslySetInnerHTML={{ __html: pageData.content || "<p>No content available.</p>" }}
//             sx={{
//               px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 },
//               // Base
//               fontSize: "1rem",
//               lineHeight: 1.8,
//               color: "#334155",
//               fontFamily: "'DM Sans', sans-serif",

//               // Headings
//               "& h1": {
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "1.6rem", fontWeight: 800,
//                 color: "#0F172A", mt: 4, mb: 1.5,
//                 lineHeight: 1.25, letterSpacing: "-0.03em",
//                 pb: 1.5,
//                 borderBottom: "2px solid #F1F5F9",
//               },
//               "& h2": {
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "1.3rem", fontWeight: 700,
//                 color: "#0F172A", mt: 3.5, mb: 1.25,
//                 lineHeight: 1.3, letterSpacing: "-0.02em",
//                 display: "flex", alignItems: "center",
//                 "&::before": {
//                   content: '""',
//                   display: "inline-block",
//                   width: 4, height: "1em",
//                   bgcolor: "#1D4ED8",
//                   borderRadius: "2px",
//                   mr: 1.25,
//                   flexShrink: 0,
//                 },
//               },
//               "& h3": {
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "1.1rem", fontWeight: 700,
//                 color: "#1E293B", mt: 3, mb: 1,
//                 lineHeight: 1.35, letterSpacing: "-0.015em",
//               },
//               "& h4": {
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "0.975rem", fontWeight: 700,
//                 color: "#334155", mt: 2.5, mb: 0.75,
//               },

//               // Paragraphs
//               "& p": {
//                 mb: 1.75, lineHeight: 1.85,
//                 color: "#475569",
//                 fontSize: "0.975rem",
//                 fontFamily: "'DM Sans', sans-serif",
//               },
//               "& p:empty": { display: "none" },

//               // Lists
//               "& ul": { pl: 0, mb: 2, listStyle: "none" },
//               "& ul li": {
//                 mb: 0.75, lineHeight: 1.75,
//                 color: "#475569",
//                 fontSize: "0.975rem",
//                 pl: "1.5rem",
//                 position: "relative",
//                 fontFamily: "'DM Sans', sans-serif",
//                 "&::before": {
//                   content: '"→"',
//                   position: "absolute", left: 0,
//                   color: "#06B6D4", fontWeight: 700,
//                   fontSize: "0.85rem",
//                 },
//               },
//               "& ol": { pl: 2.5, mb: 2 },
//               "& ol li": {
//                 mb: 0.75, lineHeight: 1.75,
//                 color: "#475569", fontSize: "0.975rem",
//                 fontFamily: "'DM Sans', sans-serif",
//                 "& ::marker": { color: "#1D4ED8", fontWeight: 700 },
//               },

//               // Blockquote
//               "& blockquote": {
//                 bgcolor: "#F0F7FF",
//                 borderLeft: "4px solid #1D4ED8",
//                 borderRadius: "0 12px 12px 0",
//                 px: 2.5, py: 2, ml: 0, my: 2.5,
//                 color: "#1E40AF",
//                 fontStyle: "italic",
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "0.975rem",
//                 "& p": { mb: 0, color: "#1E40AF" },
//               },

//               // Inline code
//               "& code": {
//                 bgcolor: "#F1F5F9",
//                 color: "#1D4ED8",
//                 px: 0.75, py: 0.2,
//                 borderRadius: "5px",
//                 fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                 fontSize: "0.855em",
//                 border: "1px solid #E2E8F0",
//               },

//               // Code block
//               "& pre": {
//                 bgcolor: "#0F172A",
//                 borderRadius: "12px",
//                 p: 2.5, my: 2.5,
//                 overflowX: "auto",
//                 border: "1px solid rgba(255,255,255,0.06)",
//                 "& code": {
//                   color: "#94A3B8",
//                   bgcolor: "transparent",
//                   border: "none", p: 0,
//                   fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                   fontSize: "0.875rem",
//                   lineHeight: 1.7,
//                 },
//               },

//               // Strong / em
//               "& strong": { fontWeight: 700, color: "#0F172A" },
//               "& em": { fontStyle: "italic", color: "#475569" },

//               // Links
//               "& a": {
//                 color: "#1D4ED8",
//                 textDecoration: "none",
//                 borderBottom: "1.5px solid rgba(29,78,216,0.3)",
//                 "&:hover": { borderBottomColor: "#1D4ED8", color: "#1E40AF" },
//                 transition: "all 0.15s",
//               },

//               // Images
//               "& img": {
//                 maxWidth: "100%",
//                 borderRadius: "10px",
//                 my: 2,
//                 display: "block",
//                 border: "1px solid #E2E8F0",
//                 boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
//               },

//               // Horizontal rule
//               "& hr": { my: 3.5, border: "none", borderTop: "2px solid #F1F5F9" },

//               // Tables
//               "& table": {
//                 width: "100%", borderCollapse: "collapse",
//                 my: 2.5, fontSize: "0.9rem",
//                 borderRadius: "10px", overflow: "hidden",
//                 border: "1px solid #E2E8F0",
//               },
//               "& th": {
//                 bgcolor: "#F8FAFC", fontWeight: 700,
//                 color: "#0F172A",
//                 p: "10px 14px", textAlign: "left",
//                 borderBottom: "2px solid #E2E8F0",
//                 fontFamily: "'DM Sans', sans-serif",
//               },
//               "& td": {
//                 p: "9px 14px",
//                 borderBottom: "1px solid #F1F5F9",
//                 color: "#475569", verticalAlign: "top",
//                 fontFamily: "'DM Sans', sans-serif",
//               },
//               "& tr:last-child td": { borderBottom: "none" },
//               "& tr:nth-of-type(even) td": { bgcolor: "#FAFBFD" },
//             }}
//           />
//         </Box>

//         {/* ── Testimonials ── */}
//         <Box sx={{
//           bgcolor: "#FAFBFD",
//           border: "1px solid #E9EEF5",
//           borderRadius: "18px",
//           p: { xs: 3, sm: 4 },
//           boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
//         }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
//             <Typography sx={{
//               fontFamily: "'DM Sans', sans-serif",
//               fontWeight: 800, fontSize: "1.05rem",
//               color: "#0F172A", letterSpacing: "-0.02em",
//             }}>
//               What students say
//             </Typography>
//             {pageData.testimonials.length > 0 && (
//               <Chip
//                 label={`${pageData.testimonials.length} review${pageData.testimonials.length !== 1 ? "s" : ""}`}
//                 size="small"
//                 sx={{
//                   bgcolor: "#EFF6FF", color: "#1D4ED8",
//                   fontWeight: 700, fontSize: "0.7rem",
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

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { courseService } from "../services/api";
import { enrollmentService } from "../../enrollment/services/api";
import TestimonialsScroller from "../../testimonial/components/TestimonialScroller";
import ConfirmDialog from "../../../components/ConfirmDialog";

interface BreadcrumbEntry {
  id: string;
  title: string;
}

interface Props {
  pageId: string;
  onBack: () => void;
  breadcrumbs: BreadcrumbEntry[];
  onBreadcrumbClick: (index: number) => void;
}

interface PageData {
  title: string;
  content: string;
  stats: { enrolledCount: number };
  testimonials: any[];
}

/* ─── tiny read-progress bar ─── */
const ReadProgress: React.FC = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Box sx={{
      position: "fixed", top: 0, left: 0, height: 3, zIndex: 9999,
      width: `${pct}%`,
      background: "linear-gradient(90deg, #06B6D4, #1D4ED8)",
      transition: "width 0.1s linear",
      borderRadius: "0 2px 2px 0",
    }} />
  );
};

/* ─── stat pill ─── */
const StatPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Box sx={{
    display: "flex", alignItems: "center", gap: 1.25,
    bgcolor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "10px", px: 1.75, py: 1,
  }}>
    <Box sx={{
      width: 30, height: 30, borderRadius: "8px",
      bgcolor: "rgba(6,182,212,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.88rem", color: "#fff", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const CoursePageDetail: React.FC<Props> = ({
  pageId,
  onBack,
  breadcrumbs,
  onBreadcrumbClick,
}) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [enrollConfirmOpen, setEnrollConfirmOpen] = useState(false);
  const [unenrollConfirmOpen, setUnenrollConfirmOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [pageRes, enrollRes] = await Promise.all([
          courseService.getPageDetails(pageId),
          enrollmentService.checkEnrollment(pageId),
        ]);
        setPageData(pageRes.data);
        setIsEnrolled(enrollRes.enrolled || false);
      } catch {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pageId]);

  const handleEnrollClick = () => {
    setEnrollConfirmOpen(true);
  };

  const handleEnroll = async () => {
    setEnrollLoading(true);
    setEnrollError("");
    setEnrollSuccess("");
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
        err?.response?.data?.message || "Enrollment failed. Please try again."
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleUnenrollClick = () => {
    setUnenrollConfirmOpen(true);
  };

  const handleUnenroll = async () => {
    setEnrollLoading(true);
    setEnrollError("");
    setEnrollSuccess("");
    setUnenrollConfirmOpen(false);
    try {
      await enrollmentService.unenrollFromCourse(pageId);
      setIsEnrolled(false);
      setEnrollSuccess("You have successfully unenrolled from the course.");
      if (pageData) {
        setPageData({
          ...pageData,
          stats: { enrolledCount: Math.max(0, pageData.stats.enrolledCount - 1) },
        });
      }
    } catch (err: any) {
      setEnrollError(
        err?.response?.data?.message || "Unenrollment failed. Please try again."
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 14, gap: 2 }}>
        <CircularProgress size={36} thickness={3} sx={{ color: "#1D4ED8" }} />
        <Typography sx={{ color: "#94A3B8", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
          Loading lesson…
        </Typography>
      </Box>
    );
  }

  if (error || !pageData) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
        {error || "Course not found."}
      </Alert>
    );
  }

  return (
    <>
      <ReadProgress />
      
      <ConfirmDialog 
        open={enrollConfirmOpen} 
        title="Enroll in Course" 
        message="Are you sure you want to enroll in this course?" 
        onConfirm={handleEnroll} 
        onCancel={() => setEnrollConfirmOpen(false)} 
        confirmColor="primary" 
        confirmText="Enroll"
      />

      <ConfirmDialog
        open={unenrollConfirmOpen}
        title="Unenroll from Course"
        message="Are you sure you want to unenroll from this course? You will lose access to its contents."
        onConfirm={handleUnenroll}
        onCancel={() => setUnenrollConfirmOpen(false)}
        confirmColor="error"
        confirmText="Unenroll"
      />

      <Box sx={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Breadcrumb ── */}
        <Box sx={{
          mb: 3, display: "inline-flex", alignItems: "center",
          px: 1.5, py: 0.75,
          bgcolor: "#F8FAFC", borderRadius: "8px",
          border: "1px solid #E2E8F0",
        }}>
          <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 13, color: "#CBD5E1" }} />}>
            <Link component="button" underline="none" onClick={() => onBreadcrumbClick(-1)}
              sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                color: "#64748B", fontSize: "0.75rem",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                background: "none", border: "none", cursor: "pointer",
                "&:hover": { color: "#1D4ED8" }, transition: "color 0.15s",
              }}>
              <HomeIcon sx={{ fontSize: 13 }} /> All Courses
            </Link>
            {breadcrumbs.slice(0, -1).map((crumb, idx) => (
              <Link key={crumb.id} component="button" underline="none" onClick={() => onBreadcrumbClick(idx)}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.5,
                  color: "#64748B", fontSize: "0.75rem",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  background: "none", border: "none", cursor: "pointer",
                  "&:hover": { color: "#1D4ED8" }, transition: "color 0.15s",
                }}>
                <FolderOpenIcon sx={{ fontSize: 12 }} /> {crumb.title}
              </Link>
            ))}
            <Typography sx={{ color: "#0F172A", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
              {pageData.title}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* ── Back Button ── */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
            onClick={onBack}
            size="small"
            sx={{
              textTransform: "none", color: "#475569",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.82rem",
              bgcolor: "transparent", borderRadius: "8px", px: 1.5, py: 0.6,
              border: "1px solid #E2E8F0",
              "&:hover": { bgcolor: "#F1F5F9", borderColor: "#CBD5E1" },
              transition: "all 0.15s",
            }}
          >
            Back to course
          </Button>
        </Box>

        {/* ── Hero Card ── */}
        <Box sx={{
          background: "linear-gradient(135deg, #0A1628 0%, #0F2952 50%, #1D4ED8 100%)",
          borderRadius: "20px",
          p: { xs: 3, sm: 4 },
          mb: 3,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative orbs */}
          <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -30, left: "20%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", top: "40%", right: "15%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Dot-grid texture */}
          <Box sx={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Tag */}
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, mb: 2, bgcolor: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "6px", px: 1.25, py: 0.4 }}>
              <MenuBookIcon sx={{ fontSize: 12, color: "#06B6D4" }} />
              <Typography sx={{ fontSize: "0.7rem", color: "#06B6D4", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                Lesson
              </Typography>
            </Box>

            {/* Title + Enroll row */}
            <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: { xs: "1.2rem", sm: "1.55rem" },
                color: "#fff",
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                flex: 1,
              }}>
                {pageData.title}
              </Typography>

              <Box sx={{ flexShrink: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
                {isEnrolled ? (
                  <>
                    <Chip
                      icon={<CheckCircleIcon sx={{ color: "#4ADE80 !important", fontSize: "15px !important" }} />}
                      label="Enrolled"
                      sx={{
                        bgcolor: "rgba(22,163,74,0.15)",
                        color: "#4ADE80",
                        fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        border: "1px solid rgba(74,222,128,0.3)",
                        px: 0.5,
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleUnenrollClick}
                      disabled={enrollLoading}
                      size="small"
                      sx={{
                        color: "#F87171",
                        borderColor: "rgba(248,113,113,0.3)",
                        textTransform: "none",
                        fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                        "&:hover": {
                          borderColor: "#F87171",
                          bgcolor: "rgba(248,113,113,0.08)",
                        }
                      }}
                    >
                      {enrollLoading ? "Wait…" : "Unenroll"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleEnrollClick}
                    disabled={enrollLoading}
                    disableElevation
                    sx={{
                      background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: "11px",
                      px: 3.5,
                      py: 1.1,
                      fontSize: "0.88rem",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "-0.01em",
                      boxShadow: "0 0 0 0 rgba(6,182,212,0.5)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
                        boxShadow: "0 6px 20px rgba(6,182,212,0.4)",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": { opacity: 0.5 },
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {enrollLoading ? "Enrolling…" : "Enroll Now →"}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Stat pills row */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <StatPill
                icon={<PeopleIcon sx={{ fontSize: 14, color: "#06B6D4" }} />}
                label="Enrolled"
                value={pageData.stats.enrolledCount.toLocaleString()}
              />
            </Box>
          </Box>

          {/* Alerts */}
          {(enrollSuccess || enrollError) && (
            <Box sx={{ mt: 2.5, position: "relative", zIndex: 1 }}>
              {enrollSuccess && (
                <Alert severity="success" sx={{
                  borderRadius: "10px",
                  bgcolor: "rgba(22,163,74,0.15)",
                  color: "#4ADE80",
                  border: "1px solid rgba(74,222,128,0.2)",
                  "& .MuiAlert-icon": { color: "#4ADE80" },
                  fontFamily: "'DM Sans', sans-serif",
                }}>{enrollSuccess}</Alert>
              )}
              {enrollError && (
                <Alert severity="error" sx={{ borderRadius: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                  {enrollError}
                </Alert>
              )}
            </Box>
          )}
        </Box>

        {/* ── Lesson Content Card ── */}
        <Box sx={{
          bgcolor: "#fff",
          border: "1px solid #E9EEF5",
          borderRadius: "18px",
          overflow: "hidden",
          mb: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)",
        }}>
          {/* Card header strip */}
          <Box sx={{
            px: { xs: 3, sm: 4 }, py: 2,
            borderBottom: "1px solid #F1F5F9",
            display: "flex", alignItems: "center", gap: 1.5,
            bgcolor: "#FAFBFD",
          }}>
            <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MenuBookIcon sx={{ fontSize: 16, color: "#1D4ED8" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}>
              Lesson Content
            </Typography>
          </Box>

          {/* Rich content area */}
          <Box
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: pageData.content || "<p>No content available.</p>" }}
            sx={{
              px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 },
              // Base
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "#334155",
              fontFamily: "'DM Sans', sans-serif",

              // Headings
              "& h1": {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.6rem", fontWeight: 800,
                color: "#0F172A", mt: 4, mb: 1.5,
                lineHeight: 1.25, letterSpacing: "-0.03em",
                pb: 1.5,
                borderBottom: "2px solid #F1F5F9",
              },
              "& h2": {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.3rem", fontWeight: 700,
                color: "#0F172A", mt: 3.5, mb: 1.25,
                lineHeight: 1.3, letterSpacing: "-0.02em",
                display: "flex", alignItems: "center",
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: 4, height: "1em",
                  bgcolor: "#1D4ED8",
                  borderRadius: "2px",
                  mr: 1.25,
                  flexShrink: 0,
                },
              },
              "& h3": {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.1rem", fontWeight: 700,
                color: "#1E293B", mt: 3, mb: 1,
                lineHeight: 1.35, letterSpacing: "-0.015em",
              },
              "& h4": {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.975rem", fontWeight: 700,
                color: "#334155", mt: 2.5, mb: 0.75,
              },

              // Paragraphs
              // ✅ FIX: color removed from <p> so inline color spans inside
              //    paragraphs are not overridden by a hardcoded paragraph color.
              "& p": {
                mb: 1.75, lineHeight: 1.85,
                fontSize: "0.975rem",
                fontFamily: "'DM Sans', sans-serif",
              },
              "& p:empty": { display: "none" },

              // Lists
              "& ul": { pl: 0, mb: 2, listStyle: "none" },
              "& ul li": {
                mb: 0.75, lineHeight: 1.75,
                color: "#475569",
                fontSize: "0.975rem",
                pl: "1.5rem",
                position: "relative",
                fontFamily: "'DM Sans', sans-serif",
                "&::before": {
                  content: '"→"',
                  position: "absolute", left: 0,
                  color: "#06B6D4", fontWeight: 700,
                  fontSize: "0.85rem",
                },
              },
              "& ol": { pl: 2.5, mb: 2 },
              "& ol li": {
                mb: 0.75, lineHeight: 1.75,
                color: "#475569", fontSize: "0.975rem",
                fontFamily: "'DM Sans', sans-serif",
                "& ::marker": { color: "#1D4ED8", fontWeight: 700 },
              },

              // Blockquote
              "& blockquote": {
                bgcolor: "#F0F7FF",
                borderLeft: "4px solid #1D4ED8",
                borderRadius: "0 12px 12px 0",
                px: 2.5, py: 2, ml: 0, my: 2.5,
                color: "#1E40AF",
                fontStyle: "italic",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.975rem",
                "& p": { mb: 0, color: "#1E40AF" },
              },

              // Inline code
              "& code": {
                bgcolor: "#F1F5F9",
                color: "#1D4ED8",
                px: 0.75, py: 0.2,
                borderRadius: "5px",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "0.855em",
                border: "1px solid #E2E8F0",
              },

              // Code block
              "& pre": {
                bgcolor: "#0F172A",
                borderRadius: "12px",
                p: 2.5, my: 2.5,
                overflowX: "auto",
                border: "1px solid rgba(255,255,255,0.06)",
                "& code": {
                  color: "#94A3B8",
                  bgcolor: "transparent",
                  border: "none", p: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                },
              },

              // ✅ FIX: strong and em now use `inherit` instead of hardcoded colors.
              //    Previously `color: "#0F172A"` on strong and `color: "#475569"` on em
              //    were overriding any inline color/textStyle applied by the editor.
              "& strong": { fontWeight: 700, color: "inherit" },
              "& em": { fontStyle: "italic", color: "inherit" },

              // ✅ FIX: span color must not be overridden — ensure no catch-all
              //    span rule fights inline styles from the editor's TextStyle marks.
              "& span": { color: "inherit" },

              // Links
              "& a": {
                color: "#1D4ED8",
                textDecoration: "none",
                borderBottom: "1.5px solid rgba(29,78,216,0.3)",
                "&:hover": { borderBottomColor: "#1D4ED8", color: "#1E40AF" },
                transition: "all 0.15s",
              },

              // Images
              "& img": {
                maxWidth: "100%",
                borderRadius: "10px",
                my: 2,
                display: "block",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
              },

              // Horizontal rule
              "& hr": { my: 3.5, border: "none", borderTop: "2px solid #F1F5F9" },

              // Tables
              "& table": {
                width: "100%", borderCollapse: "collapse",
                my: 2.5, fontSize: "0.9rem",
                borderRadius: "10px", overflow: "hidden",
                border: "1px solid #E2E8F0",
              },
              "& th": {
                bgcolor: "#F8FAFC", fontWeight: 700,
                color: "#0F172A",
                p: "10px 14px", textAlign: "left",
                borderBottom: "2px solid #E2E8F0",
                fontFamily: "'DM Sans', sans-serif",
              },
              "& td": {
                p: "9px 14px",
                borderBottom: "1px solid #F1F5F9",
                color: "#475569", verticalAlign: "top",
                fontFamily: "'DM Sans', sans-serif",
              },
              "& tr:last-child td": { borderBottom: "none" },
              "& tr:nth-of-type(even) td": { bgcolor: "#FAFBFD" },
            }}
          />
        </Box>

        {/* ── Testimonials ── */}
        <Box sx={{
          bgcolor: "#FAFBFD",
          border: "1px solid #E9EEF5",
          borderRadius: "18px",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Typography sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800, fontSize: "1.05rem",
              color: "#0F172A", letterSpacing: "-0.02em",
            }}>
              What students say
            </Typography>
            {pageData.testimonials.length > 0 && (
              <Chip
                label={`${pageData.testimonials.length} review${pageData.testimonials.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  bgcolor: "#EFF6FF", color: "#1D4ED8",
                  fontWeight: 700, fontSize: "0.7rem",
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1px solid #BFDBFE",
                }}
              />
            )}
          </Box>
          <TestimonialsScroller courseId={pageId} initialTestimonials={pageData.testimonials} />
        </Box>

      </Box>
    </>
  );
};

export default CoursePageDetail;