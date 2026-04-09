import { createTheme } from '@mui/material/styles';

export const mathTheme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',       // Highway Blue
      light: '#1e3a5f',      // Deep Lane (sidebar bg tint)
      dark: '#0d1b2a',       // Asphalt Navy
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107',       // Speed Yellow / Amber
      light: '#fff8e1',
      dark: '#b8860b',
      contrastText: '#0d1b2a',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#0d1b2a',
      secondary: '#5f6b7a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
    subtitle1: { fontWeight: 600 },
    body2: { fontSize: '0.8125rem' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', borderBottom: '1px solid #e8eaf0' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { border: 'none', boxShadow: '2px 0 16px rgba(13,27,42,0.12)' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});