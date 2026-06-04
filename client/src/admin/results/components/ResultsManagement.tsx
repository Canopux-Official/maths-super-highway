import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Grid, IconButton,
  CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Switch, FormControlLabel,
  Backdrop
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

interface ResultImage {
  _id: string;
  imageUrl: string;
  title: string;
  order: number;
  isActive: boolean;
}

const ResultsManagement = () => {
  const [results, setResults] = useState<ResultImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ title: '', order: 0, isActive: true });
  const [uploading, setUploading] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultImage | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${apiUrl}/results/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setResults(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploading) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome/Firefox to show the default warning
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', selectedFile);
    data.append('title', formData.title);
    data.append('order', formData.order.toString());
    data.append('isActive', formData.isActive.toString());

    try {
      await axios.post(`${apiUrl}/results/admin`, data, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setOpenAdd(false);
      setSelectedFile(null);
      setFormData({ title: '', order: 0, isActive: true });
      fetchResults();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload result');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingResult) return;
    setUploading(true);
    try {
      await axios.put(`${apiUrl}/results/admin/${editingResult._id}`, editingResult, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setOpenEdit(false);
      setEditingResult(null);
      fetchResults();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update result');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this result image?")) return;
    try {
      await axios.delete(`${apiUrl}/results/admin/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      fetchResults();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete result');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: "'Sora', sans-serif", color: '#0A1628' }}>
          Results Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Add Result
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {results.map((result) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={result._id}>
              <Paper sx={{ p: 2, borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
                <Box sx={{ 
                  height: 200, 
                  backgroundImage: `url(${result.imageUrl})`, 
                  backgroundSize: 'contain', 
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: '8px',
                  mb: 2
                }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                      {result.title || 'Untitled'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Order: {result.order} • Status: {result.isActive ? 'Active' : 'Hidden'}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => { setEditingResult(result); setOpenEdit(true); }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(result._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
          {results.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ textAlign: 'center', color: '#64748B', py: 5 }}>No results added yet.</Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Result Image</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            sx={{ borderStyle: 'dashed', py: 3 }}
          >
            {selectedFile ? selectedFile.name : 'Select Image'}
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          <TextField 
            label="Title (Optional)" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
          <TextField 
            label="Order" 
            type="number"
            value={formData.order} 
            onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
          />
          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />}
            label="Active (Visible on Landing Page)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Result Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {editingResult && (
            <>
              <TextField 
                label="Title (Optional)" 
                value={editingResult.title} 
                onChange={e => setEditingResult({...editingResult, title: e.target.value})} 
              />
              <TextField 
                label="Order" 
                type="number"
                value={editingResult.order} 
                onChange={e => setEditingResult({...editingResult, order: parseInt(e.target.value) || 0})} 
              />
              <FormControlLabel
                control={<Switch checked={editingResult.isActive} onChange={e => setEditingResult({...editingResult, isActive: e.target.checked})} />}
                label="Active (Visible on Landing Page)"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Uploading Overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => Math.max(theme.zIndex.drawer, theme.zIndex.modal) + 2000, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.85)'
        }}
        open={uploading}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
          Uploading... Please wait
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, fontFamily: "'Inter', sans-serif" }}>
          Do not refresh or close this page. This might take a moment.
        </Typography>
      </Backdrop>
    </Box>
  );
};

export default ResultsManagement;
