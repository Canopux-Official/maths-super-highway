import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface UserStatCardProps {
  label: string;
  value: string | number;
  Icon: SvgIconComponent;
  iconColor?: string;
}

const UserStatCard: React.FC<UserStatCardProps> = ({
  label,
  value,
  Icon,
  iconColor = '#1A237E',
}) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Icon sx={{ color: iconColor, fontSize: 22 }} />
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserStatCard;