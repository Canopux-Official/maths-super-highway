import React, { useCallback, useEffect, useState } from "react";
import { Badge, Box, Button, Dialog, IconButton, Portal, Typography } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { getNewsTicker } from "../api";

interface TickerItem {
    _id: string;
    text: string;
    link: string;
    isLive: boolean;
    createdAt: string;
}

const SEEN_KEY = "announcements-seen"; // remembers "closed" for this browser session
const SLIDE_MS = 5000; // time each announcement stays before sliding

const slide: Variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
};

// Handles the different shapes the API may return
const extractItems = (res: unknown): TickerItem[] => {
    if (Array.isArray(res)) return res as TickerItem[];
    const d = (res as { data?: unknown })?.data;
    if (Array.isArray(d)) return d as TickerItem[];
    const dd = (d as { data?: unknown })?.data;
    return Array.isArray(dd) ? (dd as TickerItem[]) : [];
};

const openLink = (link: string) => {
    if (!link) return;
    const url = link.startsWith("http") ? link : `https://${link}`;
    window.open(url, "_blank", "noopener,noreferrer");
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const LiveBadge = () => (
    <Box
        sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "#EF4444",
            px: 0.9,
            py: 0.2,
            borderRadius: "4px",
            flexShrink: 0,
        }}
    >
        <Box
            sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: "#fff",
                animation: "livePulse 1.2s infinite",
                "@keyframes livePulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
            }}
        />
        <Typography sx={{ fontSize: "0.62rem", color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>
            LIVE
        </Typography>
    </Box>
);

const NewsTicker: React.FC = () => {
    const [news, setNews] = useState<TickerItem[]>([]);
    const [cardOpen, setCardOpen] = useState(false); // centered popup
    const [panelOpen, setPanelOpen] = useState(false); // chat-style list
    const [index, setIndex] = useState(0);
    const [dir, setDir] = useState(1);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getNewsTicker()
            .then((res: unknown) => {
                if (cancelled) return;
                const items = extractItems(res);
                setNews(items);
                let seen = false;
                try {
                    seen = sessionStorage.getItem(SEEN_KEY) === "1";
                } catch {
                    /* storage blocked: treat as not seen */
                }
                if (items.length > 0 && !seen) setCardOpen(true);
            })
            .catch((err) => {
                console.error("Announcements fetch error:", err);
                if (!cancelled) setNews([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const next = useCallback(() => {
        setDir(1);
        setIndex((i) => (i + 1) % news.length);
    }, [news.length]);

    const prev = useCallback(() => {
        setDir(-1);
        setIndex((i) => (i - 1 + news.length) % news.length);
    }, [news.length]);

    const goTo = (i: number) => {
        setDir(i > index ? 1 : -1);
        setIndex(i);
    };

    // Automatic sliding (pauses while the mouse is over the popup)
    useEffect(() => {
        if (!cardOpen || paused || news.length < 2) return;
        const t = setInterval(next, SLIDE_MS);
        return () => clearInterval(t);
    }, [cardOpen, paused, news.length, next, index]);

    const closeCard = () => {
        setCardOpen(false);
        setPaused(false);
        try {
            sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
            /* ignore */
        }
    };

    const viewAll = () => {
        closeCard();
        setPanelOpen(true);
    };

    const toggleLauncher = () => {
        if (cardOpen) closeCard();
        setPanelOpen((p) => !p);
    };

    if (news.length === 0) return null;

    const current = news[Math.min(index, news.length - 1)];

    return (
        <>
            {/* ── Centered popup with blurred background (once per session) ── */}
            <Dialog
                open={cardOpen}
                onClose={closeCard}
                maxWidth="sm"
                fullWidth
                scroll="body"
                aria-labelledby="announcements-title"
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(5,16,29,0.55)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                        },
                    },
                    paper: {
                        sx: {
                            m: 2,
                            width: "100%",
                            maxWidth: 560,
                            borderRadius: "22px",
                            overflow: "hidden",
                            bgcolor: "#05101D",
                            backgroundImage: "none",
                            border: "1px solid rgba(6,182,212,0.4)",
                            boxShadow: "0 30px 90px rgba(0,0,0,0.55), 0 0 60px rgba(6,182,212,0.12)",
                        },
                    },
                }}
            >
                <Box
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    sx={{ position: "relative" }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: { xs: 2.5, sm: 3 },
                            pt: 2.5,
                            pb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "12px",
                                bgcolor: "rgba(6,182,212,0.14)",
                                border: "1px solid rgba(6,182,212,0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <CampaignIcon sx={{ color: "#22D3EE", fontSize: 26 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                id="announcements-title"
                                sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                                    fontFamily: "'Sora', sans-serif",
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.2,
                                }}
                            >
                                Announcements
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", mt: 0.25 }}>
                                {index + 1} of {news.length}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={closeCard}
                            aria-label="Close announcements"
                            sx={{
                                color: "rgba(255,255,255,0.65)",
                                bgcolor: "rgba(255,255,255,0.06)",
                                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.12)" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>

                    {/* Auto-advance progress line */}
                    <Box sx={{ height: 3, bgcolor: "rgba(255,255,255,0.08)" }}>
                        {news.length > 1 && !paused && (
                            <motion.div
                                key={`${index}-${paused}`}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                                style={{ height: "100%", background: "#06B6D4" }}
                            />
                        )}
                    </Box>

                    {/* Sliding body */}
                    <Box sx={{ display: "flex", alignItems: "center", px: { xs: 0.5, sm: 1.5 } }}>
                        {news.length > 1 && (
                            <IconButton
                                onClick={prev}
                                aria-label="Previous announcement"
                                sx={{ color: "#22D3EE", flexShrink: 0 }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        )}

                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 0,
                                overflow: "hidden",
                                minHeight: { xs: 170, sm: 190 },
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <AnimatePresence mode="wait" initial={false} custom={dir}>
                                <motion.div
                                    key={current._id}
                                    custom={dir}
                                    variants={slide}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    style={{ width: "100%" }}
                                >
                                    <Box sx={{ py: 2, px: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
                                            {current.isLive && <LiveBadge />}
                                            {formatDate(current.createdAt) && (
                                                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>
                                                    {formatDate(current.createdAt)}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: "#F8FAFC",
                                                fontWeight: 600,
                                                fontSize: { xs: "1.05rem", sm: "1.25rem" },
                                                lineHeight: 1.5,
                                                fontFamily: "'Inter', sans-serif",
                                                wordBreak: "break-word",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 5,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {current.text}
                                        </Typography>
                                        {current.link && (
                                            <Button
                                                onClick={() => openLink(current.link)}
                                                endIcon={<OpenInNewIcon sx={{ fontSize: "15px !important" }} />}
                                                sx={{
                                                    mt: 1.5,
                                                    px: 0,
                                                    color: "#22D3EE",
                                                    fontWeight: 600,
                                                    textTransform: "none",
                                                    "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                                                }}
                                            >
                                                Read more
                                            </Button>
                                        )}
                                    </Box>
                                </motion.div>
                            </AnimatePresence>
                        </Box>

                        {news.length > 1 && (
                            <IconButton
                                onClick={next}
                                aria-label="Next announcement"
                                sx={{ color: "#22D3EE", flexShrink: 0 }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        )}
                    </Box>

                    {/* Dots */}
                    {news.length > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, pb: 1.5 }}>
                            {news.map((n, i) => (
                                <Box
                                    key={n._id}
                                    onClick={() => goTo(i)}
                                    sx={{
                                        width: i === index ? 20 : 7,
                                        height: 7,
                                        borderRadius: 4,
                                        bgcolor: i === index ? "#06B6D4" : "rgba(255,255,255,0.22)",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Footer actions */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.25,
                            px: { xs: 2.5, sm: 3 },
                            py: 2,
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            flexDirection: { xs: "column-reverse", sm: "row" },
                            justifyContent: "flex-end",
                        }}
                    >
                        {news.length > 1 && (
                            <Button
                                onClick={viewAll}
                                startIcon={<FormatListBulletedIcon />}
                                sx={{
                                    color: "#22D3EE",
                                    border: "1px solid rgba(6,182,212,0.4)",
                                    borderRadius: "10px",
                                    px: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": { bgcolor: "rgba(6,182,212,0.1)" },
                                }}
                            >
                                View all ({news.length})
                            </Button>
                        )}
                        <Button
                            onClick={closeCard}
                            variant="contained"
                            sx={{
                                background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                                color: "#0A1628",
                                borderRadius: "10px",
                                px: 3,
                                textTransform: "none",
                                fontWeight: 700,
                                boxShadow: "0 4px 18px rgba(6,182,212,0.35)",
                                "&:hover": { background: "linear-gradient(135deg, #22D3EE, #06B6D4)" },
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            <Portal>
                {/* ── Chat-style panel with every announcement ── */}
                <AnimatePresence>
                    {panelOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                right: 16,
                                bottom: 88,
                                zIndex: 1250,
                                width: "min(380px, calc(100vw - 32px))",
                                transformOrigin: "bottom right",
                            }}
                            role="dialog"
                            aria-label="All announcements"
                        >
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
                                    border: "1px solid #E2E8F0",
                                    display: "flex",
                                    flexDirection: "column",
                                    maxHeight: "70vh",
                                }}
                            >
                                <Box sx={{ bgcolor: "#0A1628", px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                                    <CampaignIcon sx={{ color: "#22D3EE" }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Sora', sans-serif" }}>
                                            Announcements
                                        </Typography>
                                        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>
                                            {news.length} update{news.length === 1 ? "" : "s"}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => setPanelOpen(false)}
                                        aria-label="Close announcements list"
                                        sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}
                                    >
                                        <CloseIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>

                                <Box sx={{ p: 1.5, overflowY: "auto", bgcolor: "#F8FAFC", display: "flex", flexDirection: "column", gap: 1.25 }}>
                                    {news.map((item) => (
                                        <Box
                                            key={item._id}
                                            sx={{
                                                alignSelf: "flex-start",
                                                maxWidth: "92%",
                                                bgcolor: "#fff",
                                                border: "1px solid #E2E8F0",
                                                borderRadius: "4px 14px 14px 14px",
                                                px: 1.5,
                                                py: 1,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                                                {item.isLive && <LiveBadge />}
                                                {formatDate(item.createdAt) && (
                                                    <Typography sx={{ color: "#94A3B8", fontSize: "0.7rem" }}>
                                                        {formatDate(item.createdAt)}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography sx={{ color: "#0A1628", fontSize: "0.9rem", lineHeight: 1.5, wordBreak: "break-word" }}>
                                                {item.text}
                                            </Typography>
                                            {item.link && (
                                                <Box
                                                    component="button"
                                                    onClick={() => openLink(item.link)}
                                                    sx={{
                                                        mt: 0.5,
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        border: 0,
                                                        background: "none",
                                                        p: 0,
                                                        cursor: "pointer",
                                                        color: "#0891B2",
                                                        fontSize: "0.78rem",
                                                        fontWeight: 600,
                                                        "&:hover": { textDecoration: "underline" },
                                                    }}
                                                >
                                                    Open link <OpenInNewIcon sx={{ fontSize: 13 }} />
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Floating chat-style button ── */}
                <Box
                    component="button"
                    onClick={toggleLauncher}
                    aria-label={panelOpen ? "Close announcements" : "Open announcements"}
                    sx={{
                        position: "fixed",
                        right: 16,
                        bottom: 20,
                        zIndex: 1250,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                        color: "#0A1628",
                        boxShadow: "0 8px 24px rgba(6,182,212,0.45)",
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "scale(1.08)" },
                    }}
                >
                    {panelOpen ? (
                        <CloseIcon />
                    ) : (
                        <Badge badgeContent={news.length} color="error" max={9}>
                            <CampaignIcon sx={{ color: "#0A1628" }} />
                        </Badge>
                    )}
                </Box>
            </Portal>
        </>
    );
};

export default NewsTicker;