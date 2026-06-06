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
    Box,
    Container,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FunctionsIcon from "@mui/icons-material/Functions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";

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
    const navigate: any = useNavigate();
    const { user, logout } = useAuth();
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const confirmLogout = () => {
        setLogoutConfirmOpen(false);
        setDrawerOpen(false);
        logout();
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setDrawerOpen(false);
        if (href.startsWith("#")) {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (href === "/signup" && user) {
            navigate(user.role === "admin" ? "/admin" : "/student");
        } else {
            navigate(href);
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: scrolled
                        ? "rgba(10, 22, 40, 0.92)"
                        : "transparent",
                    backdropFilter: scrolled ? "blur(20px)" : "none",
                    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.25)" : "none",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ py: { xs: 1, md: 1.25 } }}>
                        {/* Logo */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.25,
                                flexGrow: 1,
                                cursor: "pointer",
                            }}
                            onClick={() => handleNavClick("#hero")}
                        >
                                <img src="/transparentLogo.png" alt="Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
                            <Box>
                                <Typography
                                    sx={{
                                        color: "#fff",
                                        fontFamily: "'Sora', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        lineHeight: 1.15,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Math SuperHighway
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#06B6D4",
                                        letterSpacing: "0.14em",
                                        fontSize: "0.6rem",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                    }}
                                >
                                    Excellence in Mathematics
                                </Typography>
                            </Box>
                        </Box>

                        {/* Desktop Nav */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.label}
                                    onClick={() => handleNavClick(link.href)}
                                    sx={{
                                        color: "rgba(255,255,255,0.85)",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        px: 1.75,
                                        py: 1,
                                        borderRadius: "8px",
                                        position: "relative",
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 6,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 0,
                                            height: "2px",
                                            background: "#06B6D4",
                                            borderRadius: "1px",
                                            transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                        },
                                        "&:hover": {
                                            color: "#fff",
                                            background: "rgba(255,255,255,0.07)",
                                            "&::after": { width: "calc(100% - 28px)" },
                                        },
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <Button
                                variant="contained"
                                onClick={() => handleNavClick("/signup")}
                                sx={{
                                    ml: 1.5,
                                    background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                                    color: "#0A1628",
                                    fontWeight: 700,
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: "8px",
                                    fontSize: "0.875rem",
                                    boxShadow: "0 4px 16px rgba(6,182,212,0.35)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #22D3EE, #06B6D4)",
                                        boxShadow: "0 6px 20px rgba(6,182,212,0.5)",
                                        transform: "translateY(-1px)",
                                    },
                                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                {user ? "Dashboard" : "Enroll Now"}
                            </Button>
                            {user && (
                                <Button
                                    variant="outlined"
                                    onClick={() => setLogoutConfirmOpen(true)}
                                    sx={{
                                        ml: 1,
                                        borderColor: "rgba(255,255,255,0.3)",
                                        color: "#fff",
                                        fontWeight: 600,
                                        px: 2,
                                        py: 1,
                                        borderRadius: "8px",
                                        "&:hover": {
                                            borderColor: "rgba(239, 68, 68, 0.5)",
                                            color: "#EF4444",
                                            background: "rgba(239, 68, 68, 0.1)",
                                        }
                                    }}
                                >
                                    Logout
                                </Button>
                            )}
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
                slotProps={{
                    paper: {
                        sx: {
                            width: 280,
                            background: "#05101D",
                            borderLeft: "1px solid rgba(255,255,255,0.08)",
                        },
                    },
                }}
            >
                {/* Drawer Header */}
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <img src="/transparentLogo.png" alt="Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                        <Typography
                            sx={{
                                color: "#fff",
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                            }}
                        >
                            MSH
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "rgba(255,255,255,0.6)" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Drawer Links */}
                <List sx={{ px: 1.5, pt: 1.5 }}>
                    {navLinks.map((link) => (
                        <ListItem key={link.label} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavClick(link.href)}
                                sx={{
                                    borderRadius: "8px",
                                    color: "rgba(255,255,255,0.75)",
                                    "&:hover": {
                                        bgcolor: "rgba(255,255,255,0.06)",
                                        color: "#fff",
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={link.label}
                                    slotProps={{
                                        primary: { sx: { fontWeight: 500, fontSize: "0.9375rem" } },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem sx={{ pt: 2, px: 0 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleNavClick("/signup")}
                            sx={{
                                background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                                color: "#0A1628",
                                fontWeight: 700,
                                py: 1.25,
                                borderRadius: "8px",
                                boxShadow: "0 4px 16px rgba(6,182,212,0.3)",
                            }}
                        >
                            {user ? "Dashboard" : "Enroll Now"}
                        </Button>
                    </ListItem>
                    {user && (
                        <ListItem sx={{ pt: 1, px: 0 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setLogoutConfirmOpen(true)}
                                sx={{
                                    borderColor: "rgba(239, 68, 68, 0.4)",
                                    color: "#EF4444",
                                    fontWeight: 700,
                                    py: 1.25,
                                    borderRadius: "8px",
                                    "&:hover": {
                                        background: "rgba(239, 68, 68, 0.1)",
                                    }
                                }}
                            >
                                Logout
                            </Button>
                        </ListItem>
                    )}
                </List>
            </Drawer>

            <ConfirmDialog 
                open={logoutConfirmOpen} 
                title="Logout" 
                message="Are you sure you want to log out?" 
                onConfirm={confirmLogout} 
                onCancel={() => setLogoutConfirmOpen(false)} 
                confirmColor="error" 
                confirmText="Logout"
            />
        </>
    );
};

export default Header;
