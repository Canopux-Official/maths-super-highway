// import React, { useEffect, useState, useRef } from "react";
// import { Box, Typography, Skeleton } from "@mui/material";
// import CampaignIcon from "@mui/icons-material/Campaign";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
// import { getNewsTicker } from "../api";

// interface TickerItem {
//     _id: string;
//     text: string;
//     link: string;
//     isLive: boolean;
//     createdAt: string;
// }

// const NewsTicker: React.FC = () => {
//     const [news, setNews] = useState<TickerItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [contentWidth, setContentWidth] = useState(0);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const x = useMotionValue(0);
//     const isPaused = useRef(false);

//     useEffect(() => {
//         getNewsTicker()
//             .then((res: any) => {
//                 const apiItems = res?.data?.data || res?.data || [];
//                 setNews(apiItems);
//             })
//             .catch((err) => {
//                 console.error("Ticker Fetch Error:", err);
//                 setNews([]);
//             })
//             .finally(() => setLoading(false));
//     }, []);

//     useEffect(() => {
//         if (contentRef.current && news.length > 0) {
//             setTimeout(() => {
//                 if (contentRef.current) {
//                     const w = contentRef.current.scrollWidth / 2;
//                     setContentWidth(w);
//                     x.set(window.innerWidth);
//                 }
//             }, 100);
//         }
//     }, [news]);

//     useAnimationFrame((_, delta) => {
//         if (contentWidth === 0 || isPaused.current) return;
//         const speed = 0.08;
//         const current = x.get();
//         const next = current - delta * speed;
//         if (next <= -contentWidth) {
//             x.set(window.innerWidth);
//         } else {
//             x.set(next);
//         }
//     });

//     const handleItemClick = (link: string) => {
//         if (!link) return;
//         const url = link.startsWith("http") ? link : `https://${link}`;
//         window.open(url, "_blank", "noopener,noreferrer");
//     };

//     if (loading) {
//         return (
//             <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 1100 }}>
//                 <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
//             </Box>
//         );
//     }

//     if (news.length === 0) return null;

//     return (
//         <Box
//             sx={{
//                 position: "absolute",
//                 bottom: 0,
//                 left: 0,
//                 width: "100%",
//                 zIndex: 1100,
//                 bgcolor: "#05101D", // Deep navy for prominence
//                 borderTop: "2px solid #06B6D4", // Gold top border
//                 display: "flex",
//                 alignItems: "center",
//                 height: 48, // Taller
//                 overflow: "hidden",
//             }}
//         >
//             {/* "LIVE NEWS" label — navy + gold */}
//             <Box
//                 sx={{
//                     flexShrink: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 0.75,
//                     background: "linear-gradient(135deg, #06B6D4, #0891B2)", // Gold badge
//                     px: 3,
//                     height: "100%",
//                     zIndex: 2,
//                     boxShadow: "4px 0 16px rgba(0,0,0,0.3)",
//                 }}
//             >
//                 <CampaignIcon sx={{ fontSize: 18, color: "#0A1628" }} />
//                 <Typography
//                     sx={{
//                         color: "#0A1628",
//                         fontWeight: 800,
//                         fontSize: "0.8rem",
//                         letterSpacing: "0.15em",
//                         whiteSpace: "nowrap",
//                         fontFamily: "'Sora', sans-serif",
//                         textTransform: "uppercase",
//                     }}
//                 >
//                     Live News
//                 </Typography>
//                 {/* Divider removed as badge has strong contrast */}
//             </Box>

//             {/* Scrolling ticker */}
//             <Box sx={{ flex: 1, overflow: "hidden", height: "100%", position: "relative" }}>
//                 <motion.div
//                     ref={contentRef}
//                     style={{
//                         x,
//                         display: "inline-flex",
//                         alignItems: "center",
//                         height: "100%",
//                         whiteSpace: "nowrap",
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         willChange: "transform",
//                     }}
//                 >
//                     {[0, 1].map((copyIndex) =>
//                         news.map((item) => (
//                             <Box
//                                 key={`${copyIndex}-${item._id}`}
//                                 onClick={() => handleItemClick(item.link)}
//                                 onMouseEnter={() => { isPaused.current = true; }}
//                                 onMouseLeave={() => { isPaused.current = false; }}
//                                 sx={{
//                                     display: "inline-flex",
//                                     alignItems: "center",
//                                     gap: 1,
//                                     px: 3,
//                                     cursor: item.link ? "pointer" : "default",
//                                     transition: "background 0.2s",
//                                     "&:hover": {
//                                         background: "rgba(255,255,255,0.06)",
//                                     },
//                                     "&:hover .ticker-text": {
//                                         color: "#22D3EE",
//                                         textDecoration: item.link ? "underline" : "none",
//                                     },
//                                     "&:hover .ticker-icon": {
//                                         opacity: 1,
//                                     },
//                                 }}
//                             >
//                                 {/* Dot separator */}
//                                 <FiberManualRecordIcon
//                                     sx={{ fontSize: 6, color: "#06B6D4", flexShrink: 0 }}
//                                 />

