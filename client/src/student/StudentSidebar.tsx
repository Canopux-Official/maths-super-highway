import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography,
    Divider, IconButton, ListItem, ListItemButton,
    ListItemIcon, ListItemText, CssBaseline, Avatar
} from '@mui/material';
import {
    Menu as MenuIcon,
    School as UserIcon,
    ChevronRight as ChevronIcon,
    LibraryBooks as AllCoursesIcon,
    Class as EnrolledIcon,
    Logout as LogoutIcon,
    Home as HomeIcon,
} from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmDialog from '../components/ConfirmDialog';

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/student', description: 'Overview' },
    { text: 'All Courses', icon: <AllCoursesIcon />, path: '/student/courses', description: 'Browse content' },
    { text: 'Enrolled Courses', icon: <EnrolledIcon />, path: '/student/enrolled-courses', description: 'Your progress' },
    { text: 'Profile', icon: <UserIcon />, path: '/student/profile', description: 'Account details' },
    { text: 'Back to Website', icon: <HomeIcon />, path: '/', description: 'Landing page' },
];

export default function StudentSidebar({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(prev => !prev);

    const handleLogoutClick = () => setLogoutConfirmOpen(true);
    const confirmLogout = () => {
        setLogoutConfirmOpen(false);
        logout();
        navigate('/login');
    };

    const drawerContent = (
        <Box
            sx={{
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(180deg, #05101D 0%, #0A1628 100%)',
            }}
        >
            {/* Logo */}
            <Box sx={{ px: 2.5, pt: 3, pb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <img src="/transparentLogo.png" alt="Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
                <Box>
                    <Typography
                        sx={{
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: "'Sora', sans-serif",
                            letterSpacing: '0.04em',
                            lineHeight: 1.2,
                            textTransform: 'uppercase',
                        }}
                    >
                        Maths
                    </Typography>
                    <Typography
                        sx={{
                            color: '#06B6D4',
                            fontSize: 10,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                        }}
                    >
                        Super Highway
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

            {/* Nav label */}
            <Typography
                sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif",
                    px: 2.5,
                    pt: 2.5,
                    pb: 1,
                }}
            >
                Navigation
            </Typography>

            {/* Nav Items */}
            <List sx={{ px: 1.5, flex: 1 }}>
                {menuItems.map(({ text, icon, path, description }) => {
                    const active = location.pathname === path;
                    return (
                        <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={NavLink}
                                to={path}
                                sx={{
                                    borderRadius: '10px',
                                    borderLeft: active ? '3px solid #06B6D4' : '3px solid transparent',
                                    pl: active ? '11px' : '14px',
                                    bgcolor: active ? 'rgba(6,182,212,0.10)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: active ? 'rgba(6,182,212,0.14)' : 'rgba(255,255,255,0.05)',
                                    },
                                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                    py: 1.25,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: active ? '#06B6D4' : 'rgba(255,255,255,0.35)',
                                        minWidth: 38,
                                        '& svg': { fontSize: 20 },
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    {icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    secondary={description}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontSize: 13.5,
                                            fontWeight: active ? 600 : 400,
                                            color: active ? 'white' : 'rgba(255,255,255,0.5)',
                                            fontFamily: "'Inter', sans-serif",
                                            transition: 'color 0.2s',
                                        },
                                        '& .MuiListItemText-secondary': {
                                            fontSize: 10.5,
                                            color: 'rgba(255,255,255,0.2)',
                                            fontFamily: "'Inter', sans-serif",
                                            display: active ? 'block' : 'none',
                                        },
                                    }}
                                />
                                {active && (
                                    <ChevronIcon sx={{ fontSize: 16, color: '#06B6D4', opacity: 0.8 }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User chip */}
            <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        px: 1.5,
                        py: 1,
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}
                >
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            background: 'linear-gradient(135deg, #1D4ED8, #0A1628)',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#06B6D4',
                            fontFamily: "'Sora', sans-serif",
                        }}
                    >
                        ST
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'white',
                                lineHeight: 1.3,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Student User
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 10.5,
                                color: 'rgba(255,255,255,0.35)',
                                lineHeight: 1.3,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Student
                        </Typography>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={handleLogoutClick}
                        sx={{
                            color: 'rgba(255,255,255,0.4)',
                            '&:hover': {
                                color: '#EF4444',
                                bgcolor: 'rgba(239,68,68,0.1)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* Top AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: '#ffffff',
                    borderBottom: '1px solid #E2E8F0',
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: '#0A1628' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: '#0A1628',
                            fontFamily: "'Sora', sans-serif",
                            fontSize: '1rem',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {menuItems.find(i => i.path === location.pathname)?.text ?? 'Dashboard'}
                    </Typography>
                    <Box sx={{ ml: 'auto' }} />
                </Toolbar>
            </AppBar>

            {/* Sidebar nav */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                {/* Mobile */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', bgcolor: '#0A1628' },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', bgcolor: '#0A1628' },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Page content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    bgcolor: '#F8FAFC',
                    minHeight: '100vh',
                    width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
                {children}
            </Box>

            <ConfirmDialog 
                open={logoutConfirmOpen} 
                title="Logout" 
                message="Are you sure you want to log out?" 
                onConfirm={confirmLogout} 
                onCancel={() => setLogoutConfirmOpen(false)} 
                confirmColor="error" 
                confirmText="Logout"
            />
        </Box>
    );
}