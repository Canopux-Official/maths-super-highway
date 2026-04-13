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
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mathTheme } from '../../admin/theme';
import SpeedIcon from '@mui/icons-material/Speed';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'SIGNUP' | 'OTP'>('SIGNUP');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const navigate = useNavigate();
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      setSuccess('Signup initiated. Please check your email for the OTP.');
      setStep('OTP');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
      navigate('/student/courses');
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
            {step === 'SIGNUP' ? 'Create Account' : 'Verify Email'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {step === 'SIGNUP' ? 'Join the highway and start your learning journey today.' : `We've sent a code to ${email}`}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          {step === 'SIGNUP' && (
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

          {step === 'SIGNUP' && role === 'student' && (
            <Box component="form" onSubmit={handleSignup} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
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
                {loading ? 'Processing...' : 'Create Account'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already on the highway?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: mathTheme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}

          {step === 'SIGNUP' && role === 'admin' && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.7 }}>
                Admin accounts are pre-configured by the institution. Please reach out to management
                or sign in if you already have credentials.
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                fullWidth
                sx={{
                  py: 1.8,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: 2,
                }}
              >
                Go to Login
              </Button>
            </Box>
          )}

          {step === 'OTP' && (
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
                onClick={() => setStep('SIGNUP')}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                Change details
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SignupPage;