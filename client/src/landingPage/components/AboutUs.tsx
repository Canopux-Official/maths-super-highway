import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Stack,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const values = [
    {
        icon: <VerifiedIcon fontSize="small" />,
        title: "Proven Pedagogy",
        description: "Our teaching methodology is built on years of research and results. We combine conceptual clarity with rigorous practice.",
        color: "#1D4ED8",
        bg: "rgba(29,78,216,0.07)",
    },
    {
        icon: <TrendingUpIcon fontSize="small" />,
        title: "Result-Oriented",
        description: "Every curriculum decision is driven by outcomes. Our students consistently outperform at boards, JEE, and Olympiads.",
        color: "#06B6D4",
        bg: "rgba(6,182,212,0.08)",
    },
    {
        icon: <PeopleAltIcon fontSize="small" />,
        title: "Personalised Attention",
        description: "Small batch sizes ensure every student receives individual feedback and guidance tailored to their learning pace.",
        color: "#1D4ED8",
        bg: "rgba(29,78,216,0.07)",
    },
    {
        icon: <MenuBookIcon fontSize="small" />,
        title: "Comprehensive Resources",
        description: "Access curated study material, topic-wise test series, and recorded sessions — available 24/7.",
        color: "#06B6D4",
        bg: "rgba(6,182,212,0.08)",
    },
];

