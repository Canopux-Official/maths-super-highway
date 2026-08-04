import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Container, Typography, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import bg from "../../../public/bgImage.jpg";
import NewsTicker from "./NewsTicker";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const stats = [
    { icon: <SchoolIcon sx={{ fontSize: 20 }} />, value: "5,000+", label: "Students Enrolled" },
    { icon: <EmojiEventsIcon sx={{ fontSize: 20 }} />, value: "98%", label: "Success Rate" },
    { icon: <GroupsIcon sx={{ fontSize: 20 }} />, value: "15+", label: "Expert Educators" },
    { icon: <StarIcon sx={{ fontSize: 20 }} />, value: "4.9★", label: "Average Rating" },
];

const equations = [
    { text: "∫₀^∞ e⁻ˣ dx = 1", top: "12%", left: "2%", size: "1.3rem", delay: "0s" },
    { text: "ax² + bx + c = 0", top: "28%", left: "4%", size: "1.1rem", delay: "1s" },
    { text: "lim(x→0) sin(x)/x = 1", bottom: "30%", left: "2%", size: "0.95rem", delay: "0.5s" },
    { text: "e^(iπ) + 1 = 0", bottom: "18%", left: "5%", size: "0.9rem", delay: "1.5s" },
    { text: "Δ = b² - 4ac", top: "50%", left: "1%", size: "0.85rem", delay: "0.3s" },
];

interface ResultImage {
    _id: string;
    imageUrl: string;
    title: string;
}

