import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0A1628",      // Deep Navy
            light: "#112240",     // Mid Navy
            dark: "#05101D",      // Darkest Navy
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#06B6D4",      // Gold
            light: "#22D3EE",     // Gold Light
            dark: "#0891B2",      // Gold Dark
            contrastText: "#0A1628",
        },
        info: {
            main: "#1D4ED8",      // Royal Blue
            light: "#3B82F6",     // Sky Blue
            dark: "#1E3A8A",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#F8FAFC",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#0A1628",
            secondary: "#475569",
        },
        divider: "#E2E8F0",
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h1: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.025em",
        },
        h2: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
        },
        h3: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.015em",
        },
        h4: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
        },
        h5: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
        },
        h6: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
        },
        body1: {
            lineHeight: 1.7,
        },
        body2: {
            lineHeight: 1.6,
            fontSize: "0.875rem",
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "10px 28px",
                    fontSize: "0.9375rem",
                    textTransform: "none",
                    fontWeight: 600,
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&.MuiButton-containedPrimary": {
                        background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
                        boxShadow: "0 4px 16px rgba(29,78,216,0.3)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #1E40AF, #1D4ED8)",
                            boxShadow: "0 6px 24px rgba(29,78,216,0.4)",
                            transform: "translateY(-1px)",
                        },
                    },
                    "&.MuiButton-containedSecondary": {
                        background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                        boxShadow: "0 4px 16px rgba(6,182,212,0.3)",
                        color: "#0A1628",
                        "&:hover": {
                            background: "linear-gradient(135deg, #0891B2, #B45309)",
                            boxShadow: "0 6px 24px rgba(6,182,212,0.4)",
                            transform: "translateY(-1px)",
                        },
                    },
                    "&.MuiButton-outlinedPrimary": {
                        borderColor: "rgba(29,78,216,0.5)",
                        "&:hover": {
                            borderColor: "#1D4ED8",
                            background: "rgba(29,78,216,0.05)",
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 12px rgba(10,22,40,0.06)",
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                },
            },
        },
    },
});

export default theme;
