import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

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

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: '14px 16px' }}>
    <Box sx={{ fontSize: '1.125rem', fontWeight: 500 }}>{value}</Box>
    <Box sx={{ fontSize: 11, color: 'text.disabled', mt: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </Box>
  </Box>
);

const Field = ({ label, value, sub, color }: { label: string; value?: string; sub?: string; color?: string }) => (
  <Box>
    <Box sx={{ fontSize: 12, color: 'text.secondary', mb: '3px' }}>{label}</Box>
    <Box sx={{ fontSize: 15, fontWeight: value ? 500 : 400, color: color ?? (value ? 'text.primary' : 'text.disabled'), fontStyle: value ? 'normal' : 'italic' }}>
      {value ?? 'Not provided'}
    </Box>
    {sub && <Box sx={{ fontSize: 12, color: 'text.disabled', mt: '2px' }}>{sub}</Box>}
  </Box>
);

const ActivityRow = ({
  icon,
  text,
  time,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
  time: string;
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1, fontSize: 13, color: 'text.secondary' }}>{text}</Box>
    <Box sx={{ fontSize: 12, color: 'text.disabled', whiteSpace: 'nowrap' }}>{time}</Box>
  </Box>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'text.disabled', mb: 1.5 }}>
    {children}
  </Box>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );

  if (error || !profile)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Could not load profile'}</Alert>
      </Box>
    );

  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>

      {/* Hero */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '20px', mb: 3, pb: '1.75rem', borderBottom: '0.5px solid', borderColor: 'divider' }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.dark', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 500, flexShrink: 0, border: '3px solid', borderColor: 'background.default' }}>
          {initials}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontSize: '1.375rem', fontWeight: 500, lineHeight: 1.2, mb: '4px' }}>{profile.name}</Box>
          <Box sx={{ fontSize: 13, color: 'text.secondary', mb: '10px' }}>
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} account
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: 12, px: 1.25, py: '3px', borderRadius: '99px', bgcolor: 'success.light', color: 'success.dark', fontWeight: 500 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              {profile.isActive ? 'Active account' : 'Action required'}
            </Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', fontSize: 12, px: 1.25, py: '3px', borderRadius: '99px', bgcolor: 'info.light', color: 'info.dark', fontWeight: 500 }}>
              Verified student
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', mb: 3 }}>
        <StatCard value={memberDuration(profile.createdAt)} label="Member duration" />
        <StatCard value={profile.dob ? `${calcAge(profile.dob)}` : '—'} label="Age" />
        <StatCard value={fmtShort(profile.createdAt)} label="Joined" />
      </Box>

      {/* Contact */}
      <SectionLabel>Contact information</SectionLabel>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '1.25rem 2rem', mb: 3 }}>
        <Field label="Email address" value={profile.email} sub="Primary contact" />
        <Field label="Phone number" value={profile.phone} sub="Mobile" />
      </Box>

      <Box sx={{ height: '0.5px', bgcolor: 'divider', mb: '1.75rem' }} />

      {/* Personal */}
      <SectionLabel>Personal details</SectionLabel>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '1.25rem 2rem', mb: 3 }}>
        <Field label="Full name" value={profile.name} />
        <Field label="Date of birth" value={profile.dob ? fmt(profile.dob) : undefined} sub={profile.dob ? `${calcAge(profile.dob)} years old` : undefined} />
        <Field label="Account role" value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} />
        <Field label="Account status" value={profile.isActive ? 'Active' : 'Inactive'} sub={profile.isActive ? 'No action required' : 'Action needed'} color={profile.isActive ? 'success.main' : 'warning.main'} />
      </Box>

      <Box sx={{ height: '0.5px', bgcolor: 'divider', mb: '1.75rem' }} />

      {/* Activity */}
      <SectionLabel>Account activity</SectionLabel>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ActivityRow
          icon={<AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
          text={<>Account created on <strong>{fmt(profile.createdAt)}</strong></>}
          time={timeAgo(profile.createdAt)}
        />
        <ActivityRow
          icon={<EditOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
          text={<>Profile last updated on <strong>{fmt(profile.updatedAt)}</strong></>}
          time={timeAgo(profile.updatedAt)}
        />
        <ActivityRow
          icon={<CheckCircleOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
          text={<>Identity <strong>verified</strong> and account in good standing</>}
          time="Current"
        />
      </Box>
    </Box>
  );
};

export default ProfilePage;