// import React, { useEffect, useState } from "react";
// import {
//   Box, Typography, CircularProgress, Alert, Paper,
//   Button, Collapse, Chip, Avatar,
// } from "@mui/material";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
// import ArticleIcon from "@mui/icons-material/Article";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
// import { courseService } from "../../course/services/api";
// import { enrollmentService } from "../services/api";
// import FeedbackForm from "../../testimonial/components/FeedBackForm";
// import ConfirmDialog from "../../../components/ConfirmDialog";

// interface EnrolledCourse {
//   _id: string;
//   title: string;
//   itemType: string;
//   createdAt: string;
// }

// const EnrolledCoursesTab: React.FC = () => {
//   const [courses, setCourses] = useState<EnrolledCourse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
//   const [courseToUnenroll, setCourseToUnenroll] = useState<string | null>(null);
//   const [unenrollLoading, setUnenrollLoading] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await courseService.getMyEnrolledCourses();
//         setCourses(res.data || []);
//       } catch {
//         setError("Failed to load enrolled courses.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const toggleFeedback = (id: string) => {
//     setExpandedFeedback((prev) => (prev === id ? null : id));
//   };

//   const handleUnenroll = async () => {
//     if (!courseToUnenroll) return;
//     setUnenrollLoading(true);
//     try {
//       await enrollmentService.unenrollFromCourse(courseToUnenroll);
//       setCourses((prev) => prev.filter((c) => c._id !== courseToUnenroll));
//     } catch (err) {
//       setError("Failed to unenroll. Please try again.");
//     } finally {
//       setUnenrollLoading(false);
//       setCourseToUnenroll(null);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//         <CircularProgress size={32} sx={{ color: "#1D4ED8" }} />
//       </Box>
//     );
//   }

//   if (error) {
//     return <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>;
//   }

//   if (courses.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", py: 10, border: "1px dashed #BFDBFE", borderRadius: "12px", bgcolor: "#F8FAFC" }}>
//         <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(29,78,216,0.08)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
//           <BookmarkIcon sx={{ color: "#1D4ED8", fontSize: 26 }} />
//         </Box>
//         <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0A1628", fontFamily: "'Sora', sans-serif", mb: 0.5 }}>
//           No enrolled courses yet
//         </Typography>
//         <Typography sx={{ color: "#64748B", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif" }}>
//           Explore the All Courses tab to get started.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Count pill */}
//       <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 3, px: 1.5, py: 0.75, bgcolor: "rgba(29,78,216,0.07)", borderRadius: "8px", border: "1px solid rgba(29,78,216,0.15)" }}>
//         <BookmarkIcon sx={{ fontSize: 14, color: "#1D4ED8" }} />
//         <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#1D4ED8", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em" }}>
//           {courses.length} Course{courses.length !== 1 ? "s" : ""} Enrolled
//         </Typography>
//       </Box>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//         {courses.map((course, idx) => {
//           const initials = course.title.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
//           const enrollDate = new Date(course.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
//           const isFeedbackOpen = expandedFeedback === course._id;

//           return (
//             <Paper
//               key={course._id}
//               elevation={0}
//               sx={{
//                 border: "1px solid #E2E8F0",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 transition: "box-shadow 0.2s",
//                 "&:hover": { boxShadow: "0 4px 20px rgba(29,78,216,0.08)" },
//                 animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s both`,
//                 "@keyframes fadeInUp": {
//                   from: { opacity: 0, transform: "translateY(16px)" },
//                   to: { opacity: 1, transform: "translateY(0)" },
//                 },
//               }}
//             >
//               {/* Course Row */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: "14px 20px", flexWrap: "wrap", borderLeft: "3px solid #1D4ED8" }}>
//                 <Avatar sx={{ width: 40, height: 40, bgcolor: "rgba(29,78,216,0.10)", color: "#1D4ED8", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Sora', sans-serif" }}>
//                   {initials}
//                 </Avatar>

