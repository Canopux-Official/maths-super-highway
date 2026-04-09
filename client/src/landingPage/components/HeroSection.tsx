import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import bg from '../../../public/bgImage.jpg';
import NewsTicker from "./NewsTicker";

const stats = [
    { icon: <SchoolIcon sx={{ fontSize: 18 }} />, value: "5,000+", label: "Students Enrolled" },
    { icon: <EmojiEventsIcon sx={{ fontSize: 18 }} />, value: "98%", label: "Success Rate" },
    { icon: <GroupsIcon sx={{ fontSize: 18 }} />, value: "15+", label: "Expert Educators" },
];

const equations = [
    { text: "∫₀^∞ e⁻ˣ dx = 1", top: "8%", left: "3%", size: "2.8rem" },
    { text: "ax² + bx + c = 0", top: "18%", right: "4%", size: "2.2rem" },
    { text: "lim(x→0) sin(x)/x = 1", bottom: "22%", left: "4%", size: "1.8rem" },
    { text: "∑ n² = n(n+1)(2n+1)/6", bottom: "18%", right: "3%", size: "2.4rem" },
    { text: "e^(iπ) + 1 = 0", top: "42%", right: "1.5%", size: "1.7rem" },
    { text: "∇²φ = ρ/ε₀", top: "55%", left: "1.5%", size: "1.6rem" },
];

const Hero: React.FC = () => {
    const handleScroll = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box id="hero" sx={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
            {/* ✅ Background layer — blurred independently */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "multiply",
                    bgcolor: "#042e2e",   // color tint stays the same
                    filter: "blur(3px)",  // only this layer blurs
                    transform: "scale(1.05)", // prevents blur edge bleed
                    zIndex: 0,
                }}
            />

            

            {/* ✅ Dark overlay for better text contrast */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(10, 61, 98, 0.45)",
                    zIndex: 1,
                }}
            />

            

            {/* Chalk equations */}
            {equations.map((eq, i) => (
                <Typography
                    key={i}
                    sx={{
                        position: "absolute",
                        zIndex: 2,
                        fontFamily: "'Playfair Display', serif",
                        fontSize: eq.size,
                        color: "rgba(255,255,255,0.06)",
                        pointerEvents: "none",
                        userSelect: "none",
                        ...(eq.top && { top: eq.top }),
                        ...(eq.bottom && { bottom: eq.bottom }),
                        ...(eq.left && { left: eq.left }),
                        ...(eq.right && { right: eq.right }),
                    }}
                >
                    {eq.text}
                </Typography>
            ))}

            <NewsTicker />

            {/* Chalk ledge */}
            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, bgcolor: "#8B7355", borderTop: "3px solid #a08060", zIndex: 3 }} />
            <Box sx={{ position: "absolute", bottom: 14, left: 0, right: 0, height: 6, bgcolor: "rgba(255,255,255,0.07)", filter: "blur(2px)", zIndex: 3 }} />

            {/* ✅ All content — unblurred, sits above everything */}
            <Container maxWidth="md" sx={{ position: "relative", zIndex: 10, py: 10, textAlign: "center" }}>
                {/* Badge */}
                <Box sx={{
                    display: "inline-flex", alignItems: "center", gap: 1,
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 50, px: 2, py: 0.6, mb: 4,
                }}>
                    <Box sx={{
                        width: 7, height: 7, borderRadius: "50%", bgcolor: "#86efac",
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
                    }} />
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.12em", fontWeight: 600, fontSize: "0.7rem" }}>
                        INDIA'S PREMIER MATHS COACHING
                    </Typography>
                </Box>

                {/* Heading */}
                <Typography variant="h1" sx={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#fff",
                    fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.4rem" },
                    fontWeight: 700, lineHeight: 1.2, mb: 2,
                }}>
                    Master Mathematics.{" "}
                    <Box component="span" sx={{
                        color: "#86efac", position: "relative",
                        "&::after": {
                            content: '""', position: "absolute", left: 0, bottom: -3, right: 0,
                            height: 2, bgcolor: "#86efac", opacity: 0.5, borderRadius: 2,
                        }
                    }}>
                        Unlock Your Future.
                    </Box>
                </Typography>

                {/* Subtext */}
                <Typography variant="body1" sx={{
                    color: "rgba(255,255,255,0.65)", fontSize: "1rem",
                    lineHeight: 1.8, mb: 5, mx: "auto", maxWidth: 520,
                }}>
                    From foundational concepts to advanced competitive mathematics — our structured programs build clarity, confidence, and excellence in every student.
                </Typography>

                {/* Buttons */}
                <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1.5, justifyContent: "center", mb: 7 }}>
                    <Button variant="contained" onClick={() => handleScroll("#courses")} sx={{
                        bgcolor: "#fff", color: "#1e4a1a", fontWeight: 500,
                        px: 3.5, py: 1.3, borderRadius: 1.5,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}>
                        Explore Courses
                    </Button>
                    <Button variant="outlined" onClick={() => handleScroll("#about")} sx={{
                        borderColor: "rgba(255,255,255,0.45)", color: "rgba(255,255,255,0.9)",
                        px: 3.5, py: 1.3, borderRadius: 1.5,
                        "&:hover": { borderColor: "rgba(255,255,255,0.75)", bgcolor: "transparent" },
                    }}>
                        Learn About Us
                    </Button>
                </Stack>

                {/* Stats */}
                <Stack sx={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                    {stats.map((stat, i) => (
                        <Box key={stat.label} sx={{
                            px: { xs: 2.5, sm: 3.5 }, py: 0.5,
                            borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
                            textAlign: "center",
                        }}>
                            <Box sx={{ color: "#86efac", display: "flex", justifyContent: "center", mb: 0.5 }}>{stat.icon}</Box>
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.3rem", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                                {stat.value}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default Hero;