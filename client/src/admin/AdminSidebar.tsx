import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography,
  Divider, IconButton, ListItem, ListItemButton,
  ListItemIcon, ListItemText, CssBaseline, Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Functions as MathIcon,
  Calculate as CourseIcon,
  School as UserIcon,
  Campaign as HeadlineIcon,
  ChevronRight as ChevronIcon
} from '@mui/icons-material';

const drawerWidth = 264;

const menuItems = [
  { text: 'Announcements',    icon: <HeadlineIcon />, path: '/admin/headlines' },
  { text: 'Course Analytics', icon: <CourseIcon />,   path: '/admin/courses'  },
  { text: 'Student Directory',icon: <UserIcon />,     path: '/admin/users'    },
];

// Highway lane stripe pattern for sidebar background


export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  const DrawerContent = () => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0d1b2a'      
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            bgcolor: 'secondary.main',
            width: 38, height: 38,
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MathIcon sx={{ color: '#0d1b2a', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.2, textTransform: 'uppercase' }}>
            Maths
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Super Highway
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 1.5 }} />

      {/* Nav section label */}
      <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', textTransform: 'uppercase', px: 2.5, pt: 2, pb: 1 }}>
        Main Menu
      </Typography>

      {/* Nav Items */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {menuItems.map(({ text, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={path}
                sx={{
                  borderRadius: '10px',
                  borderLeft: active ? '3px solid' : '3px solid transparent',
                  borderLeftColor: active ? 'secondary.main' : 'transparent',
                  pl: active ? '11px' : '14px',
                  bgcolor: active ? 'rgba(255,193,7,0.12)' : 'transparent',
                  '&:hover': { bgcolor: active ? 'rgba(255,193,7,0.16)' : 'rgba(255,255,255,0.05)' },
                  transition: 'all 0.2s ease',
                  py: 1.25,
                }}
              >
                <ListItemIcon sx={{ color: active ? 'secondary.main' : 'rgba(255,255,255,0.4)', minWidth: 38, '& svg': { fontSize: 20 } }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: 13.5,
                      fontWeight: active ? 600 : 400,
                      color: active ? 'white' : 'rgba(255,255,255,0.55)',
                    }
                  }}
                />
                {active && <ChevronIcon sx={{ fontSize: 16, color: 'secondary.main', opacity: 0.7 }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User chip at bottom */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '10px', px: 1.25, py: 1 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#1e3a5f', fontSize: 11, fontWeight: 600, color: '#90caf9' }}>AD</Avatar>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'white', lineHeight: 1.3 }}>Admin User</Typography>
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.3 }}>Administrator</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top AppBar — mobile + desktop */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.dark' }}>
            {menuItems.find(i => i.path === location.pathname)?.text ?? 'Dashboard'}
          </Typography>
          {/* Optional: page-level actions slot */}
          <Box sx={{ ml: 'auto' }} />
        </Toolbar>
      </AppBar>

      {/* Sidebar nav */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}   // better mobile perf
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' },
          }}
        >
          <DrawerContent />
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' },
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>

      {/* Page content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        {children}
      </Box>
    </Box>
  );
}