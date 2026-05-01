import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, TextField, Button, Stack, Chip,
  ThemeProvider, createTheme, CssBaseline, Snackbar, Alert,
} from '@mui/material'
import {
  Functions, Calculate, School, TrendingUp, NotificationsActive,
  Speed, EmojiObjects, Psychology,
} from '@mui/icons-material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00E5FF' },
    secondary: { main: '#FF6B35' },
    background: { default: '#020818', paper: '#0A1628' },
  },
  typography: { fontFamily: '"Syne", sans-serif', h1: { fontWeight: 800 } },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 4, textTransform: 'none', fontWeight: 700, fontSize: '1rem' } } },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '& fieldset': { borderColor: 'rgba(0,229,255,0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(0,229,255,0.6)' },
            '&.Mui-focused fieldset': { borderColor: '#00E5FF' },
          },
        },
      },
    },
  },
})

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

const LAUNCH_DATE = new Date('2025-09-01T00:00:00')

function calculateTimeLeft(): TimeLeft {
  const diff = +LAUNCH_DATE - +new Date()
  if (diff > 0) return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{
      textAlign: 'center', minWidth: { xs: 64, sm: 90 },
      background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)',
      borderRadius: 2, p: { xs: 1.5, sm: 2.5 }, position: 'relative', overflow: 'hidden',
      '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)' },
    }}>
      <Typography variant="h3" sx={{
        fontFamily: '"Space Mono", monospace', fontWeight: 700, color: '#00E5FF',
        fontSize: { xs: '1.8rem', sm: '2.8rem' }, lineHeight: 1, textShadow: '0 0 20px rgba(0,229,255,0.5)',
      }}>
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', mt: 0.5 }}>{label}</Typography>
    </Box>
  )
}

const FEATURES = [
  { icon: <Speed />, label: 'Adaptive Learning Paths' },
  { icon: <Psychology />, label: 'AI-Powered Tutoring' },
  { icon: <EmojiObjects />, label: 'Interactive Problem Sets' },
  { icon: <TrendingUp />, label: 'Real-time Progress Tracking' },
  { icon: <School />, label: 'Curriculum Aligned' },
  { icon: <Calculate />, label: 'Step-by-Step Solutions' },
]

const MATH_SYMBOLS = ['∑', 'π', '∞', '√', '∫', 'Δ', 'θ', '≠', '÷', '×', '±', 'φ', 'λ', 'Ω', 'α', 'β']

