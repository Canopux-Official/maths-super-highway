import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import TestimonialsScroller from '../../testimonial/components/TestimonialScroller';

interface TestimonialsCardProps {
  pageId: string;
  testimonials: any[];
}

const TestimonialsCard: React.FC<TestimonialsCardProps> = ({ pageId, testimonials }) => (
  <Box
    sx={{
      bgcolor: '#FAFBFD',
      border: '1px solid #E9EEF5',
      borderRadius: { xs: '14px', sm: '18px' },
      p: { xs: 2.5, sm: 4 },
      boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
      <Typography
        sx={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: { xs: '0.95rem', sm: '1.05rem' },
          color: '#0F172A',
          letterSpacing: '-0.02em',
        }}
      >
        What students say
      </Typography>
      {testimonials.length > 0 && (
        <Chip
          label={`${testimonials.length} review${testimonials.length !== 1 ? 's' : ''}`}
          size="small"
          sx={{
            bgcolor: '#EFF6FF',
            color: '#1D4ED8',
            fontWeight: 700,
            fontSize: '0.7rem',
            fontFamily: "'DM Sans', sans-serif",
            border: '1px solid #BFDBFE',
          }}
        />
      )}
    </Box>
    <TestimonialsScroller courseId={pageId} initialTestimonials={testimonials} />
  </Box>
);

export default TestimonialsCard;