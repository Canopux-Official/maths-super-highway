import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mathTheme } from '../../admin/theme';
import FunctionsIcon from '@mui/icons-material/Functions';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const stats = [
  { value: "5K+", label: "Students" },
  { value: "98%", label: "Success" },
  { value: "15+", label: "Educators" },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const navigate = useNavigate();
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      setStep('OTP');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');
      login(data.token);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        width: '100vw',
        m: 0,
        p: 0,
      }}
    >
      {/* ── Left Branding Panel ── */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', md: '0 0 48%' },
          width: { xs: '100%', md: '48%' },
          background: 'linear-gradient(160deg, #0A1628 0%, #112240 60%, #1D4ED8 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          color: 'white',
          p: { xs: 5, md: 7 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric decorations */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '-40px',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1.5px solid rgba(6,182,212,0.12)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '-60px',
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: '1.5px solid rgba(29,78,216,0.15)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            right: '8%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }}
        />

        {/* Math equations faint background */}
        {["∫₀^∞ e⁻ˣ dx = 1", "ax² + bx + c = 0", "e^(iπ) + 1 = 0"].map((eq, i) => (
          <Typography
            key={i}
            sx={{
              position: 'absolute',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none',
              userSelect: 'none',
              top: `${25 + i * 22}%`,
              right: `${5 + i * 3}%`,
            }}
          >
            {eq}
          </Typography>
        ))}

        <Box sx={{ zIndex: 1, maxWidth: 440, width: '100%' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
              <img src="/transparentLogo.png" alt="Logo" style={{ height: '72px', width: 'auto', objectFit: 'contain' }} />
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}
              >
                Math SuperHighway
              </Typography>
              <Typography
                sx={{
                  color: '#06B6D4',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Excellence in Mathematics
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 2,
              fontSize: { xs: '2.4rem', md: '3rem' },
              letterSpacing: '-0.03em',
            }}
          >
            Fast-track your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              learning
            </Box>{' '}
            journey.
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              lineHeight: 1.7,
              mb: { xs: 4, md: 6 },
              fontFamily: "'Inter', sans-serif",
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Join thousands of students mastering mathematics with precision and speed.
          </Typography>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)', width: 60, borderWidth: 2, borderRadius: 1, mb: 4 }} />

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {stats.map((s) => (
              <Box key={s.label}>
                <Typography
                  sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: '#06B6D4',
                    lineHeight: 1,
                    mb: 0.25,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Right Form Panel ── */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0 0 52%' },
          width: { xs: '100%', md: '52%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F8FAFC',
          overflow: 'auto',
          p: { xs: 3, md: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Form Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                mb: 0.75,
                color: '#0A1628',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              {step === 'LOGIN' ? 'Welcome back' : 'Check your email'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
              }}
            >
              {step === 'LOGIN'
                ? 'Sign in to access your learning dashboard.'
                : `We sent a 6-digit code to ${email}`}
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '10px',
                border: '1px solid rgba(239,68,68,0.2)',
                bgcolor: 'rgba(239,68,68,0.05)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Role tabs */}
          {step === 'LOGIN' && (
            <Box
              sx={{
                mb: 3.5,
                p: 0.5,
                bgcolor: '#E2E8F0',
                borderRadius: '10px',
                display: 'flex',
              }}
            >
              {(['student', 'admin'] as const).map((r) => (
                <Box
                  key={r}
                  onClick={() => setRole(r)}
                  sx={{
                    flex: 1,
                    py: 1,
                    textAlign: 'center',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    bgcolor: role === r ? '#fff' : 'transparent',
                    boxShadow: role === r ? '0 1px 4px rgba(10,22,40,0.10)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: role === r ? 700 : 500,
                      fontSize: '0.875rem',
                      color: role === r ? '#0A1628' : '#94A3B8',
                      textTransform: 'capitalize',
                      transition: 'color 0.2s',
                    }}
                  >
                    {r}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {step === 'LOGIN' ? (
            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#BFDBFE' },
                    '&.Mui-focused fieldset': { borderColor: '#1D4ED8' },
                  },
                  '& label.Mui-focused': { color: '#1D4ED8' },
                  mb: 0.5,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: '#94A3B8' }}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#BFDBFE' },
                    '&.Mui-focused fieldset': { borderColor: '#1D4ED8' },
                  },
                  '& label.Mui-focused': { color: '#1D4ED8' },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 3.5,
                  mb: 2,
                  py: 1.6,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0A1628, #1D4ED8)',
                  boxShadow: '0 4px 20px rgba(29,78,216,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #112240, #2563EB)',
                    boxShadow: '0 6px 28px rgba(29,78,216,0.45)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:disabled': { background: '#E2E8F0', color: '#94A3B8', boxShadow: 'none' },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                  New to Math SuperHighway?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#1D4ED8',
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerifyOtp} noValidate>
              {/* OTP boxes */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="6-Digit OTP"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                slotProps={{
                  input: {
                    sx: {
                      textAlign: 'center',
                      letterSpacing: '0.5em',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      fontFamily: "'Sora', sans-serif",
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: '10px',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&.Mui-focused fieldset': { borderColor: '#1D4ED8' },
                  },
                  '& label.Mui-focused': { color: '#1D4ED8' },
                }}
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3.5,
                  mb: 2,
                  py: 1.6,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0A1628, #1D4ED8)',
                  boxShadow: '0 4px 20px rgba(29,78,216,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #112240, #2563EB)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => setStep('LOGIN')}
                sx={{
                  color: '#64748B',
                  fontFamily: "'Inter', sans-serif",
                  '&:hover': { color: '#0A1628', background: 'rgba(10,22,40,0.04)' },
                  borderRadius: '10px',
                }}
              >
                Use a different account
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