//                                 {/* isLive badge */}
//                                 {item.isLive && (
//                                     <Box
//                                         sx={{
//                                             display: "inline-flex",
//                                             alignItems: "center",
//                                             gap: 0.4,
//                                             bgcolor: "#EF4444",
//                                             px: 0.75,
//                                             py: 0.15,
//                                             borderRadius: "4px",
//                                             flexShrink: 0,
//                                         }}
//                                     >
//                                         <Box
//                                             sx={{
//                                                 width: 4,
//                                                 height: 4,
//                                                 borderRadius: "50%",
//                                                 bgcolor: "#fff",
//                                                 animation: "livePulse 1.2s infinite",
//                                                 "@keyframes livePulse": {
//                                                     "0%,100%": { opacity: 1 },
//                                                     "50%": { opacity: 0.3 },
//                                                 },
//                                             }}
//                                         />
//                                         <Typography sx={{ fontSize: "0.58rem", color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>
//                                             LIVE
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 {/* News text */}
//                                 <Typography
//                                     className="ticker-text"
//                                     sx={{
//                                         fontSize: "0.95rem",
//                                         color: "#F8FAFC",
//                                         fontWeight: 600,
//                                         letterSpacing: "0.02em",
//                                         whiteSpace: "nowrap",
//                                         transition: "color 0.2s",
//                                         fontFamily: "'Inter', sans-serif",
//                                     }}
//                                 >
//                                     {item.text}
//                                 </Typography>

//                                 {/* External link icon */}
//                                 {item.link && (
//                                     <OpenInNewIcon
//                                         className="ticker-icon"
//                                         sx={{
//                                             fontSize: 14,
//                                             color: "#22D3EE",
//                                             opacity: 0,
//                                             transition: "opacity 0.2s",
//                                             flexShrink: 0,
//                                         }}
//                                     />
//                                 )}
//                             </Box>
//                         ))
//                     )}
//                 </motion.div>
//             </Box>
//         </Box>
//     );
// };

// export default NewsTicker;


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
                    const w = contentRef.current.scrollWidth / 2; // still divide by 2 — two copies
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
            <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 1100 }}>
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
            </Box>
        );
    }

    if (news.length === 0) return null;

    // Duplicate the array here — single flat list, no nested map
    const tickerItems = [...news, ...news];

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 1100,
                bgcolor: "#05101D",
                borderTop: "2px solid #06B6D4",
                display: "flex",
                alignItems: "center",
                height: 48,
                overflow: "hidden",
            }}
        >
            {/* "LIVE NEWS" label */}
            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                    px: 3,
                    height: "100%",
                    zIndex: 2,
                    boxShadow: "4px 0 16px rgba(0,0,0,0.3)",
                }}
            >
                <CampaignIcon sx={{ fontSize: 18, color: "#0A1628" }} />
                <Typography
                    sx={{
                        color: "#0A1628",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        letterSpacing: "0.15em",
                        whiteSpace: "nowrap",
                        fontFamily: "'Sora', sans-serif",
                        textTransform: "uppercase",
                    }}
                >
                    Live News
                </Typography>
            </Box>

            {/* Scrolling ticker */}
            <Box sx={{ flex: 1, overflow: "hidden", height: "100%", position: "relative" }}>
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
                    {tickerItems.map((item, index) => (
                        <Box
                            key={`${index}-${item._id}`}  // index prefix avoids duplicate key warning
                            onClick={() => handleItemClick(item.link)}
                            onMouseEnter={() => { isPaused.current = true; }}
                            onMouseLeave={() => { isPaused.current = false; }}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 3,
                                cursor: item.link ? "pointer" : "default",
                                transition: "background 0.2s",
                                "&:hover": { background: "rgba(255,255,255,0.06)" },
                                "&:hover .ticker-text": {
                                    color: "#22D3EE",
                                    textDecoration: item.link ? "underline" : "none",
                                },
                                "&:hover .ticker-icon": { opacity: 1 },
                            }}
                        >
                            <FiberManualRecordIcon sx={{ fontSize: 6, color: "#06B6D4", flexShrink: 0 }} />

                            {item.isLive && (
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.4,
                                        bgcolor: "#EF4444",
                                        px: 0.75,
                                        py: 0.15,
                                        borderRadius: "4px",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 4,
                                            height: 4,
                                            borderRadius: "50%",
                                            bgcolor: "#fff",
                                            animation: "livePulse 1.2s infinite",
                                            "@keyframes livePulse": {
                                                "0%,100%": { opacity: 1 },
                                                "50%": { opacity: 0.3 },
                                            },
                                        }}
                                    />
                                    <Typography sx={{ fontSize: "0.58rem", color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>
                                        LIVE
                                    </Typography>
                                </Box>
                            )}

                            <Typography
                                className="ticker-text"
                                sx={{
                                    fontSize: "0.95rem",
                                    color: "#F8FAFC",
                                    fontWeight: 600,
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap",
                                    transition: "color 0.2s",
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                {item.text}
                            </Typography>

                            {item.link && (
                                <OpenInNewIcon
                                    className="ticker-icon"
                                    sx={{
                                        fontSize: 14,
                                        color: "#22D3EE",
                                        opacity: 0,
                                        transition: "opacity 0.2s",
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </motion.div>
            </Box>
        </Box>
    );
};

export default NewsTicker;