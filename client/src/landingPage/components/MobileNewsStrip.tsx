import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useHeadlines, LATEST_UPDATES_ID } from "../news";

const ROTATE_MS = 4500;

/**
 * Phones only: one line under the navbar with the latest headline, so news is
 * visible without scrolling. Tapping it scrolls to the full "Latest updates"
 * panel; it tucks itself away while that panel is on screen.
 */
const MobileNewsStrip: React.FC = () => {
    const { data: items = [] } = useHeadlines();
    const [index, setIndex] = useState(0);
    const [panelVisible, setPanelVisible] = useState(false);
    const reduceMotion = useReducedMotion();

    // Rotate headlines
    useEffect(() => {
        if (items.length < 2 || reduceMotion || panelVisible) return;
        const t = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS);
        return () => clearInterval(t);
    }, [items.length, reduceMotion, panelVisible]);

    // Hide while the full panel is on screen
    useEffect(() => {
        if (items.length === 0) return;
        const panel = document.getElementById(LATEST_UPDATES_ID);
        if (!panel) return;
        const observer = new IntersectionObserver(([entry]) => setPanelVisible(entry.isIntersecting), { threshold: 0.25 });
        observer.observe(panel);
        return () => observer.disconnect();
    }, [items.length]);

    if (items.length === 0) return null;
    const item = items[index % items.length];

    const goToPanel = () => {
        document.getElementById(LATEST_UPDATES_ID)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    };

    return (
        <Box sx={{ display: { xs: "block", md: "none" } }}>
            <AnimatePresence initial={false}>
                {!panelVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                        style={{ overflow: "hidden" }}
                    >
                        <Box
                            component="button"
                            type="button"
                            onClick={goToPanel}
                            aria-label={`Latest update: ${item.text}. Show all updates`}
                            sx={{
                                width: "100%",
                                height: 42,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.25,
                                px: 2,
                                border: 0,
                                borderTop: "1px solid rgba(255,255,255,0.06)",
                                bgcolor: "#0F1B2E",
                                backgroundImage: "linear-gradient(90deg, rgba(239,68,68,0.14) 0%, transparent 45%)",
                                cursor: "pointer",
                                font: "inherit",
                                textAlign: "left",
                                "&:focus-visible": { outline: "2px solid #22D3EE", outlineOffset: -2 },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.6,
                                    px: 0.9,
                                    py: 0.35,
                                    borderRadius: "5px",
                                    bgcolor: "#EF4444",
                                    flexShrink: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        bgcolor: "#fff",
                                        animation: "stripBlink 1.2s ease-in-out infinite",
                                        "@keyframes stripBlink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
                                        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                                    }}
                                />
                                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.6rem", letterSpacing: "0.12em", lineHeight: 1 }}>
                                    LIVE
                                </Typography>
                            </Box>

                            <Box sx={{ position: "relative", flex: 1, minWidth: 0, height: 20, overflow: "hidden" }}>
                                <AnimatePresence initial={false} mode="popLayout">
                                    <motion.div
                                        key={item._id}
                                        initial={reduceMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={reduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#F1F5F9",
                                                fontSize: "0.84rem",
                                                fontWeight: 500,
                                                lineHeight: "20px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {item.text}
                                        </Typography>
                                    </motion.div>
                                </AnimatePresence>
                            </Box>

                            <ChevronRightIcon sx={{ fontSize: 20, color: "#22D3EE", flexShrink: 0 }} />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default MobileNewsStrip;