//                 <Box sx={{ flex: 1, minWidth: 0 }}>
//                   <Typography sx={{ fontWeight: 700, color: "#0A1628", fontFamily: "'Sora', sans-serif", fontSize: "0.9375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.25 }}>
//                     {course.title}
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//                     <CalendarTodayIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
//                     <Typography sx={{ color: "#64748B", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>
//                       Enrolled on {enrollDate}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Chip
//                   label="Enrolled"
//                   size="small"
//                   sx={{ bgcolor: "rgba(22,163,74,0.10)", color: "#16A34A", fontWeight: 700, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", border: "1px solid rgba(22,163,74,0.2)", display: { xs: "none", sm: "flex" } }}
//                 />

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   onClick={() => setCourseToUnenroll(course._id)}
//                   disabled={unenrollLoading && courseToUnenroll === course._id}
//                   sx={{
//                     color: "#F87171",
//                     borderColor: "rgba(248,113,113,0.3)",
//                     textTransform: "none",
//                     fontWeight: 600,
//                     borderRadius: "8px",
//                     fontFamily: "'Inter', sans-serif",
//                     "&:hover": {
//                       borderColor: "#F87171",
//                       bgcolor: "rgba(248,113,113,0.08)",
//                     }
//                   }}
//                 >
//                   {unenrollLoading && courseToUnenroll === course._id ? "Wait..." : "Unenroll"}
//                 </Button>

//                 <Button
//                   size="small"
//                   variant={isFeedbackOpen ? "contained" : "outlined"}
//                   onClick={() => toggleFeedback(course._id)}
//                   startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />}
//                   disableElevation
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "0.8rem",
//                     flexShrink: 0,
//                     borderRadius: "8px",
//                     fontFamily: "'Inter', sans-serif",
//                     fontWeight: 600,
//                     ...(isFeedbackOpen
//                       ? { bgcolor: "#0A1628", color: "#fff", "&:hover": { bgcolor: "#112240" } }
//                       : { borderColor: "#0A1628", color: "#0A1628", "&:hover": { bgcolor: "rgba(10,22,40,0.04)", borderColor: "#0A1628" } }),
//                   }}
//                 >
//                   {isFeedbackOpen ? "Close" : "Leave Feedback"}
//                 </Button>
//               </Box>

//               {/* Feedback Form */}
//               <Collapse in={isFeedbackOpen}>
//                 <Box sx={{ borderTop: "1px solid #E2E8F0", p: { xs: 2, sm: 3 }, bgcolor: "#F8FAFC" }}>
//                   <FeedbackForm courseId={course._id} onSubmitSuccess={() => setExpandedFeedback(null)} />
//                 </Box>
//               </Collapse>
//             </Paper>
//           );
//         })}
//       </Box>

//       <ConfirmDialog
//         open={!!courseToUnenroll}
//         title="Unenroll from Course"
//         message="Are you sure you want to unenroll from this course? You will lose access to its contents."
//         onConfirm={handleUnenroll}
//         onCancel={() => setCourseToUnenroll(null)}
//         confirmColor="error"
//         confirmText="Unenroll"
//       />
//     </Box>
//   );
// };

// export default EnrolledCoursesTab;
import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Paper,
  Button, Collapse, Chip, Avatar,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../course/services/api";
import { enrollmentService } from "../services/api";
import FeedbackForm from "../../testimonial/components/FeedBackForm";
import ConfirmDialog from "../../../components/ConfirmDialog";

interface EnrolledCourse {
  _id: string;
  title: string;
  itemType: string;
  parentId: string | null;
  createdAt: string;
}

