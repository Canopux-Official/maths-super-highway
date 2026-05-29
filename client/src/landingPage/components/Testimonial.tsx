import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Avatar, Rating, Alert } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import type { Testimonial } from "..";
import { getLandingPageTestimonials } from "../api";

const TestimonialCard: React.FC<{ t: Testimonial; index: number }> = ({ t, index }) => {
    return (
        <Box
            sx={{
                flexShrink: 0,
                width: { xs: "calc(100% - 24px)", sm: 340, md: 360 },
                bgcolor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                p: { xs: 3, md: 3.5 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
                animationDelay: `${index * 0.12}s`,
                "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(24px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "linear-gradient(90deg, #0A1628, #1D4ED8)",
                    opacity: 0,
                    transition: "opacity 0.25s ease",
                },
                "&:hover": {
                    borderColor: "#BFDBFE",
                    boxShadow: "0 12px 40px rgba(10,22,40,0.10)",
                    transform: "translateY(-4px)",
                    "&::before": { opacity: 1 },
                },
            }}
        >
            {/* Quote icon */}
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: "rgba(29,78,216,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <FormatQuoteIcon sx={{ color: "#1D4ED8", fontSize: 22 }} />
            </Box>

            {/* Review text */}
            <Typography
                variant="body2"
                sx={{
                    color: "#334155",
                    lineHeight: 1.8,
                    fontStyle: "italic",
                    flexGrow: 1,
                    fontSize: "0.9rem",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                "{t.message}"
            </Typography>

            {/* Star rating */}
            <Rating
                value={t.rating}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                    "& .MuiRating-iconFilled": { color: "#06B6D4" },
                    "& .MuiRating-iconEmpty": { color: "#E2E8F0" },
                }}
            />

            {/* Divider */}
            <Box sx={{ height: "1px", bgcolor: "#F1F5F9" }} />

            {/* Author */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                    sx={{
                        bgcolor: "#0A1628",
                        color: "#06B6D4",
                        width: 40,
                        height: 40,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        fontFamily: "'Sora', sans-serif",
                    }}
                >
                    {t.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                </Avatar>
                <Box>
                    <Typography
                        sx={{
                            color: "#0A1628",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            fontFamily: "'Sora', sans-serif",
                            lineHeight: 1.3,
                        }}
                    >
                        {t.user.name}
                    </Typography>
                    <Typography
                        sx={{
                            color: "#1D4ED8",
                            fontSize: "0.72rem",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        {t.course.title}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getLandingPageTestimonials()
            .then(setTestimonials)
            .catch(() => {
                setError("Could not load testimonials from server. Showing sample reviews.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box
            id="testimonials"
            sx={{
                py: { xs: 9, md: 12 },
                bgcolor: "#EFF6FF",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background accent */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                        radial-gradient(circle at 10% 50%, rgba(29,78,216,0.06) 0%, transparent 50%),
                        radial-gradient(circle at 90% 50%, rgba(6,182,212,0.04) 0%, transparent 50%)
                    `,
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                {/* Section Header */}
                <Box sx={{ mb: 8, textAlign: "center" }}>
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            border: "1px solid rgba(6,182,212,0.3)",
                            borderRadius: "50px",
                            px: 2,
                            py: 0.5,
                            mb: 2.5,
                            bgcolor: "rgba(6,182,212,0.08)",
                        }}
                    >
                        <StarIcon sx={{ fontSize: 13, color: "#06B6D4" }} />
                        <Typography
                            sx={{
                                color: "#0891B2",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Student Reviews
                        </Typography>
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800,
                            color: "#0A1628",
                            fontSize: { xs: "1.9rem", sm: "2.4rem", md: "2.8rem" },
                            letterSpacing: "-0.025em",
                            mb: 1.5,
                        }}
                    >
                        Words from Our Students
                    </Typography>
                    <Typography
                        sx={{
                            color: "#64748B",
                            fontSize: { xs: "0.95rem", md: "1.05rem" },
                            maxWidth: 460,
                            mx: "auto",
                            lineHeight: 1.7,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Hear how Maths Super Highway has transformed the mathematical journeys of our students.
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 3,
                                borderRadius: "2px",
                                background: "linear-gradient(135deg, #06B6D4, #1D4ED8)",
                            }}
                        />
                    </Box>
                </Box>

                {error && (
                    <Alert severity="info" sx={{ mb: 4, borderRadius: "10px" }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Typography sx={{ textAlign: "center", color: "#64748B" }}>Loading testimonials...</Typography>
                ) : testimonials.length > 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={t._id} t={t} index={i} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography sx={{ color: "#64748B", fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
                            Our students are hard at work! 🌟 Check back later for their amazing success stories.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Testimonials;