import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Divider,
    IconButton,
    Link,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const quickLinks = [
    { label: "Home", href: "#hero" },
    { label: "Courses", href: "#courses" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "About Us", href: "#about" },
];

const programs = [
    "Foundation Mathematics",
    "Secondary Mathematics",
    "JEE / Competitive Maths",
    "Olympiad Preparation",
];

const socials = [
    { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, label: "YouTube", href: "#", color: "#FF0000" },
    { icon: <FacebookIcon sx={{ fontSize: 18 }} />, label: "Facebook", href: "#", color: "#1877F2" },
    { icon: <InstagramIcon sx={{ fontSize: 18 }} />, label: "Instagram", href: "#", color: "#E4405F" },
    { icon: <TelegramIcon sx={{ fontSize: 18 }} />, label: "Telegram", href: "#", color: "#2AABEE" },
];

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleNavClick = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubscribe = () => {
        if (!email) {
            alert('Please enter an email address.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        alert('Thank you for subscribing to our newsletter!');
        setEmail('');
    };

    return (
        <Box
            id="footer"
            component="footer"
            sx={{
                bgcolor: "#05101D",
                color: "rgba(255,255,255,0.75)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Geometric top accent */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "linear-gradient(90deg, #0A1628, #1D4ED8 30%, #06B6D4 70%, #0A1628)",
                }}
            />

            {/* Subtle background pattern */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                        radial-gradient(circle at 80% 20%, rgba(29,78,216,0.06) 0%, transparent 40%),
                        radial-gradient(circle at 20% 80%, rgba(6,182,212,0.04) 0%, transparent 40%)
                    `,
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                {/* Top Section */}
                <Box
                    sx={{
                        pt: { xs: 7, md: 9 },
                        pb: { xs: 6, md: 8 },
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "2fr 1fr 1fr 1.6fr",
                        },
                        gap: { xs: 5, md: 6 },
                    }}
                >
                    {/* Brand Column */}
                    <Box>
                        {/* Logo */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
                                <img src="/transparentLogo.png" alt="Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
                            <Box>
                                <Typography
                                    sx={{
                                        color: "#fff",
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Math SuperHighway
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#06B6D4",
                                        letterSpacing: "0.14em",
                                        fontSize: "0.58rem",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Excellence in Mathematics
                                </Typography>
                            </Box>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                lineHeight: 1.9,
                                mb: 3.5,
                                color: "rgba(255,255,255,0.55)",
                                maxWidth: 300,
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.875rem",
                            }}
                        >
                            Empowering students through deep mathematical understanding since 2010. Your success is our mission.
                        </Typography>

                        {/* Socials */}
                        <Stack direction="row" spacing={0.75}>
                            {socials.map((s) => (
                                <IconButton
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    size="small"
                                    sx={{
                                        color: "rgba(255,255,255,0.4)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "8px",
                                        width: 36,
                                        height: 36,
                                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                        "&:hover": {
                                            color: s.color,
                                            borderColor: s.color,
                                            background: `${s.color}15`,
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    {s.icon}
                                </IconButton>
                            ))}
                        </Stack>
                    </Box>

                    {/* Quick Links */}
                    <Box>
                        <Typography
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                mb: 2.5,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontSize: "0.72rem",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Quick Links
                        </Typography>
                        <Stack spacing={1.25}>
                            {quickLinks.map((l) => (
                                <Link
                                    key={l.label}
                                    component="button"
                                    underline="none"
                                    onClick={() => handleNavClick(l.href)}
                                    sx={{
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: "0.875rem",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        fontFamily: "'Inter', sans-serif",
                                        "&:hover": {
                                            color: "#06B6D4",
                                            paddingLeft: "4px",
                                        },
                                    }}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </Stack>
                    </Box>

                    {/* Programs */}
                    <Box>
                        <Typography
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                mb: 2.5,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontSize: "0.72rem",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Programs
                        </Typography>
                        <Stack spacing={1.25}>
                            {programs.map((p) => (
                                <Typography
                                    key={p}
                                    variant="body2"
                                    sx={{
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: "0.875rem",
                                        fontFamily: "'Inter', sans-serif",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {p}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    {/* Contact + Newsletter */}
                    <Box>
                        <Typography
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                mb: 2.5,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontSize: "0.72rem",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Contact Us
                        </Typography>
                        <Stack spacing={1.75} sx={{ mb: 4 }}>
                            {[
                                {
                                    icon: <LocationOnIcon sx={{ fontSize: 16, color: "#06B6D4", mt: 0.2 }} />,
                                    content: <>Plot No. 42, Saheed Nagar,<br />Bhubaneswar, Odisha — 751007</>,
                                },
                                {
                                    icon: <PhoneIcon sx={{ fontSize: 16, color: "#06B6D4" }} />,
                                    content: "+91 98765 43210",
                                },
                                {
                                    icon: <EmailIcon sx={{ fontSize: 16, color: "#06B6D4" }} />,
                                    content: "hello@mathsuperhighway.com",
                                },
                            ].map((item, i) => (
                                <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                    {item.icon}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "rgba(255,255,255,0.55)",
                                            lineHeight: 1.6,
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        {item.content}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        {/* Newsletter */}
                        <Typography
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                mb: 1.5,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontSize: "0.72rem",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Newsletter
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Your email address"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    flexGrow: 1,
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "rgba(255,255,255,0.05)",
                                        borderRadius: "8px",
                                        "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                                        "&.Mui-focused fieldset": { borderColor: "#1D4ED8" },
                                    },
                                    "& input": {
                                        color: "#fff",
                                        fontSize: "0.825rem",
                                        fontFamily: "'Inter', sans-serif",
                                        "&::placeholder": { color: "rgba(255,255,255,0.3)" },
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleSubscribe}
                                sx={{
                                    background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                                    color: "#0A1628",
                                    fontWeight: 700,
                                    px: 1.75,
                                    borderRadius: "8px",
                                    minWidth: "auto",
                                    flexShrink: 0,
                                    boxShadow: "0 4px 12px rgba(6,182,212,0.3)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                                        boxShadow: "0 6px 16px rgba(6,182,212,0.4)",
                                    },
                                }}
                            >
                                <ArrowForwardIcon sx={{ fontSize: 18 }} />
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Divider */}
                <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />

                {/* Bottom Bar */}
                <Box
                    sx={{
                        py: 3,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "rgba(255,255,255,0.3)",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.775rem",
                        }}
                    >
                        © {new Date().getFullYear()} Math SuperHighway. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={2.5}>
                        {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                underline="none"
                                sx={{
                                    color: "rgba(255,255,255,0.3)",
                                    fontSize: "0.775rem",
                                    fontFamily: "'Inter', sans-serif",
                                    transition: "color 0.2s",
                                    "&:hover": { color: "rgba(255,255,255,0.7)" },
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;