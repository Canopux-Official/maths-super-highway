import { createTheme } from '@mui/material/styles';

export const mathTheme = createTheme({
  palette: {
    primary: {
      main: '#0A1628',       // Deep Navy
      light: '#112240',      // Mid Navy
      dark: '#05101D',       // Darkest Navy
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06B6D4',       // Gold
      light: '#22D3EE',      // Gold Light
      dark: '#0891B2',       // Gold Dark
      contrastText: '#0A1628',
    },
    info: {
      main: '#1D4ED8',       // Royal Blue (CTA)
      light: '#3B82F6',      // Sky Blue
      dark: '#1E3A8A',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#0A1628',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Sora", sans-serif', fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontFamily: '"Sora", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Sora", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { 
          boxShadow: 'none', 
          borderBottom: '1px solid #E2E8F0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { 
          border: 'none', 
          boxShadow: '2px 0 20px rgba(10,22,40,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { 
          borderRadius: 10,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
          boxShadow: '0 4px 16px rgba(29,78,216,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1E40AF, #1D4ED8)',
            boxShadow: '0 6px 24px rgba(29,78,216,0.4)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
          boxShadow: '0 4px 16px rgba(6,182,212,0.25)',
          color: '#0A1628',
          '&:hover': {
            background: 'linear-gradient(135deg, #0891B2, #B45309)',
            boxShadow: '0 6px 24px rgba(6,182,212,0.35)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(10,22,40,0.06)',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
  },
});