const milestones = [
    { year: "2010", event: "Founded in Bhubaneswar with a vision to make quality maths education accessible." },
    { year: "2015", event: "Expanded to 3 centres; first batch produced AIR Top 100 in JEE Advanced." },
    { year: "2019", event: "Launched online learning platform — reaching students across Odisha." },
    { year: "2023", event: "Crossed 5,000 enrolled students with 98% board & competitive exam success rate." },
];

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
    <Box
        sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid rgba(29,78,216,0.2)",
            borderRadius: "50px",
            px: 2,
            py: 0.5,
            mb: 2.5,
            bgcolor: "rgba(29,78,216,0.06)",
        }}
    >
        <InfoOutlinedIcon sx={{ fontSize: 13, color: "#1D4ED8" }} />
        <Typography
            sx={{
                color: "#1D4ED8",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {text}
        </Typography>
    </Box>
);

const AboutUs: React.FC = () => {
    return (
        <Box
            id="about"
            sx={{
                py: { xs: 9, md: 12 },
                bgcolor: "#fff",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle gradient background */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(circle at 100% 0%, rgba(29,78,216,0.04) 0%, transparent 50%)",
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 7, md: 10 },
                        alignItems: "flex-start",
                    }}
                >
                    {/* ── Left Column: Story + Timeline ── */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <SectionLabel text="About Us" />

                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: { xs: "1.9rem", md: "2.5rem" },
                                color: "#0A1628",
                                mb: 2.5,
                                lineHeight: 1.2,
                                fontWeight: 800,
                                letterSpacing: "-0.025em",
                            }}
                        >
                            Two Decades of Building{" "}
                            <Box
                                component="span"
                                sx={{
                                    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Mathematical Minds
                            </Box>
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#475569",
                                lineHeight: 1.9,
                                mb: 2,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Math SuperHighway was founded with a singular belief: every student has the potential to master mathematics when given the right environment, method, and mentorship.
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#475569",
                                lineHeight: 1.9,
                                mb: 5,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Our faculty brings together alumni from IITs, NITs, and leading universities — passionate educators who blend deep expertise with empathetic teaching.
                        </Typography>

                        {/* Timeline */}
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                color: "#0A1628",
                                mb: 3,
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "1rem",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            Our Journey
                        </Typography>

                        <Stack spacing={0}>
                            {milestones.map((m, i) => (
                                <Box key={m.year} sx={{ display: "flex", gap: 2.5 }}>
                                    {/* Timeline track */}
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 46,
                                                height: 46,
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, #0A1628, #1D4ED8)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                boxShadow: "0 4px 12px rgba(29,78,216,0.25)",
                                                border: "2px solid rgba(29,78,216,0.2)",
                                                animation: `fadeInLeft 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s both`,
                                                "@keyframes fadeInLeft": {
                                                    from: { opacity: 0, transform: "translateX(-16px)" },
                                                    to: { opacity: 1, transform: "translateX(0)" },
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "#fff",
                                                    fontWeight: 800,
                                                    fontSize: "0.65rem",
                                                    fontFamily: "'Sora', sans-serif",
                                                    letterSpacing: "-0.01em",
                                                }}
                                            >
                                                {m.year}
                                            </Typography>
                                        </Box>
                                        {i < milestones.length - 1 && (
                                            <Box
                                                sx={{
                                                    width: 2,
                                                    flexGrow: 1,
                                                    mt: 0.5,
                                                    mb: 0.5,
                                                    minHeight: 36,
                                                    background: "linear-gradient(to bottom, rgba(29,78,216,0.3), rgba(29,78,216,0.08))",
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ pt: 1, pb: i < milestones.length - 1 ? 3 : 0 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#475569",
                                                lineHeight: 1.7,
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                        >
                                            {m.event}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* ── Right Column: Mission + Values ── */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        {/* Mission card */}
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #0A1628 0%, #112240 100%)",
                                borderRadius: "16px",
                                p: { xs: 3, md: 4 },
                                mb: 3,
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 12px 40px rgba(10,22,40,0.2)",
                            }}
                        >
                            {/* Decorative element */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: -20,
                                    right: -20,
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    border: "2px solid rgba(6,182,212,0.15)",
                                    pointerEvents: "none",
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: -30,
                                    left: -30,
                                    width: 140,
                                    height: 140,
                                    borderRadius: "50%",
                                    border: "2px solid rgba(29,78,216,0.12)",
                                    pointerEvents: "none",
                                }}
                            />

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: "#06B6D4",
                                        animation: "scalePulse 2s ease-in-out infinite",
                                        "@keyframes scalePulse": {
                                            "0%, 100%": { transform: "scale(1)", opacity: 1 },
                                            "50%": { transform: "scale(1.5)", opacity: 0.6 },
                                        },
                                    }}
                                />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#fff",
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 700,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Our Mission
                                </Typography>
                            </Box>

                            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(255,255,255,0.75)",
                                    lineHeight: 1.9,
                                    fontFamily: "'Inter', sans-serif",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                To provide every student with a deep, logical understanding of mathematics — nurturing not just exam performance, but a genuine love for the subject that lasts a lifetime.
                            </Typography>

                            {/* Key stats in mission card */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 2,
                                    mt: 3,
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                {[
                                    { value: "5,000+", label: "Students" },
                                    { value: "98%", label: "Success Rate" },
                                    { value: "15+", label: "Educators" },
                                    { value: "13+", label: "Years" },
                                ].map((stat) => (
                                    <Box
                                        key={stat.label}
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.06)",
                                            borderRadius: "10px",
                                            p: 1.5,
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#06B6D4",
                                                fontWeight: 800,
                                                fontSize: "1.3rem",
                                                fontFamily: "'Sora', sans-serif",
                                                lineHeight: 1,
                                                mb: 0.4,
                                                letterSpacing: "-0.02em",
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "rgba(255,255,255,0.5)",
                                                fontSize: "0.68rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Values Grid */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 2,
                            }}
                        >
                            {values.map((v, i) => (
                                <Paper
                                    key={v.title}
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        border: "1px solid #E2E8F0",
                                        borderRadius: "12px",
                                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                        cursor: "default",
                                        animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1 + 0.2}s both`,
                                        "@keyframes fadeInUp": {
                                            from: { opacity: 0, transform: "translateY(16px)" },
                                            to: { opacity: 1, transform: "translateY(0)" },
                                        },
                                        "&:hover": {
                                            borderColor: v.color === "#1D4ED8" ? "#BFDBFE" : "rgba(6,182,212,0.3)",
                                            boxShadow: `0 8px 24px ${v.color === "#1D4ED8" ? "rgba(29,78,216,0.10)" : "rgba(6,182,212,0.10)"}`,
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: "10px",
                                            bgcolor: v.bg,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: v.color,
                                            mb: 1.5,
                                        }}
                                    >
                                        {v.icon}
                                    </Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 0.75,
                                            color: "#0A1628",
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        {v.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#64748B",
                                            lineHeight: 1.7,
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "0.825rem",
                                        }}
                                    >
                                        {v.description}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;