const EnrolledCoursesTab: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const [courseToUnenroll, setCourseToUnenroll] = useState<string | null>(null);
  const [unenrollLoading, setUnenrollLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await courseService.getMyEnrolledCourses();
        setCourses(res.data || []);
      } catch {
        setError("Failed to load enrolled courses.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleFeedback = (id: string) => {
    setExpandedFeedback((prev) => (prev === id ? null : id));
  };

  const handleUnenroll = async () => {
    if (!courseToUnenroll) return;
    setUnenrollLoading(true);
    try {
      await enrollmentService.unenrollFromCourse(courseToUnenroll);
      setCourses((prev) => prev.filter((c) => c._id !== courseToUnenroll));
    } catch {
      setError("Failed to unenroll. Please try again.");
    } finally {
      setUnenrollLoading(false);
      setCourseToUnenroll(null);
    }
  };

  // ── Navigate to All Courses tab and open the specific item ──
  const handleViewCourse = (course: EnrolledCourse) => {
    navigate("/student/courses", {             // ← change "/courses" to your actual route
      state: {
        activeTab: "all",
        openPageId: course.itemType === "page" ? course._id : null,
        openFolderId: course.itemType === "folder" ? course._id : null,
        openTitle: course.title,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={32} sx={{ color: "#1D4ED8" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>;
  }

  if (courses.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 10, border: "1px dashed #BFDBFE", borderRadius: "12px", bgcolor: "#F8FAFC" }}>
        <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(29,78,216,0.08)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
          <BookmarkIcon sx={{ color: "#1D4ED8", fontSize: 26 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0A1628", fontFamily: "'Sora', sans-serif", mb: 0.5 }}>
          No enrolled courses yet
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif" }}>
          Explore the All Courses tab to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Count pill */}
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 3, px: 1.5, py: 0.75, bgcolor: "rgba(29,78,216,0.07)", borderRadius: "8px", border: "1px solid rgba(29,78,216,0.15)" }}>
        <BookmarkIcon sx={{ fontSize: 14, color: "#1D4ED8" }} />
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#1D4ED8", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em" }}>
          {courses.length} Course{courses.length !== 1 ? "s" : ""} Enrolled
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {courses.map((course, idx) => {
          const initials = course.title.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
          const enrollDate = new Date(course.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
          const isFeedbackOpen = expandedFeedback === course._id;

          return (
            <Paper
              key={course._id}
              elevation={0}
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 4px 20px rgba(29,78,216,0.08)" },
                animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s both`,
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(16px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {/* Course Row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: "14px 20px", flexWrap: "wrap", borderLeft: "3px solid #1D4ED8" }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: "rgba(29,78,216,0.10)", color: "#1D4ED8", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Sora', sans-serif" }}>
                  {initials}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, color: "#0A1628", fontFamily: "'Sora', sans-serif", fontSize: "0.9375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.25 }}>
                    {course.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CalendarTodayIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
                    <Typography sx={{ color: "#64748B", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>
                      Enrolled on {enrollDate}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label="Enrolled"
                  size="small"
                  sx={{ bgcolor: "rgba(22,163,74,0.10)", color: "#16A34A", fontWeight: 700, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", border: "1px solid rgba(22,163,74,0.2)", display: { xs: "none", sm: "flex" } }}
                />

                {/* ── View Button → switches to All Courses tab + opens item ── */}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleViewCourse(course)}
                  startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    borderColor: "rgba(29,78,216,0.35)",
                    color: "#1D4ED8",
                    "&:hover": {
                      borderColor: "#1D4ED8",
                      bgcolor: "rgba(29,78,216,0.06)",
                    },
                  }}
                >
                  View
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setCourseToUnenroll(course._id)}
                  disabled={unenrollLoading && courseToUnenroll === course._id}
                  sx={{
                    color: "#F87171",
                    borderColor: "rgba(248,113,113,0.3)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    "&:hover": {
                      borderColor: "#F87171",
                      bgcolor: "rgba(248,113,113,0.08)",
                    }
                  }}
                >
                  {unenrollLoading && courseToUnenroll === course._id ? "Wait..." : "Unenroll"}
                </Button>

                <Button
                  size="small"
                  variant={isFeedbackOpen ? "contained" : "outlined"}
                  onClick={() => toggleFeedback(course._id)}
                  startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />}
                  disableElevation
                  sx={{
                    textTransform: "none",
                    fontSize: "0.8rem",
                    flexShrink: 0,
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    ...(isFeedbackOpen
                      ? { bgcolor: "#0A1628", color: "#fff", "&:hover": { bgcolor: "#112240" } }
                      : { borderColor: "#0A1628", color: "#0A1628", "&:hover": { bgcolor: "rgba(10,22,40,0.04)", borderColor: "#0A1628" } }),
                  }}
                >
                  {isFeedbackOpen ? "Close" : "Leave Feedback"}
                </Button>
              </Box>

              {/* Feedback Form */}
              <Collapse in={isFeedbackOpen}>
                <Box sx={{ borderTop: "1px solid #E2E8F0", p: { xs: 2, sm: 3 }, bgcolor: "#F8FAFC" }}>
                  <FeedbackForm courseId={course._id} onSubmitSuccess={() => setExpandedFeedback(null)} />
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Box>

      <ConfirmDialog
        open={!!courseToUnenroll}
        title="Unenroll from Course"
        message="Are you sure you want to unenroll from this course? You will lose access to its contents."
        onConfirm={handleUnenroll}
        onCancel={() => setCourseToUnenroll(null)}
        confirmColor="error"
        confirmText="Unenroll"
      />
    </Box>
  );
};

export default EnrolledCoursesTab;