import React from 'react';
import {
  Card, CardContent, Typography, Box,
  LinearProgress, Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import type { AdminStats } from '../services/api';

interface AdminTestimonialsSectionProps {
  testimonials: AdminStats['testimonials'];
}

const AdminTestimonialsSection: React.FC<AdminTestimonialsSectionProps> = ({ testimonials }) => {
  const total = testimonials.total || 1; // avoid division by zero

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Testimonials & Ratings
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {testimonials.averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            / 5 &nbsp;·&nbsp; {testimonials.total} reviews
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {[5, 4, 3, 2, 1].map((star) => {
          const count = testimonials.ratingBreakdown[star] ?? 0;
          const percent = Math.round((count / total) * 100);
          return (
            <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <Typography variant="caption" sx={{ width: 24 }}>{star}★</Typography>
              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{ flex: 1, height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" sx={{ width: 28, textAlign: 'right' }}>
                {count}
              </Typography>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AdminTestimonialsSection;