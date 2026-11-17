import React, { useEffect, useRef } from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import bg from "../../../public/bgImage.jpg";
import LiveUpdates from "./LiveUpdates";

const stats = [
    { value: 5000, suffix: "+", decimals: 0, label: "Students enrolled" },
    { value: 98, suffix: "%", decimals: 0, label: "Success rate" },
    { value: 15, suffix: "+", decimals: 0, label: "Expert educators" },
    { value: 4.9, suffix: "/5", decimals: 1, label: "Average rating" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Counts up from 0 the first time it scrolls into view. */
const CountUp: React.FC<{ value: number; decimals: number; suffix: string }> = ({ value, decimals, suffix }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const el = ref.current;
        if (!el || !inView) return;
        const format = (v: number) =>
            v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (reduceMotion) {
            el.textContent = format(value);
            return;
        }
        const controls = animate(0, value, {
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => (el.textContent = format(v)),
        });
        return () => controls.stop();
    }, [inView, value, decimals, suffix, reduceMotion]);

    return <span ref={ref}>{(0).toFixed(decimals) + suffix}</span>;
};

const Hero: React.FC = () => {
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
                overflow: "hidden",
            }}
        >
            {/* Background */}
            <Box sx={{ position: "absolute", inset: 0, backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(2px)", transform: "scale(1.05)", zIndex: 0 }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(5,16,29,0.94) 0%, rgba(10,22,40,0.9) 50%, rgba(17,34,64,0.95) 100%)", zIndex: 1 }} />
            <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 85% 40%, rgba(34,211,238,0.07) 0%, transparent 70%)", zIndex: 2 }} />

            {/* Main content */}
            <Container
                maxWidth="lg"
                sx={{
                    position: "relative", zIndex: 10,
                    pt: { xs: 19, md: 15 }, // phones also have the news strip under the navbar
                    pb: { xs: 7, md: 9 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", lg:"minmax(0, 1.08fr) minmax(0, 0.92fr)" },
                        gap: { xs: 6, lg: 7 },
                        alignItems: "center",
                    }}
                >
                    {/* ── Pitch ── */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
                    >
                        <Box sx={{ textAlign: { xs: "center", lg: "left" }, maxWidth: { xs: 680, lg: "none" }, mx: { xs: "auto", lg: 0 } }}>
                            <motion.div variants={fadeUp}>
                                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                    <Box sx={{ width: 28, height: "1px", bgcolor: "#22D3EE" }} />
                                    <Typography sx={{ color: "#CBD5E1", fontWeight: 500, fontSize: "0.92rem" }}>
                                        India's premier maths coaching
                                    </Typography>
                                </Box>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        color: "#fff",
                                        fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4rem" },
                                        fontWeight: 800, lineHeight: 1.05, mb: 2,
                                        letterSpacing: "-0.035em",
                                    }}
                                >
                                    Master{" "}
                                    <Box component="span" sx={{ color: "#22D3EE" }}>
                                        Mathematics.
                                    </Box>
                                </Typography>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Sora', sans-serif",
                                        color: "rgba(255,255,255,0.9)",
                                        fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.4rem" },
                                        fontWeight: 600, lineHeight: 1.35, mb: 2.5,
                                        letterSpacing: "-0.015em",
                                    }}
                                >
                                    Learn better. Score higher. Excel at every examination.
                                </Typography>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Typography
                                    sx={{
                                        color: "rgba(255,255,255,0.62)",
                                        fontSize: { xs: "0.95rem", md: "1.05rem" },
                                        lineHeight: 1.8, mb: 4.5,
                                        maxWidth: 540,
                                        mx: { xs: "auto", lg: 0 },
                                    }}
                                >
                                    From foundational concepts to advanced competitive mathematics — our structured programs build clarity, confidence, and excellence in every student.
                                </Typography>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Stack sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 1.75, justifyContent: { xs: "center", lg: "flex-start" } }}>
                                    <Button
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => handleScroll("#courses")}
                                        sx={{
                                            background: "#06B6D4",
                                            color: "#0A1628", fontWeight: 700,
                                            px: 3.5, py: 1.5, borderRadius: "10px", fontSize: "0.95rem",
                                            boxShadow: "none",
                                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                            "& .MuiButton-endIcon": { transition: "transform 0.25s" },
                                            "&:hover": { background: "#22D3EE", boxShadow: "none" },
                                            "&:hover .MuiButton-endIcon": { transform: "translateX(3px)" },
                                        }}
                                    >
                                        Explore Courses
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleScroll("#results")}
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.92)",
                                            px: 3.5, py: 1.5, borderRadius: "10px", fontSize: "0.95rem", fontWeight: 600,
                                            background: "transparent",
                                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                                                                        "&:hover": { borderColor: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)" },
                                        }}
                                    >
                                        See Our Results
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Box>
                    </motion.div>

                    {/* ── Live Updates ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Box sx={{ maxWidth: { xs: 620, lg: "none" }, mx: "auto" }}>
                            <LiveUpdates />
                        </Box>
                    </motion.div>
                </Box>

                {/* ── Stats Row ── */}
                <Box
                    sx={{
                        mt: { xs: 7, md: 9 },
                        pt: { xs: 3, md: 4 },
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                        rowGap: 3,
                    }}
                >
                    {stats.map((stat, i) => (
                        <Box
                            key={stat.label}
                            sx={{
                                px: { xs: 0, md: 3 },
                                pl: { md: i === 0 ? 0 : 3 },
                                borderLeft: { md: i === 0 ? "none" : "1px solid rgba(255,255,255,0.1)" },
                            }}
                        >
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: "1.75rem", md: "2.1rem" }, fontFamily: "'Sora', sans-serif", lineHeight: 1, mb: 0.75, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                                <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                            </Typography>
                            <Typography sx={{ color: "#94A3B8", fontSize: "0.9rem" }}>
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
