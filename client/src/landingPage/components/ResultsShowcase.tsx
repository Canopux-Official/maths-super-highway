import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Container, Typography, IconButton, Dialog, Skeleton, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import axios from "axios";

interface ResultImage {
    _id: string;
    imageUrl: string;
    title?: string;
    studentName?: string;
    exam?: string;
    score?: string;
    order?: number;
}

/** Main line: the student's name, falling back to the older free-text title. */
const headingOf = (r: ResultImage) => r.studentName?.trim() || r.title?.trim() || "Outstanding result";
/** Second line: "JEE Advanced 2026 · AIR 112" (empty if neither is set). */
const detailOf = (r: ResultImage) => [r.exam?.trim(), r.score?.trim()].filter(Boolean).join(" · ");
const labelOf = (r: ResultImage) => [headingOf(r), detailOf(r)].filter(Boolean).join(", ");

const AUTOPLAY_MS = 4000;
const GAP_PX = 20;

/** 1 card (peeking) on phones, 2 on tablets, 3 on desktop. */
const slideSx = {
    flex: {
        xs: "0 0 85%",
        sm: `0 0 calc(50% - ${GAP_PX / 2}px)`,
        md: `0 0 calc((100% - ${GAP_PX * 2}px) / 3)`,
    },
};

const arrowSx = {
    width: 44,
    height: 44,
    color: "#0A1628",
    bgcolor: "#fff",
    border: "1px solid #E2E8F0",
    boxShadow: "0 2px 8px rgba(10,22,40,0.06)",
    transition: "all 0.2s ease",
    "&:hover": { bgcolor: "#0A1628", color: "#fff", borderColor: "#0A1628" },
    "&.Mui-disabled": { opacity: 0.4, bgcolor: "#fff" },
};

