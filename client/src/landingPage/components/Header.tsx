import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Container,
    ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FunctionsIcon from "@mui/icons-material/Functions";
import { green } from "@mui/material/colors";

const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Courses", href: "#courses" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#footer" },
];

const Header: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setDrawerOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={scrolled ? 3 : 0}
                sx={{
                    // background: "linear-gradient(to bottom, rgba(1, 28, 10, 0.92), rgba(1, 24, 17, 0.6))",
                    transition: "all 0.3s ease",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ py: 0.5 }}>
                        {/* Logo */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexGrow: 1,
                                cursor: "pointer",
                            }}
                            onClick={() => handleNavClick("#hero")}
                        >
                            <FunctionsIcon sx={{ color: "secondary.main", fontSize: 32 }} />
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#fff",
                                        fontFamily: "'Playfair Display', serif",
                                        fontWeight: 700,
                                        lineHeight: 1.1,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    Maths Super Highway
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: "secondary.light", letterSpacing: "0.12em", fontSize: "0.65rem" }}
                                >
                                    EXCELLENCE IN MATHEMATICS
                                </Typography>
                            </Box>
                        </Box>

                        {/* Desktop Nav */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.label}
                                    onClick={() => handleNavClick(link.href)}
                                    sx={{
                                        color: "#fff",
                                        fontSize: "0.875rem",
                                        px: 1.5,
                                        "&:hover": { color: "secondary.light", background: "transparent" },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleNavClick("#courses")}
                                sx={{ ml: 1.5, color: "#fff" }}
                            >
                                Enroll Now
                            </Button>
                        </Box>

                        {/* Mobile Menu Icon */}
                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                // PaperProps is now in slotProps.paper
                slotProps={{
                    paper: {
                        sx: { width: 260, bgcolor: "primary.dark" }
                    }
                }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List>
                    {navLinks.map((link) => (
                        <ListItem
                            key={link.label}
                            disablePadding // Added this for better button behavior in MUI
                        >
                            <ListItemButton // Better practice than component="button"
                                onClick={() => handleNavClick(link.href)}
                                sx={{
                                    color: "#fff",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                                }}
                            >
                                <ListItemText
                                    primary={link.label}
                                    // primaryTypographyProps is now in slotProps.primary
                                    slotProps={{
                                        primary: {
                                            sx: { fontWeight: 500 }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem sx={{ pt: 2, px: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => handleNavClick("#courses")}
                            sx={{ color: "#fff" }}
                        >
                            Enroll Now
                        </Button>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Header;