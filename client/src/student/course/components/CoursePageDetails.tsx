import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  Avatar,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { courseService } from "../services/api";
import { enrollmentService } from "../../enrollment/services/api";
import TestimonialsScroller from "../../testimonial/components/TestimonialScroller";

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

  const handleEnroll = async () => {
    setEnrollLoading(true);
    setEnrollError("");
    setEnrollSuccess("");
    try {
      await enrollmentService.enrollInCourse(pageId);
      setIsEnrolled(true);
      setEnrollSuccess("You have been enrolled successfully!");
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error || !pageData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || "Course not found."}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link
            component="button"
            underline="hover"
            onClick={() => onBreadcrumbClick(-1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              fontSize: "0.875rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              p: 0,
            }}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            All Courses
          </Link>
          {breadcrumbs.slice(0, -1).map((crumb, idx) => (
            <Link
              key={crumb.id}
              component="button"
              underline="hover"
              onClick={() => onBreadcrumbClick(idx)}
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                p: 0,
              }}
            >
              {crumb.title}
            </Link>
          ))}
          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
            {pageData.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        size="small"
        sx={{ mb: 3, textTransform: "none", color: "text.secondary" }}
      >
        Back
      </Button>

      {/* Page Header */}
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
              {pageData.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PeopleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>{pageData.stats.enrolledCount.toLocaleString()}</strong> students enrolled
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            {isEnrolled ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Enrolled"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            ) : (
              <Button
                variant="contained"
                onClick={handleEnroll}
                disabled={enrollLoading}
                disableElevation
                sx={{ textTransform: "none", fontWeight: 500, borderRadius: 1.5 }}
              >
                {enrollLoading ? "Enrolling..." : "Enroll Now"}
              </Button>
            )}
          </Box>
        </Box>

        {enrollSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {enrollSuccess}
          </Alert>
        )}
        {enrollError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {enrollError}
          </Alert>
        )}
      </Box>

      {/* TipTap Rich Content */}
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          mb: 4,
          "& h1": { fontSize: "1.5rem", fontWeight: 600, mb: 1.5, mt: 2 },
          "& h2": { fontSize: "1.25rem", fontWeight: 600, mb: 1, mt: 2 },
          "& h3": { fontSize: "1.1rem", fontWeight: 600, mb: 1, mt: 1.5 },
          "& p": { mb: 1.5, lineHeight: 1.75, color: "text.primary" },
          "& strong": { fontWeight: 600 },
          "& ul, & ol": { pl: 3, mb: 1.5 },
          "& li": { mb: 0.5, lineHeight: 1.7 },
          "& blockquote": {
            borderLeft: "3px solid",
            borderColor: "primary.main",
            pl: 2,
            ml: 0,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& code": {
            bgcolor: "action.hover",
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            fontFamily: "monospace",
            fontSize: "0.875rem",
          },
          "& pre": {
            bgcolor: "action.hover",
            p: 2,
            borderRadius: 1,
            overflow: "auto",
            mb: 2,
          },
          "& img": { maxWidth: "100%", borderRadius: 1 },
        }}
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />

      <Divider sx={{ mb: 4 }} />

      {/* Testimonials Section */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "text.primary" }}>
          What students say
        </Typography>
        <TestimonialsScroller courseId={pageId} initialTestimonials={pageData.testimonials} />
      </Box>
    </Box>
  );
};

export default CoursePageDetail;