export default function CommingSoonPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, symbol: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 1.4 + 0.6, delay: Math.random() * 8, duration: Math.random() * 6 + 8,
    }))
  )

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNotify = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setEmailError(true); return }
    setEmailError(false); setOpen(true); setEmail('')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes floatUp { 0% { transform: translateY(0px) rotate(0deg); opacity: 0.06; } 50% { opacity: 0.12; } 100% { transform: translateY(-40px) rotate(15deg); opacity: 0.06; } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        body { overflow-x: hidden; }
      `}</style>

      <Box sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 50%, #051030 0%, #020818 50%, #030D1A 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <Box sx={{ position: 'fixed', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', zIndex: 0 }} />
        <Box sx={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', zIndex: 0 }} />

        {particles.map(p => (
          <Typography key={p.id} sx={{
            position: 'fixed', left: `${p.left}%`, top: `${p.top}%`,
            fontSize: `${p.size * 2}rem`,
            color: p.id % 3 === 0 ? '#00E5FF' : p.id % 3 === 1 ? '#FF6B35' : '#ffffff',
            opacity: 0.06, userSelect: 'none', pointerEvents: 'none', zIndex: 0,
            animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            fontFamily: '"Space Mono", monospace',
          }}>{p.symbol}</Typography>
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>

          {/* Logo Section */}
          <Box sx={{ textAlign: 'center', mb: 6, animation: 'slideInUp 0.8s ease forwards' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box sx={{
                width: { xs: 72, md: 88 }, height: { xs: 72, md: 88 }, borderRadius: '20px',
                background: 'linear-gradient(135deg, #00E5FF 0%, #0055CC 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(0,229,255,0.4), 0 0 80px rgba(0,229,255,0.15)',
              }}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <rect x="5" y="22" width="40" height="5" rx="2.5" fill="white" opacity="0.95"/>
                  <rect x="11" y="24" width="7" height="2" rx="1" fill="#0055CC"/>
                  <rect x="22" y="24" width="7" height="2" rx="1" fill="#0055CC"/>
                  <rect x="33" y="24" width="7" height="2" rx="1" fill="#0055CC"/>
                  <text x="10" y="20" fontSize="13" fill="white" fontFamily="Georgia, serif" fontWeight="bold">∑</text>
                  <text x="27" y="20" fontSize="11" fill="white" fontFamily="Georgia, serif" fontWeight="bold">π</text>
                  <text x="10" y="38" fontSize="11" fill="white" fontFamily="Georgia, serif" fontWeight="bold">∫</text>
                  <text x="28" y="38" fontSize="12" fill="white" fontFamily="Georgia, serif" fontWeight="bold">∞</text>
                </svg>
              </Box>
            </Box>
            <Typography variant="h1" sx={{
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.8rem' },
              background: 'linear-gradient(90deg, #FFFFFF 0%, #00E5FF 50%, #FFFFFF 100%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent',
              fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, mb: 1,
            }}>MATHS SUPER HIGHWAY</Typography>
            <Stack direction="row" sx={{ justifyContent: 'center', gap: 1, alignItems: 'center' }}>
              <Box sx={{ height: '1px', width: 40, background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5))' }} />
              <Typography sx={{ color: '#00E5FF', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace' }}>
                The Fast Lane to Mathematical Mastery
              </Typography>
              <Box sx={{ height: '1px', width: 40, background: 'linear-gradient(90deg, rgba(0,229,255,0.5), transparent)' }} />
            </Stack>
          </Box>

          {/* Badge */}
          <Box sx={{ textAlign: 'center', mb: 4, animation: 'slideInUp 0.8s ease 0.15s both' }}>
            <Chip icon={<Speed sx={{ fontSize: '0.9rem !important', color: '#FF6B35 !important' }} />} label="LAUNCHING SOON"
              sx={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.4)', color: '#FF6B35', fontFamily: '"Space Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.2em', fontWeight: 700, px: 1, animation: 'pulseGlow 2.5s ease-in-out infinite' }} />
          </Box>

          {/* Headline */}
          <Box sx={{ textAlign: 'center', mb: 6, animation: 'slideInUp 0.8s ease 0.25s both' }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem', md: '3rem' }, color: 'white', fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
              Where Numbers Meet{' '}
              <Box component="span" sx={{ color: '#00E5FF', textShadow: '0 0 30px rgba(0,229,255,0.4)' }}>Velocity</Box>
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 580, mx: 'auto', lineHeight: 1.7 }}>
              A next-generation mathematics learning platform built for students who refuse to slow down. Master concepts at speed, track progress in real-time, and accelerate to your goals.
            </Typography>
          </Box>

          {/* Countdown */}
          <Box sx={{ textAlign: 'center', mb: 7, animation: 'slideInUp 0.8s ease 0.35s both' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', mb: 2.5, fontFamily: '"Space Mono", monospace' }}>
              Platform launches in
            </Typography>
            <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ justifyContent: "center", alignItems: "center" }}>
              <CountdownBox value={timeLeft.days} label="Days" />
              <Typography sx={{ color: '#00E5FF', fontSize: { xs: '1.5rem', sm: '2rem' }, fontFamily: '"Space Mono", monospace', opacity: 0.6, mb: 1 }}>:</Typography>
              <CountdownBox value={timeLeft.hours} label="Hours" />
              <Typography sx={{ color: '#00E5FF', fontSize: { xs: '1.5rem', sm: '2rem' }, fontFamily: '"Space Mono", monospace', opacity: 0.6, mb: 1 }}>:</Typography>
              <CountdownBox value={timeLeft.minutes} label="Minutes" />
              <Typography sx={{ color: '#00E5FF', fontSize: { xs: '1.5rem', sm: '2rem' }, fontFamily: '"Space Mono", monospace', opacity: 0.6, mb: 1 }}>:</Typography>
              <CountdownBox value={timeLeft.seconds} label="Seconds" />
            </Stack>
          </Box>

          {/* Email Signup */}
          <Box sx={{ maxWidth: 520, mx: 'auto', mb: 8, animation: 'slideInUp 0.8s ease 0.45s both' }}>
            <Box sx={{
              background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 3,
              p: { xs: 3, sm: 4 }, backdropFilter: 'blur(20px)', position: 'relative',
              '&::before': { content: '""', position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)' }
            }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center", mb: 2 }}>
                <NotificationsActive sx={{ color: '#00E5FF', fontSize: '1.1rem' }} />
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.05rem' }}>Get Early Access</Typography>
              </Stack>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textAlign: 'center', mb: 3 }}>
                Be the first to know when we launch. Early access members get exclusive benefits.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField fullWidth placeholder="your@email.com" value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(false) }}
                  error={emailError} helperText={emailError ? 'Enter a valid email address' : ''}
                  onKeyDown={e => e.key === 'Enter' && handleNotify()}
                  sx={{ '& .MuiInputBase-input': { color: 'white', fontSize: '0.95rem' }, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.3)' } }}
                />
                <Button variant="contained" onClick={handleNotify} sx={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #0088CC 100%)', color: '#020818',
                  px: 3, py: 1.5, whiteSpace: 'nowrap', fontWeight: 800, fontSize: '0.9rem',
                  boxShadow: '0 0 20px rgba(0,229,255,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #33EEFF 0%, #0099EE 100%)', boxShadow: '0 0 30px rgba(0,229,255,0.5)' },
                }}>Notify Me</Button>
              </Stack>
            </Box>
          </Box>

          {/* Features */}
          <Box sx={{ animation: 'slideInUp 0.8s ease 0.55s both' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center', mb: 4, fontFamily: '"Space Mono", monospace' }}>
              What's coming
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
              {FEATURES.map((f, i) => (
                <Box key={i} sx={{
                  textAlign: 'center', p: 2.5, border: '1px solid rgba(0,229,255,0.1)', borderRadius: 2,
                  background: 'rgba(0,229,255,0.03)', transition: 'all 0.3s ease', cursor: 'default',
                  '&:hover': { background: 'rgba(0,229,255,0.08)', borderColor: 'rgba(0,229,255,0.3)', transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,229,255,0.1)' },
                }}>
                  <Box sx={{ color: '#00E5FF', mb: 1, '& svg': { fontSize: '1.4rem' } }}>{f.icon}</Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', lineHeight: 1.4, fontWeight: 600 }}>{f.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Audience Tags */}
          <Box sx={{ textAlign: 'center', mt: 6, mb: 4, animation: 'slideInUp 0.8s ease 0.65s both' }}>
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1.5 }}>
              {['Students', 'Teachers', 'Parents', 'Competitive Exam Aspirants', 'Self-Learners'].map(tag => (
                <Chip key={tag} icon={<School sx={{ fontSize: '0.85rem !important', color: 'rgba(255,255,255,0.4) !important' }} />} label={tag} size="small"
                  sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', '&:hover': { background: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.2)' } }}
                />
              ))}
            </Stack>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ maxWidth: 480, mx: 'auto', mb: 4, animation: 'slideInUp 0.8s ease 0.75s both' }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.8 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontFamily: '"Space Mono", monospace' }}>Platform Progress</Typography>
              <Typography sx={{ color: '#00E5FF', fontSize: '0.7rem', fontFamily: '"Space Mono", monospace' }}>78%</Typography>
            </Stack>
            <Box sx={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: '78%', borderRadius: 2, background: 'linear-gradient(90deg, #0066FF, #00E5FF)', boxShadow: '0 0 12px rgba(0,229,255,0.5)', position: 'relative' }} />
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 6, animation: 'slideInUp 0.8s ease 0.85s both' }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "center", alignItems: "center", mb: 1 }}>
              <Functions sx={{ color: '#00E5FF', fontSize: '1rem', opacity: 0.6 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontFamily: '"Space Mono", monospace' }}>
                © 2025 Maths Super Highway. All rights reserved.
              </Typography>
            </Stack>
          </Box>

        </Container>
      </Box>

      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setOpen(false)}
          sx={{ background: 'linear-gradient(135deg, #0A1628, #051030)', border: '1px solid rgba(0,229,255,0.3)', color: 'white', '& .MuiAlert-icon': { color: '#00E5FF' } }}>
          🚀 You're on the list! We'll notify you at launch.
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}