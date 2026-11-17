import React, { useCallback, useState } from "react";
import { Box, Typography, IconButton, Skeleton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import {
    motion,
    AnimatePresence,
    useAnimationFrame,
    useMotionValue,
    useTransform,
    useReducedMotion,
} from "framer-motion";
import { useHeadlines, isNew, toUrl, formatDate, timeAgo, LATEST_UPDATES_ID } from "../news";

/** How long each headline stays featured before rotating. */
const ROTATE_MS = 7000;
/** Above this many headlines, a single progress bar replaces the per-item segments. */
const MAX_SEGMENTS = 8;
const UP_NEXT_COUNT = 3;

/** Palette for this panel (dark surface on the dark hero). */
const C = {
    surface: "#0F1B2E",
    surfaceAlt: "#0B1626",
    border: "rgba(255,255,255,0.08)",
    text: "#F1F5F9",
    muted: "rgba(226,232,240,0.62)",
    faint: "rgba(226,232,240,0.4)",
    accent: "#22D3EE",
    live: "#F87171",
    liveStrong: "#EF4444",
};

const ctrlSx = {
    width: 32,
    height: 32,
    color: C.muted,
    borderRadius: "8px",
    transition: "background-color 150ms, color 150ms",
    "&:hover": { bgcolor: "rgba(255,255,255,0.06)", color: C.text },
    "&:focus-visible": { outline: `2px solid ${C.accent}`, outlineOffset: 1 },
};

const LiveUpdates: React.FC = () => {
    const { data: items = [], isLoading: loading } = useHeadlines();
    const [activeRaw, setActive] = useState(0);
    const [direction, setDirection] = useState(1);
    const [hovered, setHovered] = useState(false);
    const reduceMotion = useReducedMotion();
    // null = user hasn't touched the pause button; then reduced-motion users start paused
    const [userStopped, setUserStopped] = useState<boolean | null>(null);
    const stopped = userStopped ?? !!reduceMotion;
    const setStopped = (fn: (s: boolean) => boolean) => setUserStopped(fn(stopped));

    // Stay in range if the list shrinks after a refetch
    const active = items.length ? activeRaw % items.length : 0;

    const progress = useMotionValue(0);
    const progressWidth = useTransform(progress, (v) => `${v * 100}%`);

    const goTo = useCallback(
        (index: number, dir: number) => {
            if (items.length === 0) return;
            setDirection(dir);
            setActive(((index % items.length) + items.length) % items.length);
            progress.set(0);
        },
        [items.length, progress]
    );

    useAnimationFrame((_, delta) => {
        if (items.length < 2 || hovered || stopped) return;
        const next = progress.get() + delta / ROTATE_MS;
        if (next >= 1) goTo(active + 1, 1);
        else progress.set(next);
    });

    const current = items[active];
    const upNext = Array.from({ length: Math.min(UP_NEXT_COUNT, Math.max(0, items.length - 1)) }, (_, i) => {
        const index = (active + 1 + i) % items.length;
        return { item: items[index], index };
    });
    const useSegments = items.length > 1 && items.length <= MAX_SEGMENTS;

    return (
        <Box
            component="section"
            id={LATEST_UPDATES_ID}
            aria-label="Latest updates"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            sx={{
                width: "100%",
                scrollMarginTop: "96px",
                borderRadius: "14px",
                overflow: "hidden",
                bgcolor: C.surface,
                border: `1px solid ${C.border}`,
                boxShadow: "0 20px 50px rgba(2,8,20,0.45)",
            }}
        >
            {/* Top accent bar with a slow shimmer */}
            <Box
                aria-hidden
                sx={{
                    height: 3,
                    background: `linear-gradient(90deg, ${C.liveStrong} 0%, ${C.live} 30%, ${C.accent} 70%, ${C.liveStrong} 100%)`,
                    backgroundSize: "200% 100%",
                    animation: "accentSlide 6s linear infinite",
                    "@keyframes accentSlide": {
                        "0%": { backgroundPosition: "0% 0" },
                        "100%": { backgroundPosition: "200% 0" },
                    },
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
            />

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 2.25, sm: 3 },
                    pt: 2.25,
                    pb: 1.75,
                    background: "linear-gradient(180deg, rgba(239,68,68,0.08) 0%, transparent 100%)",
                }}
            >
                {/* LIVE tag */}
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1,
                        py: 0.4,
                        mr: 0.5,
                        borderRadius: "6px",
                        bgcolor: C.liveStrong,
                        boxShadow: "0 0 0 0 rgba(239,68,68,0.55)",
                        animation: "liveTagPulse 2.2s ease-out infinite",
                        "@keyframes liveTagPulse": {
                            "0%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.55)" },
                            "70%": { boxShadow: "0 0 0 8px rgba(239,68,68,0)" },
                            "100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0)" },
                        },
                        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    }}
                >
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "#fff",
                            animation: "liveDotBlink 1.2s ease-in-out infinite",
                            "@keyframes liveDotBlink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
                            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                        }}
                    />
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.12em", lineHeight: 1 }}>
                        LIVE
                    </Typography>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ color: C.text, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                        Latest updates
                    </Typography>
                    {items.length > 0 && (
                        <Typography sx={{ color: C.faint, fontSize: "0.75rem", mt: 0.25 }}>
                            {items.length} {items.length === 1 ? "announcement" : "announcements"}
                            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}> from the academy</Box>
                        </Typography>
                    )}
                </Box>
                {items.length > 1 && (
                    <>
                        <Typography sx={{ display: { xs: "none", sm: "block" }, color: C.faint, fontSize: "0.8rem", fontVariantNumeric: "tabular-nums", mr: 0.5 }}>
                            {active + 1} of {items.length}
                        </Typography>
                        <IconButton aria-label="Previous update" size="small" onClick={() => goTo(active - 1, -1)} sx={ctrlSx}>
                            <ChevronLeftIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            aria-label={stopped ? "Resume auto-play" : "Pause auto-play"}
                            size="small"
                            onClick={() => setStopped((s) => !s)}
                            sx={ctrlSx}
                        >
                            {stopped ? <PlayArrowIcon sx={{ fontSize: 18 }} /> : <PauseIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                        <IconButton aria-label="Next update" size="small" onClick={() => goTo(active + 1, 1)} sx={ctrlSx}>
                            <ChevronRightIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Progress */}
            {items.length > 1 && (
                <Box sx={{ display: "flex", gap: 0.5, px: { xs: 2.25, sm: 3 } }}>
                    {(useSegments ? items : [items[0]]).map((item, i) => {
                        const isActive = useSegments ? i === active : true;
                        const isDone = useSegments && i < active;
                        return (
                            <Box
                                key={item._id}
                                role={useSegments ? "button" : undefined}
                                aria-label={useSegments ? `Show update ${i + 1}` : undefined}
                                onClick={useSegments ? () => goTo(i, i > active ? 1 : -1) : undefined}
                                sx={{ flex: 1, py: 0.75, cursor: useSegments ? "pointer" : "default" }}
                            >
                                <Box sx={{ height: 2, borderRadius: 1, overflow: "hidden", bgcolor: "rgba(255,255,255,0.1)" }}>
                                    {isActive ? (
                                        <motion.div style={{ width: stopped ? "100%" : progressWidth, height: "100%", background: C.text, opacity: 0.85 }} />
                                    ) : (
                                        <Box sx={{ width: isDone ? "100%" : 0, height: "100%", bgcolor: "rgba(255,255,255,0.45)" }} />
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Featured headline */}
            <Box aria-live="polite" sx={{ position: "relative", px: { xs: 2.25, sm: 3 }, pt: 2.5, pb: 3, minHeight: { xs: 170, sm: 190 } }}>
                {loading ? (
                    <Box>
                        <Skeleton width={140} height={20} sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
                        <Skeleton height={32} sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
                        <Skeleton width="75%" height={32} sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
                    </Box>
                ) : !current ? (
                    <Box sx={{ py: 2 }}>
                        <Typography sx={{ color: C.text, fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>No announcements right now</Typography>
                        <Typography sx={{ color: C.muted, fontSize: "0.9rem", mt: 0.5 }}>
                            New batches, schedules and results will be posted here.
                        </Typography>
                    </Box>
                ) : (
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={current._id}
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -12 }}
                            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
                                {isNew(current.createdAt) && (
                                    <>
                                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: C.live }} />
                                        <Typography sx={{ color: C.live, fontSize: "0.8rem", fontWeight: 600 }}>New</Typography>
                                        <Typography sx={{ color: C.faint, fontSize: "0.8rem" }}>·</Typography>
                                    </>
                                )}
                                <Typography sx={{ color: C.faint, fontSize: "0.8rem" }}>{timeAgo(current.createdAt)}</Typography>
                            </Box>

                            <Typography
                                sx={{
                                    color: C.text,
                                    fontFamily: "'Sora', sans-serif",
                                    fontWeight: 600,
                                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                                    lineHeight: 1.4,
                                    letterSpacing: "-0.01em",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {current.text}
                            </Typography>

                            {current.link && (
                                <Box
                                    component="a"
                                    href={toUrl(current.link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        mt: 2,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        color: C.accent,
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        textDecoration: "underline",
                                        textDecorationColor: "rgba(34,211,238,0.35)",
                                        textUnderlineOffset: "4px",
                                        transition: "text-decoration-color 150ms",
                                        "&:hover": { textDecorationColor: C.accent },
                                    }}
                                >
                                    Read the full notice
                                    <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </Box>

            {/* Up next */}
            {upNext.length > 0 && (
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, py: 0.75, bgcolor: C.surfaceAlt, borderTop: `1px solid ${C.border}` }}>
                    {upNext.map(({ item, index }) => (
                        <Box component="li" key={item._id}>
                            <Box
                                component="button"
                                type="button"
                                onClick={() => goTo(index, 1)}
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: 2,
                                    px: { xs: 2.25, sm: 3 },
                                    py: 1.1,
                                    border: 0,
                                    background: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    font: "inherit",
                                    transition: "background-color 150ms",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                                    "&:hover .up-text": { color: C.text },
                                    "&:focus-visible": { outline: `2px solid ${C.accent}`, outlineOffset: -2 },
                                }}
                            >
                                <Typography sx={{ width: 48, flexShrink: 0, color: C.faint, fontSize: "0.78rem", fontVariantNumeric: "tabular-nums" }}>
                                    {formatDate(item.createdAt)}
                                </Typography>
                                <Typography
                                    className="up-text"
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        color: C.muted,
                                        fontSize: "0.9rem",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        transition: "color 150ms",
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default LiveUpdates;
