import React from "react";
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

    { icon: <YouTubeIcon />, label: "YouTube", href: "#" },

    { icon: <FacebookIcon />, label: "Facebook", href: "#" },

    { icon: <InstagramIcon />, label: "Instagram", href: "#" },

    { icon: <TelegramIcon />, label: "Telegram", href: "#" },

];

const Footer: React.FC = () => {
    const handleNavClick = (href: string) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            id="footer"
            component="footer"
            sx={{ bgcolor: "primary.dark", color: "rgba(255,255,255,0.8)" }}
        >
            <Container maxWidth="lg">
                {/* Top Section - Replaced Grid with Flexbox/CSS Grid */}
                <Box
                    sx={{
                        py: { xs: 6, md: 8 },
                        display: "grid",
                        // Layout: 1 col on mobile, 2 col on tablet, 4 col on desktop
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "2fr 1fr 1fr 1.5fr",
                        },
                        gap: 5,
                    }}
                >
                    {/* Brand Column */}
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <FunctionsIcon sx={{ color: "secondary.main", fontSize: 30 }} />
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ color: "#fff", fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}
                                >
                                    Maths Super Highway
                                </Typography>
                                <Typography variant="caption" sx={{ color: "secondary.light", letterSpacing: "0.15em", fontSize: "0.65rem" }}>
                                    EXCELLENCE IN MATHEMATICS
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.9, mb: 3, color: "rgba(255,255,255,0.6)", maxWidth: 300 }}>
                            Empowering students through deep mathematical understanding since 2010. Your success is our mission.
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            {socials.map((s) => (
                                <IconButton
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    size="small"
                                    sx={{
                                        color: "rgba(255,255,255,0.5)",
                                        "&:hover": { color: "secondary.main", bgcolor: "rgba(255,255,255,0.06)" },
                                    }}
                                >
                                    {s.icon}
                                </IconButton>
                            ))}
                        </Stack>
                    </Box>

                    {/* Quick Links Column */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#fff", fontWeight: 700, mb: 2, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.75rem" }}
                        >
                            Quick Links
                        </Typography>
                        <Stack spacing={1}>
                            {quickLinks.map((l) => (
                                <Link
                                    key={l.label}
                                    component="button"
                                    underline="none"
                                    onClick={() => handleNavClick(l.href)}
                                    sx={{
                                        color: "rgba(255,255,255,0.6)",
                                        fontSize: "0.875rem",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        transition: "color 0.2s",
                                        "&:hover": { color: "secondary.light" },
                                    }}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </Stack>
                    </Box>

                    {/* Programs Column */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#fff", fontWeight: 700, mb: 2, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.75rem" }}
                        >
                            Programs
                        </Typography>
                        <Stack spacing={1}>
                            {programs.map((p) => (
                                <Typography
                                    key={p}
                                    variant="body2"
                                    sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}
                                >
                                    {p}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    {/* Contact + Newsletter Column */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#fff", fontWeight: 700, mb: 2, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.75rem" }}
                        >
                            Contact Us
                        </Typography>
                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                <LocationOnIcon sx={{ fontSize: 18, color: "secondary.main", mt: 0.2 }} />
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                                    Plot No. 42, Saheed Nagar,<br />Bhubaneswar, Odisha — 751007
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                <PhoneIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                                    +91 98765 43210
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                                <EmailIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                                    hello@mathssuperhighway.com
                                </Typography>
                            </Box>
                        </Stack>

                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#fff", fontWeight: 700, mb: 1.5, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.75rem" }}
                        >
                            Newsletter
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Email address"
                                variant="outlined"
                                sx={{
                                    flexGrow: 1,
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "rgba(255,255,255,0.06)",
                                        "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                    },
                                    "& input": { color: "#fff", fontSize: "0.85rem" },
                                }}
                            />
                            <Button variant="contained" color="secondary" size="small" sx={{ color: "#fff", px: 2 }}>
                                Join
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                {/* Bottom Section */}
                <Box
                    sx={{
                        py: 2.5,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                        © {new Date().getFullYear()} Maths Super Highway.
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                        Privacy Policy &nbsp;·&nbsp; Terms of Use
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;