const Hero: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px
    const statsRef = useRef<HTMLDivElement>(null);
    const [results, setResults] = useState<ResultImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [resultsLoaded, setResultsLoaded] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Fetch results
    useEffect(() => {
        axios
            .get(`${apiUrl}/results`)
            .then((res) => {
                if (res.data.success) setResults(res.data.data);
            })
            .catch(() => {})
            .finally(() => setResultsLoaded(true));
    }, [apiUrl]);

    const goNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % results.length);
    }, [results.length]);

    const goPrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
    }, [results.length]);

    // Auto-cycle
    useEffect(() => {
        if (results.length <= 1) return;
        const t = setInterval(goNext, 2500);
        return () => clearInterval(t);
    }, [results.length, goNext]);

    // Stats observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
            { threshold: 0.1 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const hasResults = resultsLoaded && results.length > 0;

    return (
            <Box
                id="hero"
                sx={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Background */}
                <Box sx={{ position: "absolute", inset: 0, backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(2px)", transform: "scale(1.05)", zIndex: 0 }} />
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(5,16,29,0.92) 0%, rgba(10,22,40,0.88) 50%, rgba(17,34,64,0.94) 100%)", zIndex: 1 }} />
                <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 30% 50%, rgba(29,78,216,0.10) 0%, transparent 70%)", zIndex: 2 }} />

                {/* Floating equations (left side) */}
                {equations.map((eq, i) => (
                    <Typography
                        key={i}
                        sx={{
                            position: "absolute", zIndex: 3,
                            fontFamily: "'Playfair Display', serif",
                            fontSize: eq.size, color: "rgba(255,255,255,0.08)",
                            pointerEvents: "none", userSelect: "none", fontStyle: "italic",
                            animation: `float 8s ease-in-out ${eq.delay} infinite`,
                            ...(eq.top && { top: eq.top }),
                            ...("bottom" in eq && { bottom: eq.bottom }),
                            ...(eq.left && { left: eq.left }),
                            "@keyframes float": {
                                "0%, 100%": { transform: "translateY(0px)" },
                                "50%": { transform: "translateY(-10px)" },
                            },
                        }}
                    >
                        {eq.text}
                    </Typography>
                ))}

                {/* News Ticker */}
                <NewsTicker />

                {/* Main content */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: "relative", zIndex: 10,
                        pt: { xs: 14, md: 12 },
                        pb: { xs: 8, md: 10 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Box sx={{ width: "100%" }}>
                        {/* ── LEFT: Hero content ── */}
                        <Box sx={{ textAlign: 'center', mx: 'auto', maxWidth: 700 }}>
                            {/* Under construction banner */}
                            {/* <Box
                                sx={{
                                    mb: 3, display: "inline-flex", alignItems: "center", gap: 1.25,
                                    bgcolor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)",
                                    px: 2.5, py: 0.75, borderRadius: "8px",
                                    animation: "warningGlow 2.5s ease-in-out infinite",
                                    "@keyframes warningGlow": {
                                        "0%, 100%": { boxShadow: "0 0 8px rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)" },
                                        "50%": { boxShadow: "0 0 20px rgba(239,68,68,0.5)", borderColor: "rgba(239,68,68,0.7)" },
                                    },
                                }}
                            >
                                <WarningAmberIcon sx={{ color: "#EF4444", fontSize: 16 }} />
                                <Typography sx={{ color: "#FCA5A5", fontWeight: 600, fontSize: { xs: "0.68rem", md: "0.75rem" }, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                    Website under construction — demo content
                                </Typography>
                            </Box> */}

                            {/* Live badge */}
                            <Box
                                sx={{
                                    display: "inline-flex", alignItems: "center", gap: 1,
                                    border: "1px solid rgba(6,182,212,0.35)", borderRadius: "50px",
                                    px: 2.5, py: 0.75, mb: 3,
                                    background: "rgba(6,182,212,0.08)", backdropFilter: "blur(8px)",
                                }}
                            >
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#06B6D4", animation: "scalePulse 2s ease-in-out infinite", "@keyframes scalePulse": { "0%, 100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.5)", opacity: 0.5 } } }} />
                                <Typography sx={{ color: "#22D3EE", letterSpacing: "0.15em", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                                    India's Premier Maths Coaching
                                </Typography>
                            </Box>

                            {/* Main heading */}
                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: "'Sora', sans-serif", color: "#fff",
                                    fontSize: { xs: "2.6rem", sm: "3.4rem", md: "3.8rem" },
                                    fontWeight: 800, lineHeight: 1.08, mb: 1.5,
                                    letterSpacing: "-0.03em", textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                                }}
                            >
                                Master Mathematics.
                            </Typography>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: { xs: "2.6rem", sm: "3.4rem", md: "3.8rem" },
                                    fontWeight: 800, lineHeight: 1.08, mb: 3,
                                    letterSpacing: "-0.03em",
                                    background: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 50%, #06B6D4 100%)",
                                    backgroundSize: "200% auto",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    animation: "shimmerText 3s linear infinite",
                                    "@keyframes shimmerText": {
                                        "0%": { backgroundPosition: "0% center" },
                                        "100%": { backgroundPosition: "200% center" },
                                    },
                                }}
                            >
                                Unlock Your Future.
                            </Typography>

                            {/* Subtext */}
                            <Typography
                                sx={{
                                    color: "rgba(255,255,255,0.65)",
                                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                                    lineHeight: 1.8, mb: 4.5,
                                    maxWidth: 560,
                                    mx: 'auto',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                From foundational concepts to advanced competitive mathematics — our structured programs build clarity, confidence, and excellence in every student.
                            </Typography>

                            {/* CTAs */}
                            <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1.75, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() => handleScroll("#courses")}
                                    sx={{
                                        background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                                        color: "#0A1628", fontWeight: 700,
                                        px: 3.5, py: 1.5, borderRadius: "10px", fontSize: "0.95rem",
                                        boxShadow: "0 4px 24px rgba(6,182,212,0.4)",
                                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                        "&:hover": { background: "linear-gradient(135deg, #22D3EE, #06B6D4)", boxShadow: "0 8px 32px rgba(6,182,212,0.55)", transform: "translateY(-2px)" },
                                    }}
                                >
                                    Explore Courses
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleScroll("#about")}
                                    sx={{
                                        borderColor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)",
                                        px: 3.5, py: 1.5, borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600,
                                        backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.05)",
                                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                        "&:hover": { borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.10)", transform: "translateY(-2px)" },
                                    }}
                                >
                                    Learn About Us
                                </Button>
                            </Stack>
                        </Box>

                        {/* ── FULL-WIDTH: Results Carousel ── */}
                        {hasResults && (
                            <Box sx={{ position: "relative", mt: { xs: 5, md: 7 } }}>
                                {/* Section label */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 3 }}>
                                    <EmojiEventsIcon sx={{ color: "#06B6D4", fontSize: 20 }} />
                                    <Typography sx={{ color: "#22D3EE", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                                        Hall of Excellence
                                    </Typography>
                                </Box>

                                {isMobile ? (
                                    /* ── MOBILE: Simple single-image flat carousel ── */
                                    <Box sx={{ position: "relative", px: { xs: 6, sm: 7 } }}>
                                        {/* Prev / Next arrows */}
                                        {results.length > 1 && (
                                            <>
                                                <motion.div
                                                    whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                    onClick={goPrev}
                                                    style={{
                                                        position: "absolute", left: 0, top: "50%",
                                                        transform: "translateY(-50%)", zIndex: 20, cursor: "pointer",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        width: "38px", height: "38px", borderRadius: "50%",
                                                        background: "rgba(6,182,212,0.18)",
                                                        border: "1px solid rgba(6,182,212,0.35)",
                                                        backdropFilter: "blur(8px)", color: "#22D3EE",
                                                    }}
                                                >
                                                    <ChevronLeftIcon sx={{ fontSize: 20 }} />
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                    onClick={goNext}
                                                    style={{
                                                        position: "absolute", right: 0, top: "50%",
                                                        transform: "translateY(-50%)", zIndex: 20, cursor: "pointer",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        width: "38px", height: "38px", borderRadius: "50%",
                                                        background: "rgba(6,182,212,0.18)",
                                                        border: "1px solid rgba(6,182,212,0.35)",
                                                        backdropFilter: "blur(8px)", color: "#22D3EE",
                                                    }}
                                                >
                                                    <ChevronRightIcon sx={{ fontSize: 20 }} />
                                                </motion.div>
                                            </>
                                        )}

                                        {/* Single card */}
                                        <Box sx={{ overflow: "hidden", borderRadius: "16px" }}>
                                            <AnimatePresence mode="wait" initial={false}>
                                                <motion.div
                                                    key={results[currentIndex]._id}
                                                    initial={{ opacity: 0, x: direction * 60 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: direction * -60 }}
                                                    transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    style={{ position: "relative" }}
                                                >
                                                    <Box
                                                        sx={{
                                                            borderRadius: "16px", overflow: "hidden",
                                                            border: "2px solid rgba(6,182,212,0.6)",
                                                            boxShadow: "0 0 28px rgba(6,182,212,0.25), 0 12px 40px rgba(0,0,0,0.6)",
                                                            position: "relative", bgcolor: "#081320",
                                                            maxHeight: { xs: "240px", sm: "340px" },
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}
                                                    >
                                                        <img
                                                            src={results[currentIndex].imageUrl}
                                                            alt={results[currentIndex].title || "Student Result"}
                                                            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", backgroundColor: "#081320", maxHeight: "inherit" }}
                                                            draggable={false}
                                                        />
                                                        {/* Gold sheen */}
                                                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 50%)", pointerEvents: "none" }} />

                                                    </Box>
                                                </motion.div>
                                            </AnimatePresence>
                                        </Box>

                                        {/* Dot indicators */}
                                        {results.length > 1 && (
                                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                                {results.map((_, idx) => (
                                                    <Box
                                                        key={idx}
                                                        onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                                                        sx={{
                                                            width: idx === currentIndex ? 20 : 8, height: 8, borderRadius: 4,
                                                            bgcolor: idx === currentIndex ? "#06B6D4" : "rgba(255,255,255,0.2)",
                                                            cursor: "pointer", transition: "all 0.3s ease",
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    /* ── DESKTOP: 3D Landscape Coverflow (unchanged) ── */
                                    <>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                height: { md: "380px" },
                                                perspective: "1200px",
                                                overflow: "hidden",
                                                px: { md: 7 },
                                            }}
                                        >
                                            <AnimatePresence initial={false}>
                                            {(() => {
                                                const CARD_W = 560;
                                                const CARD_H = 340;
                                                const SIDE_SCALE = 0.68;
                                                const SIDE_X = CARD_W * 0.60;
                                                const visibleSide = results.length >= 3 ? 1 : 0;

                                                const offsets: number[] = [];
                                                if (visibleSide >= 1) { offsets.push(1); offsets.push(-1); }
                                                offsets.push(0);

                                                return offsets.map((offset) => {
                                                    const index = (currentIndex + offset + results.length) % results.length;
                                                    const result = results[index];
                                                    const isCenter = offset === 0;
                                                    const xPos    = isCenter ? 0 : offset * SIDE_X;
                                                    const yPos    = isCenter ? -8 : 12;
                                                    const scale   = isCenter ? 1 : SIDE_SCALE;
                                                    const rotateY = isCenter ? 0 : offset * -38;
                                                    const opacity = isCenter ? 1 : 0.55;
                                                    const initX   = offset > 0 ? SIDE_X * 1.8 : offset < 0 ? -SIDE_X * 1.8 : 0;

                                                    return (
                                                        <motion.div
                                                            key={result._id}
                                                            initial={{ x: initX, opacity: 0, scale: 0.5, rotateY: offset * -55 }}
                                                            animate={{ x: xPos, y: yPos, scale, rotateY, opacity }}
                                                            exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
                                                            transition={{
                                                                x:       { type: "spring", stiffness: 320, damping: 30, mass: 0.8 },
                                                                y:       { type: "spring", stiffness: 280, damping: 24, mass: 0.8 },
                                                                scale:   { type: "spring", stiffness: 300, damping: 28 },
                                                                rotateY: { type: "spring", stiffness: 260, damping: 32 },
                                                                opacity: { duration: 0.3, ease: "easeInOut" },
                                                            }}
                                                            whileHover={!isCenter ? { scale: SIDE_SCALE * 1.06, y: yPos - 6, opacity: 0.78, transition: { type: "spring", stiffness: 400, damping: 22 } } : {}}
                                                            whileTap={!isCenter ? { scale: SIDE_SCALE * 0.96 } : {}}
                                                            onClick={() => { if (!isCenter) setCurrentIndex(index); }}
                                                            style={{
                                                                position: "absolute", left: "50%", top: "50%",
                                                                marginLeft: `${-CARD_W / 2}px`, marginTop: `${-CARD_H / 2}px`,
                                                                cursor: isCenter ? "default" : "pointer",
                                                                transformOrigin: "center center",
                                                            }}
                                                        >
                                                            <Box sx={{
                                                                width:  `${CARD_W}px`,
                                                                height: `${CARD_H}px`,
                                                                borderRadius: "16px", overflow: "hidden", bgcolor: "#081320",
                                                                border: isCenter ? "2px solid rgba(6,182,212,0.7)" : "1px solid rgba(255,255,255,0.07)",
                                                                boxShadow: isCenter ? "0 0 40px rgba(6,182,212,0.35), 0 24px 60px rgba(0,0,0,0.7)" : "0 8px 24px rgba(0,0,0,0.6)",
                                                                filter: isCenter ? "brightness(1)" : "brightness(0.55) saturate(0.7)",
                                                                transition: "border 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease",
                                                                position: "relative",
                                                            }}>
                                                                <img
                                                                    src={result.imageUrl}
                                                                    alt={result.title || "Student Result"}
                                                                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", backgroundColor: "#081320" }}
                                                                    draggable={false}
                                                                />
                                                                {isCenter && result.title && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
                                                                        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                                                                    >
                                                                        <Box sx={{ px: 2.5, py: 1.5, background: "linear-gradient(to top, rgba(5,16,29,0.95) 0%, transparent 100%)" }}>
                                                                            <Typography sx={{ color: "#22D3EE", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Sora', sans-serif" }}>
                                                                                ⭐ {result.title}
                                                                            </Typography>
                                                                        </Box>
                                                                    </motion.div>
                                                                )}
                                                            </Box>
                                                        </motion.div>
                                                    );
                                                });
                                            })()}
                                            </AnimatePresence>

                                            {/* Navigation arrows */}
                                            {results.length > 1 && (
                                                <>
                                                    <motion.div
                                                        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                        onClick={goPrev}
                                                        style={{
                                                            position: "absolute", left: "12px", top: "50%",
                                                            transform: "translateY(-50%)", zIndex: 20, cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            width: "42px", height: "42px", borderRadius: "50%",
                                                            background: "rgba(6,182,212,0.18)",
                                                            border: "1px solid rgba(6,182,212,0.35)",
                                                            backdropFilter: "blur(8px)", color: "#22D3EE",
                                                        }}
                                                    >
                                                        <ChevronLeftIcon sx={{ fontSize: 22 }} />
                                                    </motion.div>
                                                    <motion.div
                                                        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                        onClick={goNext}
                                                        style={{
                                                            position: "absolute", right: "12px", top: "50%",
                                                            transform: "translateY(-50%)", zIndex: 20, cursor: "pointer",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            width: "42px", height: "42px", borderRadius: "50%",
                                                            background: "rgba(6,182,212,0.18)",
                                                            border: "1px solid rgba(6,182,212,0.35)",
                                                            backdropFilter: "blur(8px)", color: "#22D3EE",
                                                        }}
                                                    >
                                                        <ChevronRightIcon sx={{ fontSize: 22 }} />
                                                    </motion.div>
                                                </>
                                            )}
                                        </Box>

                                        {/* Progress dots */}
                                        {results.length > 1 && (
                                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                                {results.map((_, idx) => (
                                                    <Box
                                                        key={idx}
                                                        onClick={() => setCurrentIndex(idx)}
                                                        sx={{
                                                            width: idx === currentIndex ? 20 : 8, height: 8, borderRadius: 4,
                                                            bgcolor: idx === currentIndex ? "#06B6D4" : "rgba(255,255,255,0.2)",
                                                            cursor: "pointer", transition: "all 0.3s ease",
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* ── Stats Row (inside hero) ── */}
                    <Box
                        ref={statsRef}
                        sx={{
                            mt: { xs: 6, md: 8 },
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            bgcolor: "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderRadius: "16px",
                            overflow: "hidden",
                        }}
                    >
                        {stats.map((stat, i) => (
                            <Box
                                key={stat.label}
                                sx={{
                                    px: { xs: 3, md: 5 }, py: { xs: 2.5, md: 3 },
                                    flex: "1 1 140px", textAlign: "center",
                                    borderRight: i < stats.length - 1 ? { xs: "none", sm: "1px solid rgba(255,255,255,0.08)" } : "none",
                                    borderBottom: { xs: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", sm: "none" },
                                    transition: "background 0.2s",
                                    "&:hover": { background: "rgba(255,255,255,0.06)" },
                                }}
                            >
                                <Box sx={{ color: "#06B6D4", display: "flex", justifyContent: "center", mb: 0.75 }}>{stat.icon}</Box>
                                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.75rem" }, fontFamily: "'Sora', sans-serif", lineHeight: 1, mb: 0.5, letterSpacing: "-0.02em" }}>
                                    {stat.value}
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>

                {/* Chalk ledge */}
                <Box sx={{ position: "absolute", bottom: 38, left: 0, right: 0, height: 2, bgcolor: "rgba(6,182,212,0.12)", zIndex: 4 }} />
            </Box>
    );
};

export default Hero;