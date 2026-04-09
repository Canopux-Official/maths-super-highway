import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  CircularProgress,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

interface Testimonial {
  _id: string;
  rating: number;
  comment?: string;
  message?: string;
  createdAt: string;
  user: { name: string };
}

interface Props {
  courseId: string;
  initialTestimonials: Testimonial[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "#1565C0",
  "#2E7D32",
  "#6A1B9A",
  "#AD1457",
  "#00838F",
  "#EF6C00",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const TestimonialsScroller: React.FC<Props> = ({ courseId, initialTestimonials }) => {
  const [items, setItems] = useState<Testimonial[]>(initialTestimonials || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTestimonials?.length === 10);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialTestimonials || []);
    setPage(1);
    setHasMore((initialTestimonials || []).length === 10);
  }, [courseId]);

  useEffect(() => {
    if (!hasMore || page === 1) return;
    const load = async () => {
      setLoadingMore(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/user/courses/page/${courseId}/testimonials?page=${page}&limit=10`
        );
        const json = await res.json();
        const newItems = json.data || [];
        setItems((prev) => [...prev, ...newItems]);
        setHasMore(newItems.length === 10);
      } catch {
        // silently fail
      } finally {
        setLoadingMore(false);
      }
    };
    load();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  if (items.length === 0) {
    return (
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          py: 5,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">No reviews yet. Be the first to share your experience!</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {items.map((t) => {
          const name = t.user?.name || "Student";
          const text = t.comment || t.message || "";
          return (
            <Box
              key={t._id}
              sx={{
                width: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(33.333% - 11px)" },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <FormatQuoteIcon sx={{ fontSize: 20, color: "primary.light" }} />
              <Typography
                variant="body2"
                sx={{ color: "text.primary", lineHeight: 1.65, flex: 1 }}
              >
                {text}
              </Typography>
              <Rating value={t.rating} readOnly size="small" />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.75rem",
                    bgcolor: avatarColor(name),
                  }}
                >
                  {getInitials(name)}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", color: "text.secondary" }}
                  >
                    {new Date(t.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Infinite scroll trigger */}
      <Box ref={loaderRef} sx={{ mt: 3, textAlign: "center" }}>
        {loadingMore && <CircularProgress size={24} />}
        {!hasMore && items.length > 0 && (
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            All reviews loaded
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TestimonialsScroller;