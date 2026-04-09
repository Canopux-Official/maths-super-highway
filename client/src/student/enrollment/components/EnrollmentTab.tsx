import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Collapse,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArticleIcon from "@mui/icons-material/Article";
import { courseService } from "../../course/services/api";
import FeedbackForm from "../../testimonial/components/FeedBackForm";

interface EnrolledCourse {
  _id: string;
  title: string;
  itemType: string;
  createdAt: string;
}

const EnrolledCoursesTab: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (courses.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          color: "text.secondary",
        }}
      >
        <BookmarkIcon sx={{ fontSize: 40, mb: 1, opacity: 0.35 }} />
        <Typography variant="body2">You have not enrolled in any courses yet.</Typography>
        <Typography variant="caption">Explore the All Courses tab to get started.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
      </Typography>

      {courses.map((course) => (
        <Paper
          key={course._id}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Course Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: "14px 16px",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.50",
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <ArticleIcon sx={{ fontSize: 18 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {course.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Enrolled on{" "}
                {new Date(course.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Box>

            <Button
              size="small"
              variant={expandedFeedback === course._id ? "contained" : "outlined"}
              onClick={() => toggleFeedback(course._id)}
              disableElevation
              sx={{ textTransform: "none", fontSize: "0.8rem", flexShrink: 0, borderRadius: 1.5 }}
            >
              {expandedFeedback === course._id ? "Close" : "Leave Feedback"}
            </Button>
          </Box>

          {/* Feedback Form (collapsible) */}
          <Collapse in={expandedFeedback === course._id}>
            <Box
              sx={{
                borderTop: "1px solid",
                borderColor: "divider",
                p: { xs: 2, sm: 3 },
                bgcolor: "action.hover",
              }}
            >
              <FeedbackForm
                courseId={course._id}
                onSubmitSuccess={() => setExpandedFeedback(null)}
              />
            </Box>
          </Collapse>
        </Paper>
      ))}
    </Box>
  );
};

export default EnrolledCoursesTab;