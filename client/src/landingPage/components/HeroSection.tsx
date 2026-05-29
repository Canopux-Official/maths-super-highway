import React, { useEffect, useRef } from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import bg from '../../../public/bgImage.jpg';
import NewsTicker from "./NewsTicker";

const stats = [
    { icon: <SchoolIcon sx={{ fontSize: 20 }} />, value: "5,000+", label: "Students Enrolled" },
    { icon: <EmojiEventsIcon sx={{ fontSize: 20 }} />, value: "98%", label: "Success Rate" },
    { icon: <GroupsIcon sx={{ fontSize: 20 }} />, value: "15+", label: "Expert Educators" },
    { icon: <StarIcon sx={{ fontSize: 20 }} />, value: "4.9★", label: "Average Rating" },
];

// Math equations floating in the hero — styled like chalk writing
const equations = [
    { text: "∫₀^∞ e⁻ˣ dx = 1", top: "12%", left: "3%", size: "1.5rem", delay: "0s" },
    { text: "ax² + bx + c = 0", top: "20%", right: "3%", size: "1.3rem", delay: "0.5s" },
    { text: "lim(x→0) sin(x)/x = 1", bottom: "28%", left: "3%", size: "1.1rem", delay: "1s" },
    { text: "∑ n² = n(n+1)(2n+1)/6", bottom: "22%", right: "2%", size: "1.2rem", delay: "1.5s" },
    { text: "e^(iπ) + 1 = 0", top: "48%", right: "1.5%", size: "1rem", delay: "0.8s" },
    { text: "∇²φ = ρ/ε₀", top: "58%", left: "1.5%", size: "0.95rem", delay: "1.2s" },
    { text: "Δ = b² - 4ac", top: "35%", left: "6%", size: "0.9rem", delay: "0.3s" },
];

