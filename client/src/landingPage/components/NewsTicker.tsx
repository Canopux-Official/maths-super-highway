import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { getNewsTicker } from "../api";

interface TickerItem {
    _id: string;
    text: string;
    link: string;
    isLive: boolean;
    createdAt: string;
}

const NewsTicker: React.FC = () => {
    const [news, setNews] = useState<TickerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [contentWidth, setContentWidth] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const isPaused = useRef(false);

    useEffect(() => {
        getNewsTicker()
            .then((res: any) => {
                const apiItems = res?.data?.data || res?.data || [];
                setNews(apiItems);
            })
            .catch((err) => {
                console.error("Ticker Fetch Error:", err);
                setNews([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (contentRef.current && news.length > 0) {
            setTimeout(() => {
                if (contentRef.current) {
                    const w = contentRef.current.scrollWidth / 2;
                    setContentWidth(w);
                    x.set(window.innerWidth);
                }
            }, 100);
        }
    }, [news]);

    useAnimationFrame((_, delta) => {
        if (contentWidth === 0 || isPaused.current) return;
        const speed = 0.08;
        const current = x.get();
        const next = current - delta * speed;
        if (next <= -contentWidth) {
            x.set(window.innerWidth);
        } else {
            x.set(next);
        }
    });

    const handleItemClick = (link: string) => {
        if (!link) return;
        const url = link.startsWith("http") ? link : `https://${link}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    if (loading) {
        return (
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1100 }}>
                <Skeleton variant="rectangular" width="100%" height={38} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
            </Box>
        );
    }

    if (news.length === 0) return null;

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 1100,
                bgcolor: "#ffffff",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                height: 38,
                overflow: "hidden",
            }}
        >
            {/* Static LIVE NEWS label */}
            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    bgcolor: "#1a3d2e",
                    px: 1.8,
                    height: "100%",
                    zIndex: 2,
                    boxShadow: "4px 0 8px rgba(0,0,0,0.15)",
                }}
            >
                <CampaignIcon sx={{ fontSize: 16, color: "#86efac" }} />
                <Typography
                    sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
                        whiteSpace: "nowrap",
                    }}
                >
                    LIVE NEWS
                </Typography>
            </Box>

            {/* Scrolling area */}
            <Box
                sx={{ flex: 1, overflow: "hidden", height: "100%", position: "relative" }}
            >
                <motion.div
                    ref={contentRef}
                    style={{
                        x,
                        display: "inline-flex",
                        alignItems: "center",
                        height: "100%",
                        whiteSpace: "nowrap",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        willChange: "transform",
                    }}
                >
                    {/* Render TWICE for seamless loop */}
                    {[0, 1].map((copyIndex) =>
                        news.map((item) => (
                            <Box
                                key={`${copyIndex}-${item._id}`}
                                onClick={() => handleItemClick(item.link)}
                                onMouseEnter={() => { isPaused.current = true; }}
                                onMouseLeave={() => { isPaused.current = false; }}
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 3,
                                    cursor: item.link ? "pointer" : "default",
                                    "&:hover .ticker-text": {
                                        color: "#1a3d2e",
                                        textDecoration: item.link ? "underline" : "none",
                                    },
                                    "&:hover .ticker-icon": {
                                        opacity: 1,
                                    },
                                }}
                            >
                                {/* Dot separator */}
                                <FiberManualRecordIcon
                                    sx={{ fontSize: 7, color: "#1a3d2e", flexShrink: 0 }}
                                />

                                {/* isLive badge */}
                                {item.isLive && (
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.4,
                                            bgcolor: "#ef4444",
                                            px: 0.8,
                                            py: 0.1,
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
                                                "@keyframes livePulse": {
                                                    "0%,100%": { opacity: 1 },
                                                    "50%": { opacity: 0.3 },
                                                },
                                            }}
                                        />
                                        <Typography sx={{ fontSize: "0.6rem", color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>
                                            LIVE
                                        </Typography>
                                    </Box>
                                )}

                                {/* News text */}
                                <Typography
                                    className="ticker-text"
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: "#374151",
                                        fontWeight: 500,
                                        letterSpacing: "0.02em",
                                        whiteSpace: "nowrap",
                                        transition: "color 0.2s",
                                    }}
                                >
                                    {item.text}
                                </Typography>

                                {/* External link icon — shows on hover */}
                                {item.link && (
                                    <OpenInNewIcon
                                        className="ticker-icon"
                                        sx={{
                                            fontSize: 12,
                                            color: "#1a3d2e",
                                            opacity: 0,
                                            transition: "opacity 0.2s",
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                            </Box>
                        ))
                    )}
                </motion.div>
            </Box>
        </Box>
    );
};

export default NewsTicker;