const ResultsShowcase: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const [results, setResults] = useState<ResultImage[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [hovered, setHovered] = useState(false);
    const [inView, setInView] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const [lbDirection, setLbDirection] = useState(1);
    const reduceMotion = useReducedMotion();

    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        axios
            .get(`${apiUrl}/results`)
            .then((res) => {
                if (cancelled || !res.data?.success) return;
                const data: ResultImage[] = res.data.data || [];
                setResults([...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
            })
            .catch(() => {})
            .finally(() => !cancelled && setLoaded(true));
        return () => {
            cancelled = true;
        };
    }, [apiUrl]);

    /** Width of one card plus the gap — one "step" of the carousel. */
    const stepWidth = () => {
        const track = trackRef.current;
        const card = track?.firstElementChild as HTMLElement | null;
        return card ? card.offsetWidth + GAP_PX : 1;
    };

    const syncPagination = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const step = stepWidth();
        const maxScroll = track.scrollWidth - track.clientWidth;
        setPageCount(Math.max(1, Math.round(maxScroll / step) + 1));
        setPage(Math.round(track.scrollLeft / step));
    }, []);

    useEffect(() => {
        syncPagination();
        window.addEventListener("resize", syncPagination);
        return () => window.removeEventListener("resize", syncPagination);
    }, [results.length, syncPagination]);

    // Only autoplay while the section is on screen
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
                if (entry.isIntersecting) setRevealed(true);
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [loaded]);

    const scrollToPage = useCallback((target: number) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollTo({ left: target * stepWidth(), behavior: "smooth" });
    }, []);

    const next = useCallback(() => scrollToPage(page + 1 >= pageCount ? 0 : page + 1), [page, pageCount, scrollToPage]);
    const prev = useCallback(() => scrollToPage(page - 1 < 0 ? pageCount - 1 : page - 1), [page, pageCount, scrollToPage]);

    useEffect(() => {
        if (pageCount < 2 || hovered || !inView || lightbox !== null || reduceMotion) return;
        const t = setTimeout(next, AUTOPLAY_MS);
        return () => clearTimeout(t);
    }, [page, pageCount, hovered, inView, lightbox, reduceMotion, next]);

    const openLightbox = (i: number) => {
        setLbDirection(1);
        setLightbox(i);
    };
    const stepLightbox = (delta: number) => {
        setLbDirection(delta);
        setLightbox((i) => (i === null ? i : (i + delta + results.length) % results.length));
    };

    // Nothing to celebrate yet → keep the page clean.
    if (loaded && results.length === 0) return null;

    const active = lightbox !== null ? results[lightbox] : null;

    return (
        <Box
            component="section"
            id="results"
            ref={sectionRef}
            sx={{
                position: "relative",
                py: { xs: 8, md: 11 },
                bgcolor: "#F8FAFC",
                overflow: "hidden",
                scrollMarginTop: "88px",
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative" }}>
                {/* Heading */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ mb: { xs: 4, md: 5 }, alignItems: { md: "flex-end" }, justifyContent: "space-between" }}
                >
                    <Box sx={{ maxWidth: 620 }}>
                        <Typography sx={{ color: "#0891B2", fontWeight: 600, fontSize: "0.9rem", mb: 1 }}>
                            Hall of Excellence
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 700,
                                color: "#0A1628",
                                fontSize: { xs: "1.75rem", md: "2.25rem" },
                                letterSpacing: "-0.025em",
                                lineHeight: 1.15,
                                mb: 1.5,
                            }}
                        >
                            Recent results from our students
                        </Typography>
                        <Typography sx={{ color: "#475569", fontSize: "1rem", lineHeight: 1.7 }}>
                            Score cards and certificates shared by our students. Select one to see it full size.
                        </Typography>
                    </Box>

                    {pageCount > 1 && (
                        <Stack direction="row" spacing={1.25} sx={{ flexShrink: 0 }}>
                            <IconButton aria-label="Previous results" onClick={prev} sx={arrowSx}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton aria-label="Next results" onClick={next} sx={arrowSx}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>

                {/* Track */}
                <Box
                    ref={trackRef}
                    onScroll={syncPagination}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onTouchStart={() => setHovered(true)}
                    onTouchEnd={() => setHovered(false)}
                    sx={{
                        display: "flex",
                        gap: `${GAP_PX}px`,
                        overflowX: "auto",
                        scrollSnapType: "x mandatory",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                        // room for hover lift + shadow without clipping
                        py: 1.5,
                        my: -1.5,
                    }}
                >
                    {!loaded
                        ? [0, 1, 2].map((i) => (
                              <Box key={i} sx={slideSx}>
                                  <Skeleton variant="rounded" sx={{ width: "100%", height: "auto", aspectRatio: "4 / 3", borderRadius: "12px" }} />
                                  <Skeleton width="60%" sx={{ mt: 1.5 }} />
                              </Box>
                          ))
                        : results.map((r, i) => (
                              <Box key={r._id} sx={{ ...slideSx, scrollSnapAlign: "start" }}>
                              <motion.div
                                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                                  animate={revealed || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                                  transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                              >
                                  <Box
                                      component="button"
                                      type="button"
                                      onClick={() => openLightbox(i)}
                                      aria-label={`View result: ${labelOf(r)}`}
                                      sx={{
                                          display: "block",
                                          width: "100%",
                                          p: 0,
                                          border: "1px solid #E2E8F0",
                                          borderRadius: "12px",
                                          bgcolor: "#fff",
                                          overflow: "hidden",
                                          cursor: "zoom-in",
                                          textAlign: "left",
                                          font: "inherit",
                                          transition: "box-shadow 200ms, border-color 200ms",
                                          "&:hover": { boxShadow: "0 10px 28px rgba(10,22,40,0.10)", borderColor: "#CBD5E1" },
                                          "&:focus-visible": { outline: "2px solid #0891B2", outlineOffset: 2 },
                                          "&:hover .zoom-chip, &:focus-visible .zoom-chip": { opacity: 1 },
                                      }}
                                  >
                                      <Box
                                          sx={{
                                              position: "relative",
                                              aspectRatio: "4 / 3",
                                              bgcolor: "#F1F5F9",
                                              overflow: "hidden",
                                              borderBottom: "1px solid #E2E8F0",
                                          }}
                                      >
                                          <Box
                                              component="img"
                                              src={r.imageUrl}
                                              alt={`Result card: ${labelOf(r)}`}
                                              loading="lazy"
                                              draggable={false}
                                              sx={{
                                                  width: "100%",
                                                  height: "100%",
                                                  objectFit: "contain",
                                                  display: "block",
                                              }}
                                          />
                                          <Box
                                              className="zoom-chip"
                                              sx={{
                                                  position: "absolute",
                                                  top: 12,
                                                  right: 12,
                                                  width: 36,
                                                  height: 36,
                                                  borderRadius: "10px",
                                                  display: "grid",
                                                  placeItems: "center",
                                                  bgcolor: "rgba(255,255,255,0.92)",
                                                  color: "#0A1628",
                                                  opacity: 0,
                                                  boxShadow: "0 1px 3px rgba(10,22,40,0.15)",
                                                  transition: "opacity 150ms",
                                              }}
                                          >
                                              <ZoomOutMapIcon sx={{ fontSize: 18 }} />
                                          </Box>
                                      </Box>
                                      <Box sx={{ px: 2, py: 1.5 }}>
                                          <Typography
                                              sx={{
                                                  color: "#0A1628",
                                                  fontWeight: 600,
                                                  fontSize: "0.95rem",
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                              }}
                                          >
                                              {headingOf(r)}
                                          </Typography>
                                          {detailOf(r) && (
                                              <Typography
                                                  sx={{
                                                      mt: 0.25,
                                                      color: "#0891B2",
                                                      fontWeight: 600,
                                                      fontSize: "0.85rem",
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                  }}
                                              >
                                                  {detailOf(r)}
                                              </Typography>
                                          )}
                                      </Box>
                                  </Box>
                              </motion.div>
                              </Box>
                          ))}
                </Box>

                {/* Pagination */}
                {loaded && pageCount > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 4 }}>
                        {Array.from({ length: pageCount }, (_, i) => (
                            <Box
                                key={i}
                                component="button"
                                type="button"
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === page}
                                onClick={() => scrollToPage(i)}
                                sx={{
                                    p: 0,
                                    border: 0,
                                    cursor: "pointer",
                                    height: 8,
                                    width: i === page ? 28 : 8,
                                    borderRadius: 4,
                                    bgcolor: i === page ? "#0891B2" : "#CBD5E1",
                                    transition: "all 0.3s ease",
                                    "&:hover": { bgcolor: i === page ? "#0891B2" : "#94A3B8" },
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Container>

            {/* Lightbox */}
            <Dialog
                open={lightbox !== null}
                onClose={() => setLightbox(null)}
                maxWidth="lg"
                fullWidth
                sx={{ "& .MuiDialog-container, & .MuiDialog-paper": { outline: "none" } }}
                onKeyDown={(e) => {
                    if (results.length < 2) return;
                    if (e.key === "ArrowRight") stepLightbox(1);
                    if (e.key === "ArrowLeft") stepLightbox(-1);
                }}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: "#05101D",
                            backgroundImage: "none",
                            borderRadius: "20px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            overflow: "hidden",
                            m: { xs: 1.5, sm: 4 },
                            width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" },
                        },
                    },
                    backdrop: { sx: { bgcolor: "rgba(5,16,29,0.85)", backdropFilter: "blur(6px)" } },
                }}
            >
                {active && (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: { xs: 2, sm: 3 },
                                py: 1.75,
                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <WorkspacePremiumOutlinedIcon sx={{ color: "#22D3EE" }} />
                            <Typography
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontFamily: "'Sora', sans-serif",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {headingOf(active)}
                                {detailOf(active) && (
                                    <Box component="span" sx={{ color: "rgba(255,255,255,0.55)", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                                        {"  ·  "}
                                        {detailOf(active)}
                                    </Box>
                                )}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", fontVariantNumeric: "tabular-nums" }}>
                                {(lightbox ?? 0) + 1} / {results.length}
                            </Typography>
                            <IconButton aria-label="Close" onClick={() => setLightbox(null)} sx={{ color: "rgba(255,255,255,0.7)" }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ position: "relative", height: { xs: "60vh", md: "75vh" }, overflow: "hidden" }}>
                            <AnimatePresence initial={false} custom={lbDirection} mode="popLayout">
                                <motion.img
                                    key={active._id}
                                    src={active.imageUrl}
                                    alt={`Result card: ${labelOf(active)}`}
                                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: lbDirection * 60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: lbDirection * -60 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    draggable={false}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        padding: 16,
                                        boxSizing: "border-box",
                                    }}
                                />
                            </AnimatePresence>
                            {results.length > 1 && (
                                <>
                                    <IconButton
                                        aria-label="Previous result"
                                        onClick={() => stepLightbox(-1)}
                                        sx={{ ...lightboxArrowSx, left: { xs: 8, sm: 16 } }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Next result"
                                        onClick={() => stepLightbox(1)}
                                        sx={{ ...lightboxArrowSx, right: { xs: 8, sm: 16 } }}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

const lightboxArrowSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 46,
    height: 46,
    color: "#fff",
    bgcolor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    "&:hover": { bgcolor: "rgba(6,182,212,0.25)", borderColor: "rgba(6,182,212,0.6)" },
} as const;

export default ResultsShowcase;
