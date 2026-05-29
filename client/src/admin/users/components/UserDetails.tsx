import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Avatar, Chip,
    Divider, IconButton, Card, CardContent, CircularProgress, Rating
} from '@mui/material';
import {
    ArrowBack, Email, Phone, CalendarToday,
    School, VerifiedUser, AccessTime
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/api';

const UserDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: resData, isLoading: loading, error } = useQuery({
        queryKey: ['userDetails', id],
        queryFn: async () => {
            if (!id) throw new Error('No user ID provided');
            const res = await userService.getUserDetails(id);
            if (!res.success) throw new Error('Failed to fetch user details');
            return res.data;
        },
        enabled: !!id,
    });
    const data = resData;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data?.user) {
        return (
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography color="error">{(error as any)?.message || 'User not found'}</Typography>
            </Box>
        );
    }

    const { user, enrollments, testimonials } = data;
    const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <Box sx={{ pb: 6 }}>
            {/* ── Header ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconButton onClick={() => navigate('/admin/users')} sx={{ bgcolor: '#F1F5F9' }}>
                    <ArrowBack />
                </IconButton>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif" }}>
                        User Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Detailed view of user's activities and information
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* ── Left Column: Profile Card ── */}
                <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px', textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#1D4ED8', fontSize: '2rem', fontWeight: 700 }}>
                            {initials}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{user.name}</Typography>
                        <Chip
                            label={user.role.toUpperCase()}
                            size="small"
                            sx={{ mb: 2, bgcolor: 'rgba(29,78,216,0.1)', color: '#1D4ED8', fontWeight: 700, fontSize: '0.7rem' }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                            <Chip
                                label={user.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={user.isActive ? 'success' : 'default'}
                                variant="outlined"
                            />
                            {user.isVerified && (
                                <Chip
                                    icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                                    label="Verified"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Email sx={{ color: '#94A3B8', fontSize: 20 }} />
                                <Typography variant="body2" sx={{ color: '#334155' }}>{user.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Phone sx={{ color: '#94A3B8', fontSize: 20 }} />
                                <Typography variant="body2" sx={{ color: '#334155' }}>{user.phone || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CalendarToday sx={{ color: '#94A3B8', fontSize: 20 }} />
                                <Typography variant="body2" sx={{ color: '#334155' }}>
                                    DOB: {user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : 'N/A'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <AccessTime sx={{ color: '#94A3B8', fontSize: 20 }} />
                                <Typography variant="body2" sx={{ color: '#334155' }}>
                                    Joined: {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* ── Right Column: Enrollments & Reviews ── */}
                <Box sx={{ width: { xs: '100%', md: '66.666%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        {/* Enrollments */}
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <School sx={{ color: '#1D4ED8' }} /> Enrolled Courses ({enrollments?.length || 0})
                            </Typography>
                            {enrollments?.length > 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {enrollments.map((en: any) => (
                                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }} key={en._id}>
                                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                                <CardContent sx={{ pb: '16px !important' }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {en.course?.title || 'Unknown Course'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Enrolled: {new Date(en.createdAt).toLocaleDateString('en-GB')}
                                                        </Typography>
                                                        <Chip label={en.course?.level || 'N/A'} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    No enrollments found for this user.
                                </Typography>
                            )}
                        </Paper>

                        {/* Reviews */}
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedUser sx={{ color: '#0891B2' }} /> Reviews & Testimonials ({testimonials?.length || 0})
                            </Typography>
                            {testimonials?.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {testimonials.map((t: any) => (
                                        <Box key={t._id} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0A1628' }}>
                                                    {t.course?.title || 'General Review'}
                                                </Typography>
                                                <Rating value={t.rating} size="small" readOnly />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                "{t.message}"
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    No reviews left by this user.
                                </Typography>
                            )}
                        </Paper>

                </Box>
            </Box>
        </Box>
    );
};

export default UserDetails;
