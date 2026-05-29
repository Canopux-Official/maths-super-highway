import React, { useEffect, useState } from "react";
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
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} sx={{ color: "#1D4ED8" }} />
      </Box>
    );
  }

  if (error || !pageData) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>
        {error || "Course not found."}
      </Alert>
    );
  }

  return (
    <Box>
      {/* ── Breadcrumb bar ── */}
      <Box sx={{ mb: 3, display: "inline-flex", alignItems: "center", p: "5px 12px", bgcolor: "#F1F5F9", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14, color: "#94A3B8" }} />}>
          <Link component="button" underline="none" onClick={() => onBreadcrumbClick(-1)}
            sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748B", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", background: "none", border: "none", cursor: "pointer", "&:hover": { color: "#1D4ED8" } }}>
            <HomeIcon sx={{ fontSize: 14 }} />
            All Courses
          </Link>
          {breadcrumbs.slice(0, -1).map((crumb, idx) => (
            <Link key={crumb.id} component="button" underline="none" onClick={() => onBreadcrumbClick(idx)}
              sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748B", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif", background: "none", border: "none", cursor: "pointer", "&:hover": { color: "#1D4ED8" } }}>
              <FolderOpenIcon sx={{ fontSize: 13 }} />
              {crumb.title}
            </Link>
          ))}
          <Typography sx={{ color: "#0A1628", fontSize: "0.78rem", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
            {pageData.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* ── Back Button ── */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          size="small"
          sx={{ textTransform: "none", color: "#64748B", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", bgcolor: "#F1F5F9", borderRadius: "8px", px: 2, py: 0.75, "&:hover": { bgcolor: "#E2E8F0" } }}
        >
          Back
        </Button>
      </Box>

      {/* ── Lesson Header Card ── */}
      <Box sx={{
        background: "linear-gradient(135deg, #0A1628 0%, #1D4ED8 100%)",
        borderRadius: "14px",
        p: { xs: 2.5, sm: 3.5 },
        mb: 3,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle circle decorations */}
        <Box sx={{ position: "absolute", top: -16, right: -16, width: 90, height: 90, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -20, left: "30%", width: 110, height: 110, borderRadius: "50%", border: "1.5px solid rgba(6,182,212,0.12)", pointerEvents: "none" }} />

        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.3rem" }, color: "#fff", lineHeight: 1.25, mb: 1.25, letterSpacing: "-0.02em" }}>
              {pageData.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: "7px", bgcolor: "rgba(255,255,255,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PeopleIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }} />
              </Box>
              <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.825rem", fontFamily: "'Inter', sans-serif" }}>
                <strong style={{ color: "#fff" }}>{pageData.stats.enrolledCount.toLocaleString()}</strong> students enrolled
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            {isEnrolled ? (
              <Chip
                icon={<CheckCircleIcon sx={{ color: "#4ADE80 !important", fontSize: "14px !important" }} />}
                label="Enrolled"
                sx={{ bgcolor: "rgba(22,163,74,0.18)", color: "#4ADE80", fontWeight: 700, fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", border: "1px solid rgba(74,222,128,0.25)" }}
              />
            ) : (
              <Button
                variant="contained"
                onClick={handleEnroll}
                disabled={enrollLoading}
                disableElevation
                sx={{
                  background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                  color: "#0A1628",
                  fontWeight: 800,
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 16px rgba(6,182,212,0.35)",
                  "&:hover": { background: "linear-gradient(135deg, #06B6D4, #06B6D4)", transform: "translateY(-1px)" },
                  "&:disabled": { bgcolor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)" },
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {enrollLoading ? "Enrolling…" : "Enroll Now"}
              </Button>
            )}
          </Box>
        </Box>

        {(enrollSuccess || enrollError) && (
          <Box sx={{ mt: 2, position: "relative", zIndex: 1 }}>
            {enrollSuccess && <Alert severity="success" sx={{ borderRadius: "8px", bgcolor: "rgba(22,163,74,0.18)", color: "#4ADE80", "& .MuiAlert-icon": { color: "#4ADE80" } }}>{enrollSuccess}</Alert>}
            {enrollError && <Alert severity="error" sx={{ borderRadius: "8px" }}>{enrollError}</Alert>}
          </Box>
        )}
      </Box>

      {/* ── Lesson Content ── */}
      <Box sx={{
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        p: { xs: 2.5, sm: 4 },
        mb: 4,
        "& h1": { fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#0A1628", mb: 1.5, mt: 2 },
        "& h2": { fontFamily: "'Sora', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#0A1628", mb: 1, mt: 2 },
        "& h3": { fontFamily: "'Sora', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#0A1628", mb: 1, mt: 1.5 },
        "& p": { mb: 1.5, lineHeight: 1.8, color: "#334155", fontFamily: "'Inter', sans-serif" },
        "& strong": { fontWeight: 700, color: "#0A1628" },
        "& ul, & ol": { pl: 3, mb: 1.5 },
        "& li": { mb: 0.75, lineHeight: 1.75, color: "#334155", fontFamily: "'Inter', sans-serif" },
        "& blockquote": {
          borderLeft: "3px solid #1D4ED8",
          pl: 2.5,
          ml: 0,
          py: 1,
          bgcolor: "rgba(29,78,216,0.04)",
          borderRadius: "0 8px 8px 0",
          color: "#475569",
          fontStyle: "italic",
          fontFamily: "'Inter', sans-serif",
          my: 2,
        },
        "& code": {
          bgcolor: "#F1F5F9",
          px: 0.75,
          py: 0.25,
          borderRadius: "5px",
          fontFamily: "monospace",
          fontSize: "0.875em",
          color: "#1D4ED8",
        },
        "& pre": {
          bgcolor: "#0A1628",
          p: 2.5,
          borderRadius: "10px",
          overflow: "auto",
          mb: 2,
          "& code": { color: "#E2E8F0", bgcolor: "transparent", p: 0 },
        },
        "& img": { maxWidth: "100%", borderRadius: "8px", my: 1 },
      }}
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />

      {/* ── Testimonials ── */}
      <Divider sx={{ mb: 4, borderColor: "#F1F5F9" }} />
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0A1628", letterSpacing: "-0.01em" }}>
            What students say
          </Typography>
          {pageData.testimonials.length > 0 && (
            <Chip
              label={`${pageData.testimonials.length} review${pageData.testimonials.length !== 1 ? "s" : ""}`}
              size="small"
              sx={{ bgcolor: "rgba(29,78,216,0.08)", color: "#1D4ED8", fontWeight: 700, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", border: "1px solid rgba(29,78,216,0.2)" }}
            />
          )}
        </Box>
        <TestimonialsScroller courseId={pageId} initialTestimonials={pageData.testimonials} />
      </Box>
    </Box>
  );
};

export default CoursePageDetail;