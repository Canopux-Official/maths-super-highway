import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface ResultImage {
  _id: string;
  imageUrl: string;
  title: string;
}

const LandingResults = () => {
  const [results, setResults] = useState<ResultImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${apiUrl}/results`);
        if (res.data.success) setResults(res.data.data);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [apiUrl]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % results.length);
  }, [results.length]);

  // Auto-cycle every 4.5s
  useEffect(() => {
    if (results.length <= 1) return;
    const t = setInterval(goNext, 4500);
    return () => clearInterval(t);
  }, [results.length, goNext]);

  if (loading) {
    return (
      <Box sx={{ py: 6, display: 'flex', justifyContent: 'center', bgcolor: '#05101D' }}>
        <CircularProgress sx={{ color: '#F59E0B' }} />
      </Box>
    );
  }

  if (results.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(180deg, #05101D 0%, #0A1628 40%, #0D1F3C 100%)',
        overflow: 'hidden',
        py: { xs: 10, md: 16 },
      }}
    >
      {/* Radial gold glow from center */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Top border glow */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)',
        }}
      />
      {/* Bottom border glow */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

        {/* ── Section Header ── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '50px',
              px: 2.5,
              py: 0.75,
              mb: 3,
              animation: 'goldPulse 3s ease-in-out infinite',
              '@keyframes goldPulse': {
                '0%, 100%': { boxShadow: '0 0 12px rgba(245,158,11,0.2)' },
                '50%': { boxShadow: '0 0 28px rgba(245,158,11,0.45)' },
              },
            }}
          >
            <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 16 }} />
            <Typography
              sx={{
                color: '#FCD34D',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Hall of Excellence
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              color: '#FFFFFF',
              lineHeight: 1.1,
              mb: 2,
              letterSpacing: '-0.03em',
            }}
          >
            Our Students.{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3s linear infinite',
                '@keyframes shimmer': {
                  '0%': { backgroundPosition: '0% center' },
                  '100%': { backgroundPosition: '200% center' },
                },
              }}
            >
              Their Glory.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: { xs: '1rem', md: '1.1rem' },
              maxWidth: '540px',
              mx: 'auto',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.7,
            }}
          >
            Real results from real students who transformed their academic journey with us.
          </Typography>
        </Box>

        {/* ── Main Carousel ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 5 },
            alignItems: 'flex-start',
          }}
        >
          {/* Featured Large Image */}
          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '0 0 65%' },
              position: 'relative',
            }}
          >
            {/* Glowing frame */}
            <Box
              sx={{
                position: 'absolute',
                inset: -3,
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.6), rgba(251,191,36,0.2), rgba(245,158,11,0.5))',
                backgroundSize: '200% 200%',
                animation: 'borderRotate 4s linear infinite',
                '@keyframes borderRotate': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '20px',
                overflow: 'hidden',
                bgcolor: '#0A1628',
                height: { xs: '260px', sm: '380px', md: '460px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={results[currentIndex].imageUrl}
                  alt={results[currentIndex].title || 'Student Result'}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </AnimatePresence>

              {/* Bottom caption */}
              {results[currentIndex].title && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    px: 3,
                    py: 2.5,
                    background: 'linear-gradient(to top, rgba(5,16,29,0.95) 0%, transparent 100%)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#FCD34D',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      fontFamily: "'Sora', sans-serif",
                      letterSpacing: '-0.01em',
                    }}
                  >
                    🏆 {results[currentIndex].title}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Progress bar */}
            {results.length > 1 && (
              <Box sx={{ mt: 2.5, display: 'flex', gap: 1 }}>
                {results.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    sx={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      bgcolor: idx === currentIndex ? '#F59E0B' : 'rgba(255,255,255,0.12)',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {idx === currentIndex && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: '#F59E0B',
                          animation: 'fillBar 4.5s linear forwards',
                          '@keyframes fillBar': {
                            '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
                            '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
                          },
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Thumbnail strip (right side) */}
          {results.length > 1 && (
            <Box
              sx={{
                flex: { xs: '1 1 auto', md: '0 0 calc(35% - 40px)' },
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                gap: 2,
                height: { xs: 'auto', md: '460px' },
                overflowX: { xs: 'auto', md: 'hidden' },
                overflowY: { xs: 'hidden', md: 'auto' },
                pb: { xs: 1, md: 0 },
                // Hide scrollbar visually but keep functionality
                '&::-webkit-scrollbar': { width: '4px', height: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(245,158,11,0.3)', borderRadius: '2px' },
              }}
            >
              <Typography
                sx={{
                  display: { xs: 'none', md: 'block' },
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  mb: 1,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                All Results
              </Typography>
              {results.map((result, idx) => (
                <Box
                  key={result._id}
                  component={motion.div}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    minWidth: { xs: '130px', md: 'auto' },
                    flexShrink: 0,
                    cursor: 'pointer',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: idx === currentIndex
                      ? '2px solid #F59E0B'
                      : '2px solid rgba(255,255,255,0.07)',
                    bgcolor: '#0A1628',
                    aspectRatio: '4/3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border 0.25s ease',
                    opacity: idx === currentIndex ? 1 : 0.55,
                    boxShadow: idx === currentIndex
                      ? '0 0 16px rgba(245,158,11,0.4)'
                      : 'none',
                    position: 'relative',
                  }}
                >
                  <img
                    src={result.imageUrl}
                    alt={result.title || 'Result'}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                  {idx === currentIndex && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(245,158,11,0.08)',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LandingResults;
