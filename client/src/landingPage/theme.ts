import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#042e2e", // Deep Navy
            light: "#042e2e",
            dark: "#042e2e",
        },
        secondary: {
            main: "#C8960C", // Gold accent
            light: "#F5B800",
            dark: "#9A6F00",
        },
        background: {
            default: "#FAFAFA",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1A1A2E",
            secondary: "#4A4A6A",
        },
    },
    typography: {
        fontFamily: "'Source Sans Pro', sans-serif",
        h1: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
        },
        h2: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
        },
        h3: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
        },
        h4: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
        },
        h5: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
        },
        h6: {
            fontFamily: "'Source Sans Pro', sans-serif",
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    padding: "10px 28px",
                    fontSize: "0.95rem",
                    textTransform: "none", // Common professional preference
                },
            },
            // Use variants for specific styles like "contained" + "primary"
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        boxShadow: "none",
                        "&:hover": {
                            boxShadow: "0 4px 16px rgba(26,35,126,0.25)",
                        },
                    },
                },
            ],
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;