const Hero: React.FC = () => {
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Intersection observer for stats counter animation
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }
        return () => observer.disconnect();
    }, []);

    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            id="hero"
            sx={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            {/* ── Background: Chalkboard image with NAVY overlay ── */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px)",
                    transform: "scale(1.05)",
                    zIndex: 0,
                }}
            />

            {/* Primary navy gradient overlay — preserves chalkboard feel */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(160deg, rgba(5,16,29,0.88) 0%, rgba(10,22,40,0.82) 50%, rgba(17,34,64,0.90) 100%)",
                    zIndex: 1,
                }}
            />

            {/* Subtle radial light from center — depth effect */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(29,78,216,0.12) 0%, transparent 70%)",
                    zIndex: 2,
                }}
            />

            {/* Floating chalk equations */}
            {equations.map((eq, i) => (
                <Typography
                    key={i}
                    sx={{
                        position: "absolute",
                        zIndex: 3,
                        fontFamily: "'Playfair Display', serif",
                        fontSize: eq.size,
                        color: "rgba(255,255,255,0.10)",
                        pointerEvents: "none",
                        userSelect: "none",
                        fontStyle: "italic",
                        letterSpacing: "0.02em",
                        animation: `float 8s ease-in-out ${eq.delay} infinite`,
                        ...(eq.top && { top: eq.top }),
                        ...(("bottom" in eq) && { bottom: eq.bottom }),
                        ...(eq.left && { left: eq.left }),
                        ...(("right" in eq) && { right: eq.right }),
                        "@keyframes float": {
                            "0%, 100%": { transform: "translateY(0px)" },
                            "50%": { transform: "translateY(-10px)" },
                        },
                    }}
                >
                    {eq.text}
                </Typography>
            ))}

            {/* News Ticker — absolute at bottom of hero */}
            <NewsTicker />

            {/* Chalk ledge at bottom */}
            <Box sx={{ position: "absolute", bottom: 38, left: 0, right: 0, height: 3, bgcolor: "rgba(6,182,212,0.15)", zIndex: 4 }} />

            {/* ── Main Content ── */}
            <Container
                maxWidth="lg"
                sx={{
                    position: "relative",
                    zIndex: 10,
                    pt: { xs: 14, md: 18 },
                    pb: { xs: 10, md: 14 },
                    textAlign: "center",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* ── Under Construction Banner ── */}
                <Box
                    sx={{
                        mb: 4,
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1.25,
                        bgcolor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239,68,68,0.4)",
                        px: { xs: 2, md: 3 },
                        py: 1,
                        borderRadius: "8px",
                        animation: "warningGlow 2.5s ease-in-out infinite",
                        "@keyframes warningGlow": {
                            "0%, 100%": { boxShadow: "0 0 8px rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)" },
                            "50%": { boxShadow: "0 0 20px rgba(239,68,68,0.5)", borderColor: "rgba(239,68,68,0.7)" },
                        },
                    }}
                >
                    <WarningAmberIcon sx={{ color: "#EF4444", fontSize: 18 }} />
                    <Typography
                        sx={{
                            color: "#FCA5A5",
                            fontWeight: 600,
                            fontSize: { xs: "0.72rem", md: "0.8rem" },
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                        }}
                    >
                        Website under construction — All content is for demo
                    </Typography>
                </Box>

                {/* ── Live Badge ── */}
                <Box
                    className="anim-fade-up"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        border: "1px solid rgba(6,182,212,0.35)",
                        borderRadius: "50px",
                        px: 2.5,
                        py: 0.75,
                        mb: 4,
                        background: "rgba(6,182,212,0.08)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <Box
                        sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: "#06B6D4",
                            animation: "scalePulse 2s ease-in-out infinite",
                            "@keyframes scalePulse": {
                                "0%, 100%": { transform: "scale(1)", opacity: 1 },
                                "50%": { transform: "scale(1.5)", opacity: 0.5 },
                            },
                        }}
                    />
                    <Typography
                        sx={{
                            color: "#22D3EE",
                            letterSpacing: "0.15em",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            textTransform: "uppercase",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        India's Premier Maths Coaching
                    </Typography>
                </Box>

                {/* ── Main Heading ── */}
                <Typography
                    variant="h1"
                    className="anim-fade-up anim-delay-1"
                    sx={{
                        fontFamily: "'Sora', sans-serif",
                        color: "#fff",
                        fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem", lg: "4.5rem" },
                        fontWeight: 800,
                        lineHeight: 1.1,
                        mb: 1.5,
                        letterSpacing: "-0.03em",
                        textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                    }}
                >
                    Master Mathematics.
                </Typography>
                <Typography
                    variant="h1"
                    className="anim-fade-up anim-delay-2"
                    sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem", lg: "4.5rem" },
                        fontWeight: 800,
                        lineHeight: 1.1,
                        mb: 3,
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

                {/* ── Subtext ── */}
                <Typography
                    className="anim-fade-up anim-delay-3"
                    sx={{
                        color: "rgba(255,255,255,0.68)",
                        fontSize: { xs: "1rem", md: "1.125rem" },
                        lineHeight: 1.8,
                        mb: 5,
                        mx: "auto",
                        maxWidth: 560,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                    }}
                >
                    From foundational concepts to advanced competitive mathematics — our structured programs build clarity, confidence, and excellence in every student.
                </Typography>

                {/* ── CTA Buttons ── */}
                <Stack
                    className="anim-fade-up anim-delay-4"
                    sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.75,
                        justifyContent: "center",
                        mb: 9,
                        width: "100%",
                    }}
                >
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleScroll("#courses")}
                        sx={{
                            background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                            color: "#0A1628",
                            fontWeight: 700,
                            px: 4,
                            py: 1.6,
                            borderRadius: "10px",
                            fontSize: "1rem",
                            boxShadow: "0 4px 24px rgba(6,182,212,0.4)",
                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                                boxShadow: "0 8px 32px rgba(6,182,212,0.55)",
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        Explore Courses
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleScroll("#about")}
                        sx={{
                            borderColor: "rgba(255,255,255,0.35)",
                            color: "rgba(255,255,255,0.9)",
                            px: 4,
                            py: 1.6,
                            borderRadius: "10px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            backdropFilter: "blur(8px)",
                            background: "rgba(255,255,255,0.05)",
                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                            "&:hover": {
                                borderColor: "rgba(255,255,255,0.7)",
                                background: "rgba(255,255,255,0.10)",
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        Learn About Us
                    </Button>
                </Stack>

                {/* ── Stats Row ── */}
                <Box
                    ref={statsRef}
                    className="anim-fade-up anim-delay-5"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: { xs: 0, md: 0 },
                        bgcolor: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        maxWidth: 720,
                        mx: "auto",
                        width: "100%",
                    }}
                >
                    {stats.map((stat, i) => (
                        <Box
                            key={stat.label}
                            sx={{
                                px: { xs: 3, md: 5 },
                                py: { xs: 2, md: 2.5 },
                                flex: "1 1 140px",
                                textAlign: "center",
                                borderRight: i < stats.length - 1
                                    ? { xs: "none", sm: "1px solid rgba(255,255,255,0.1)" }
                                    : "none",
                                borderBottom: { xs: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none", sm: "none" },
                                transition: "background 0.2s",
                                "&:hover": {
                                    background: "rgba(255,255,255,0.06)",
                                },
                            }}
                        >
                            <Box sx={{ color: "#06B6D4", display: "flex", justifyContent: "center", mb: 0.75 }}>
                                {stat.icon}
                            </Box>
                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontWeight: 800,
                                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                                    fontFamily: "'Sora', sans-serif",
                                    lineHeight: 1,
                                    mb: 0.5,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {stat.value}
                            </Typography>
                            <Typography
                                sx={{
                                    color: "rgba(255,255,255,0.5)",
                                    fontSize: "0.68rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontWeight: 500,
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Hero;