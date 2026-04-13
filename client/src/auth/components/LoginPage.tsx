import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mathTheme } from '../../admin/theme';
import SpeedIcon from '@mui/icons-material/Speed';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        navigate('/admin/headlines');
      } else {
        navigate('/student/courses');
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
      {/* Branding Panel — full width banner on mobile, 50% on desktop */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', md: '0 0 50%' },
          width: { xs: '100%', md: '50%' },
          background: `linear-gradient(135deg, ${mathTheme.palette.primary.main} 0%, #1a237e 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: { xs: 4, md: 6 },
          py: { xs: 5, md: 6 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative "Highway" lines */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 50px, #fff 50px, #fff 55px)',
            maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            zIndex: 1,
            textAlign: { xs: 'center', md: 'left' },
            maxWidth: 480,
            width: '100%',
          }}
        >
          <SpeedIcon sx={{ fontSize: { xs: 56, md: 100 }, mb: 2, color: '#ffd700' }} />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              mb: 2,
              fontSize: { xs: '2.4rem', sm: '3rem', md: '3.75rem' },
            }}
          >
            Maths Super <br /> Highway
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.8,
              fontWeight: 300,
              mb: { xs: 0, md: 4 },
              fontSize: { xs: '1rem', md: '1.5rem' },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Fast-track your learning journey with precision and speed.
          </Typography>
          <Divider
            sx={{
              borderColor: 'rgba(255,255,255,0.2)',
              width: '60px',
              borderWidth: 3,
              borderRadius: 1,
              display: { xs: 'none', md: 'block' },
              mx: { xs: 'auto', md: 0 },
            }}
          />
        </Box>
      </Box>

      {/* Form Panel — full width on mobile, 50% on desktop */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0 0 50%' },
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#ffffff',
          overflow: 'auto',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420, p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
            {step === 'LOGIN' ? 'Sign In' : 'One-Time Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {step === 'LOGIN'
              ? 'Access your dashboard to continue learning.'
              : `We've sent a code to ${email}`}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {step === 'LOGIN' && (
            <Tabs
              value={role}
              onChange={(_, newValue) => setRole(newValue)}
              variant="fullWidth"
              sx={{
                mb: 4,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 },
              }}
            >
              <Tab label="Student" value="student" />
              <Tab label="Admin" value="admin" />
            </Tabs>
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {loading ? 'Accelerating...' : 'Get Started'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  New to the highway?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: mathTheme.palette.primary.main,
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Enter 6-digit OTP"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                slotProps={{
                  input: { sx: { textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' } },
                }}
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 4, mb: 2, py: 1.8 }}
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => setStep('LOGIN')}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
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