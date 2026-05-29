import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const fmtShort = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

const calcAge = (dob: string) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const memberDuration = (createdAt: string) => {
  const months =
    (new Date().getFullYear() - new Date(createdAt).getFullYear()) * 12 +
    new Date().getMonth() - new Date(createdAt).getMonth();
  return months >= 12 ? `${(months / 12).toFixed(1)} yrs` : `${months} mo`;
};

const timeAgo = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months} mo ago` : `${(months / 12).toFixed(1)} yrs ago`;
};

const StatCard = ({ value, label, color = '#0A1628' }: { value: string; label: string; color?: string }) => (
  <Box sx={{
    bgcolor: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    p: 2.5,
    textAlign: 'center',
    transition: 'box-shadow 0.2s',
    '&:hover': { boxShadow: '0 4px 16px rgba(10,22,40,0.08)' },
  }}>
    <Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1.4rem', color, lineHeight: 1, mb: 0.5, letterSpacing: '-0.02em' }}>{value}</Typography>
    <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Inter', sans-serif" }}>{label}</Typography>
  </Box>
);

const FieldRow = ({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  accent?: boolean;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
    <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: 'rgba(29,78,216,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1D4ED8' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.25 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.9rem', fontWeight: value ? 600 : 400, color: accent ? '#1D4ED8' : (value ? '#0A1628' : '#CBD5E1'), fontStyle: value ? 'normal' : 'italic', fontFamily: "'Inter', sans-serif" }}>
        {value ?? 'Not provided'}
      </Typography>
    </Box>
  </Box>
);

const ActivityRow = ({ icon, text, time }: { icon: React.ReactNode; text: React.ReactNode; time: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#64748B' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, fontSize: 13, color: '#475569', fontFamily: "'Inter', sans-serif" }}>{text}</Box>
    <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}>{time}</Typography>
  </Box>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', mb: 2, fontFamily: "'Inter', sans-serif" }}>
    {children}
  </Typography>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', dob: '' });
  const [saving, setSaving] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        setProfile(data.user);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [apiUrl]);

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        phone: profile.phone || '',
        dob: profile.dob ? profile.dob.split('T')[0] : '', // format for date input
      });
      setEditOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${apiUrl}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setProfile(data.user);
      setEditOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#1D4ED8' }} />
      </Box>
    );

  if (error || !profile)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: '10px' }}>{error || 'Could not load profile'}</Alert>
      </Box>
    );

  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', px: { xs: 0, md: 1 }, py: 2 }}>

      {/* ── Profile Hero Card ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1D4ED8 100%)',
          borderRadius: '16px',
          p: { xs: 3, md: 4 },
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(6,182,212,0.12)', pointerEvents: 'none' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <Box sx={{
            width: 72, height: 72, borderRadius: '18px',
            background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: 800, color: '#0A1628',
            fontFamily: "'Sora', sans-serif",
            flexShrink: 0,
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          }}>
            {initials}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1.375rem', color: '#fff', lineHeight: 1.15, mb: 0.5, letterSpacing: '-0.02em' }}>
              {profile.name}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", mb: 1.5 }}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Account
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={profile.isActive ? '● Active' : 'Inactive'}
                size="small"
                sx={{ bgcolor: profile.isActive ? 'rgba(22,163,74,0.18)' : 'rgba(100,116,139,0.18)', color: profile.isActive ? '#4ADE80' : '#94A3B8', fontWeight: 600, fontSize: '0.7rem', fontFamily: "'Inter', sans-serif", border: 'none' }}
              />
              <Chip
                label="Verified ✓"
                size="small"
                sx={{ bgcolor: 'rgba(6,182,212,0.15)', color: '#22D3EE', fontWeight: 600, fontSize: '0.7rem', fontFamily: "'Inter', sans-serif", border: 'none' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Stats Row ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 3 }}>
        <StatCard value={memberDuration(profile.createdAt)} label="Member duration" color="#1D4ED8" />
        <StatCard value={profile.dob ? `${calcAge(profile.dob)} yrs` : '—'} label="Age" />
        <StatCard value={fmtShort(profile.createdAt)} label="Joined" />
      </Box>

      {/* ── Contact Information ── */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', p: { xs: 2.5, md: 3 }, mb: 2.5 }}>
        <SectionHeader>Contact Information</SectionHeader>
        <FieldRow icon={<EmailOutlinedIcon sx={{ fontSize: 17 }} />} label="Email Address" value={profile.email} accent />
        <FieldRow icon={<PhoneOutlinedIcon sx={{ fontSize: 17 }} />} label="Phone Number" value={profile.phone} />
      </Box>

      {/* ── Personal Details ── */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', p: { xs: 2.5, md: 3 }, mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionHeader>Personal Details</SectionHeader>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<EditOutlinedIcon />} 
            onClick={handleEditClick}
            sx={{ textTransform: 'none', borderRadius: '8px', fontFamily: "'Inter', sans-serif", mt: -1.5 }}
          >
            Edit
          </Button>
        </Box>
        <FieldRow icon={<PersonOutlineIcon sx={{ fontSize: 17 }} />} label="Full Name" value={profile.name} />
        <FieldRow icon={<CakeOutlinedIcon sx={{ fontSize: 17 }} />} label="Date of Birth" value={profile.dob ? `${fmt(profile.dob)} (${calcAge(profile.dob)} yrs)` : undefined} />
        <FieldRow
          icon={<CheckCircleOutlinedIcon sx={{ fontSize: 17 }} />}
          label="Account Status"
          value={profile.isActive ? 'Active — No action required' : 'Inactive — Action needed'}
          accent={profile.isActive}
        />
      </Box>

      {/* ── Account Activity ── */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', p: { xs: 2.5, md: 3 } }}>
        <SectionHeader>Account Activity</SectionHeader>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <ActivityRow
            icon={<AccessTimeIcon sx={{ fontSize: 15 }} />}
            text={<>Account created on <strong>{fmt(profile.createdAt)}</strong></>}
            time={timeAgo(profile.createdAt)}
          />
          <ActivityRow
            icon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            text={<>Profile last updated on <strong>{fmt(profile.updatedAt)}</strong></>}
            time={timeAgo(profile.updatedAt)}
          />
          <ActivityRow
            icon={<CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />}
            text={<>Identity <strong>verified</strong> — account in good standing</>}
            time="Current"
          />
        </Box>
      </Box>

      {/* ── Edit Profile Dialog ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '16px' } } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0A1628', fontFamily: "'Sora', sans-serif", fontSize: '1.1rem' }}>
          Edit Profile
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={editForm.dob}
              onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: '#64748B', borderRadius: '8px', textTransform: 'none', fontFamily: "'Inter', sans-serif" }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProfile} 
            disabled={saving}
            sx={{ background: 'linear-gradient(135deg, #0A1628, #1D4ED8)', borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 3, fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 16px rgba(29,78,216,0.25)', '&:hover': { background: 'linear-gradient(135deg, #112240, #2563EB)' } }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
