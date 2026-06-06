import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton } from '@mui/material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + results.length) % results.length);
  }, [results.length]);

  // Auto-cycle every 3.5s
  useEffect(() => {
    if (results.length <= 1) return;
    const t = setInterval(goNext, 3500);
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

  // Helper: get index with wrapping
  const getIndex = (offset: number) =>
    (currentIndex + offset + results.length) % results.length;

  // How many visible cards on each side
  const visibleSide = results.length >= 5 ? 2 : results.length >= 3 ? 1 : 0;

  // Build the visible card list: [far-left, left, center, right, far-right]
  type CardPosition = {
    index: number;
    offset: number; // -2, -1, 0, 1, 2
  };
  const visibleCards: CardPosition[] = [];
  for (let i = -visibleSide; i <= visibleSide; i++) {
    visibleCards.push({ index: getIndex(i), offset: i });
  }

  // Style for each card based on offset
  const getCardStyle = (offset: number) => {
    const absOffset = Math.abs(offset);

    if (absOffset === 0) {
      return {
        zIndex: 10,
        x: 0,
        scale: 1,
        rotateY: 0,
        opacity: 1,
        filter: 'brightness(1)',
      };
    }
    if (absOffset === 1) {
      return {
        zIndex: 5,
        x: offset * 360,
        scale: 0.82,
        rotateY: offset * -35,
        opacity: 0.85,
        filter: 'brightness(0.7)',
      };
    }
    // absOffset === 2
    return {
      zIndex: 2,
      x: offset * 580,
      scale: 0.65,
      rotateY: offset * -45,
      opacity: 0.5,
      filter: 'brightness(0.5)',
    };
  };

  // Mobile style (smaller translations)
  const getCardStyleMobile = (offset: number) => {
    const absOffset = Math.abs(offset);

    if (absOffset === 0) {
      return {
        zIndex: 10,
        x: 0,
        scale: 1,
        rotateY: 0,
        opacity: 1,
        filter: 'brightness(1)',
      };
    }
    if (absOffset === 1) {
      return {
        zIndex: 5,
        x: offset * 180,
        scale: 0.75,
        rotateY: offset * -30,
        opacity: 0.7,
        filter: 'brightness(0.65)',
      };
    }
    return {
      zIndex: 2,
      x: offset * 280,
      scale: 0.55,
      rotateY: offset * -40,
      opacity: 0.35,
      filter: 'brightness(0.45)',
    };
  };

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(180deg, #05101D 0%, #0A1628 40%, #0D1F3C 100%)',
        overflow: 'hidden',
        py: { xs: 8, md: 16 },
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

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>

        {/* ── Section Header ── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
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

        {/* ── 3D Coverflow Carousel ── */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '450px', sm: '550px', md: '750px', lg: '850px' },
            perspective: '1200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Navigation Arrows */}
          {results.length > 1 && (
            <>
              <IconButton
                onClick={goPrev}
                sx={{
                  position: 'absolute',
                  left: { xs: 0, md: -10 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  bgcolor: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#FCD34D',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    bgcolor: 'rgba(245,158,11,0.3)',
                  },
                  width: { xs: 36, md: 46 },
                  height: { xs: 36, md: 46 },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
              </IconButton>
              <IconButton
                onClick={goNext}
                sx={{
                  position: 'absolute',
                  right: { xs: 0, md: -10 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  bgcolor: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#FCD34D',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    bgcolor: 'rgba(245,158,11,0.3)',
                  },
                  width: { xs: 36, md: 46 },
                  height: { xs: 36, md: 46 },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
              </IconButton>
            </>
          )}

          {/* Cards */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
            }}
          >
            <AnimatePresence mode="popLayout">
              {visibleCards.map(({ index, offset }) => {
                const desktopStyle = getCardStyle(offset);
                const mobileStyle = getCardStyleMobile(offset);

                return (
                  <motion.div
                    key={`${results[index]._id}-${offset}`}
                    initial={{
                      opacity: 0,
                      x: offset > 0 ? 500 : -500,
                      rotateY: offset > 0 ? -60 : 60,
                      scale: 0.5,
                    }}
                    animate={{
                      opacity: desktopStyle.opacity,
                      x: desktopStyle.x,
                      rotateY: desktopStyle.rotateY,
                      scale: desktopStyle.scale,
                      zIndex: desktopStyle.zIndex,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    onClick={() => {
                      if (offset !== 0) setCurrentIndex(index);
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      cursor: offset !== 0 ? 'pointer' : 'default',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Responsive wrapper that applies different transforms for mobile */}
                    <Box
                      sx={{
                        width: { xs: '300px', sm: '400px', md: '520px', lg: '620px' },
                        height: { xs: '380px', sm: '500px', md: '650px', lg: '780px' },
                        transform: {
                          xs: `translate(-50%, -50%) translateX(${mobileStyle.x - desktopStyle.x}px)`,
                          md: 'translate(-50%, -50%)',
                        },
                        borderRadius: '24px',
                        overflow: 'hidden',
                        bgcolor: '#0A1628',
                        border: offset === 0
                          ? '2px solid rgba(245,158,11,0.6)'
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: offset === 0
                          ? '0 0 40px rgba(245,158,11,0.25), 0 20px 60px rgba(0,0,0,0.5)'
                          : '0 10px 30px rgba(0,0,0,0.4)',
                        transition: 'border 0.3s ease, box-shadow 0.3s ease',
                      }}
                    >
                      <img
                        src={results[index].imageUrl}
                        alt={results[index].title || 'Student Result'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        draggable={false}
                      />

                      {/* Title overlay on center card */}
                      {offset === 0 && results[index].title && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            px: 2.5,
                            py: 2,
                            background: 'linear-gradient(to top, rgba(5,16,29,0.95) 0%, transparent 100%)',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#FCD34D',
                              fontWeight: 700,
                              fontSize: { xs: '0.85rem', md: '1rem' },
                              fontFamily: "'Sora', sans-serif",
                              letterSpacing: '-0.01em',
                            }}
                          >
                            🏆 {results[index].title}
                          </Typography>
                        </Box>
                      )}

                      {/* Gold sheen overlay on center card */}
                      {offset === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 50%, rgba(245,158,11,0.03) 100%)',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Progress bar */}
        {results.length > 1 && (
          <Box sx={{ mt: { xs: 3, md: 5 }, display: 'flex', gap: 1, maxWidth: '500px', mx: 'auto' }}>
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
                      animation: 'fillBar 3.5s linear forwards',
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

        {/* Counter */}
        {results.length > 1 && (
          <Typography
            sx={{
              textAlign: 'center',
              mt: 2,
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.8rem',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            {currentIndex + 1} / {results.length}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default LandingResults;
