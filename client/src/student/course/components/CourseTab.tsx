import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Drawer, MenuItem, Paper, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseService, type Selection } from '../services/api';
import { buildTree, collectAllIds, collectLeafIds, collectTags, filterTree, isLeaf, pathTo, type TreeNode } from '../../../utils/courseTree';
import CurriculumTree from '../../../admin/courses/components/CurriCulumTree';

const SEL_KEY = ['my-selections'];

export default function CourseTab() {
  const qc = useQueryClient();
  // The tree is the same for everyone; selections are per student. Two small, separate calls.
  const { data: flat = [], isLoading, error } = useQuery({ queryKey: ['user-tree'], queryFn: courseService.getTree, refetchOnWindowFocus: true });
  const { data: selections = [] } = useQuery({ queryKey: SEL_KEY, queryFn: courseService.getMySelections });

  const tree = useMemo(() => buildTree(flat), [flat]);
  const allTags = useMemo(() => collectTags(tree), [tree]);
  const savedSelected = useMemo(() => new Set(selections.map((s) => s.courseId)), [selections]);

  // "Choose Courses" mode: ticks go into a temporary draft until the student presses Update
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // While choosing, the UI shows the draft; otherwise it shows what is saved.
  const selected = editing ? draft : savedSelected;

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [viewing, setViewing] = useState<TreeNode | null>(null);
  const [problem, setProblem] = useState('');

  const filtering = !!(query.trim() || tag);
  const visible = useMemo(() => filterTree(tree, query, tag), [tree, query, tag]);
  const shownExpanded = useMemo(() => (filtering ? new Set(collectAllIds(visible)) : expanded), [filtering, visible, expanded]);

  // Saves only the differences between the draft and what is already saved
  const save = useMutation({
    mutationFn: (p: { add?: string[]; remove?: string[] }) => courseService.updateSelections(p),
    onSuccess: async (_data, variables) => {
      // Synchronously update local cache so savedSelected matches draft immediately, freezing the Update button
      qc.setQueryData<Selection[]>(SEL_KEY, (old = []) => {
        const added = new Set(variables.add || []);
        const removed = new Set(variables.remove || []);
        const kept = old.filter((s) => !removed.has(s.courseId));
        const newItems = Array.from(added).map((courseId) => ({ courseId, needsReview: false }));
        return [...kept, ...newItems];
      });
      await qc.invalidateQueries({ queryKey: SEL_KEY });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    },
    onError: (e: any) => setProblem(e?.response?.data?.message ?? 'Could not save your selection'),
  });

  const startEditing = () => {
    setDraft(new Set(savedSelected));
    setProblem('');
    setSavedSuccess(false);
    setEditing(true);
  };
  const cancelEditing = () => {
    setDraft(new Set(savedSelected));
    setEditing(false);
    setSavedSuccess(false);
  };

  const toAdd = Array.from(draft).filter((id) => !savedSelected.has(id));
  const toRemove = Array.from(savedSelected).filter((id) => !draft.has(id));
  const changes = toAdd.length + toRemove.length;

  const saveChanges = () => {
    if (!changes) return;
    save.mutate({ add: toAdd, remove: toRemove });
  };

  const toggleNode = (n: TreeNode) => {
    if (!editing) return;
    setSavedSuccess(false);
    const leaves = collectLeafIds(n);
    const all = leaves.every((id: any) => draft.has(id));
    setDraft((prev) => {
      const next = new Set(prev);
      leaves.forEach((id: any) => (all ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const toggleExpand = (id: string) =>
    setExpanded((s) => { const x = new Set(s); x.has(id) ? x.delete(id) : x.add(id); return x; });

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1.5, mb: 2, alignItems: { lg: 'center' } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, flex: 1 }}>All Courses</Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <TextField size="small" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ flex: 1, minWidth: 0 }} />
          <TextField size="small" select label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} sx={{ minWidth: 130 }}>
            <MenuItem value="">All tags</MenuItem>
            {allTags.map((t: any) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Button size="small" onClick={() => setExpanded(new Set(collectAllIds(tree)))}>Expand all</Button>
          <Button size="small" onClick={() => setExpanded(new Set())}>Collapse all</Button>

          {/* Toggle Button for Course Selection */}
          <Box
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!editing) startEditing();
              else cancelEditing();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!editing) startEditing();
                else cancelEditing();
              }
            }}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: '24px',
              border: '1.5px solid',
              borderColor: editing ? '#1A237E' : '#CBD5E1',
              bgcolor: editing ? '#EEF2FF' : '#FFFFFF',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease',
              boxShadow: editing ? '0 2px 8px rgba(26,35,126,0.18)' : '0 1px 3px rgba(0,0,0,0.05)',
              '&:hover': {
                borderColor: '#1A237E',
                bgcolor: editing ? '#E0E7FF' : '#F8FAFC',
              },
            }}
          >
            <Switch
              size="small"
              checked={editing}
              sx={{
                pointerEvents: 'none',
                m: 0,
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1A237E',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1A237E',
                },
              }}
            />
            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: editing ? '#1A237E' : '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              Choose Courses
              {editing && (
                <Chip
                  label="ON"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    bgcolor: '#1A237E',
                    color: '#fff',
                    borderRadius: '4px',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Update Button (Frozen/Disabled when changes === 0) */}
          {editing && (
            <>
              <Tooltip
                title={
                  changes === 0
                    ? 'Update button is frozen because no changes have been made yet.'
                    : `Save ${changes} course selection change${changes > 1 ? 's' : ''}`
                }
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={saveChanges}
                    disabled={changes === 0 || save.isPending}
                    startIcon={
                      changes === 0 ? (
                        <AcUnitIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                      ) : (
                        <CheckIcon sx={{ fontSize: 18 }} />
                      )
                    }
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      px: 2,
                      py: 0.75,
                      bgcolor: '#2E7D32',
                      color: '#fff',
                      boxShadow: changes > 0 ? '0 2px 8px rgba(46,125,50,0.3)' : 'none',
                      '&:hover': {
                        bgcolor: '#1B5E20',
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#E2E8F0',
                        color: '#94A3B8',
                        cursor: 'not-allowed',
                      },
                    }}
                  >
                    {save.isPending
                      ? 'Updating…'
                      : changes > 0
                      ? `Update (${changes})`
                      : 'Update (Frozen)'}
                  </Button>
                </span>
              </Tooltip>

              <Button
                size="small"
                onClick={cancelEditing}
                disabled={save.isPending}
                sx={{
                  textTransform: 'none',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#F1F5F9' },
                }}
              >
                Done
              </Button>

              {savedSuccess && (
                <Chip
                  icon={<CheckIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                  label="Saved & up to date"
                  size="small"
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: 700, fontSize: '0.75rem', height: 28, px: 0.5 }}
                />
              )}
            </>
          )}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {editing
          ? (changes > 0
              ? `You have ${changes} unsaved change${changes > 1 ? 's' : ''}. Click “Update” to save.`
              : 'Course selection mode is active. Check or uncheck topics below, then click “Update” (frozen until edits are made).')
          : 'Toggle “Choose Courses” ON to pick topics for “My Superhighway”. You can still browse, expand and collapse.'}
      </Typography>

      {problem && <Alert severity="error" onClose={() => setProblem('')} sx={{ mb: 1 }}>{problem}</Alert>}
      {error && <Alert severity="error">Could not load courses.</Alert>}

      <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
        {isLoading && <Typography sx={{ p: 2 }}>Loading…</Typography>}
        {!isLoading && !visible.length && <Typography sx={{ p: 2 }} color="text.secondary">Nothing to show.</Typography>}
        <CurriculumTree
          nodes={visible}
          expanded={shownExpanded}
          onToggle={toggleExpand}
          onTitleClick={setViewing}
          renderLeading={(n) => {
            const leaves = collectLeafIds(n);
            const count = leaves.filter((id) => selected.has(id)).length;
            return (
              <Checkbox
                size="small"
                disabled={!editing}
                checked={count === leaves.length}
                indeterminate={count > 0 && count < leaves.length}
                onChange={() => toggleNode(n)}
                title={isLeaf(n) ? 'Add to My Superhighway' : 'Select / unselect everything inside'}
              />
            );
          }}
          renderActions={(n: any) => (
            <Button size="small" startIcon={<VisibilityIcon fontSize="small" />} onClick={() => setViewing(n)}>View</Button>
          )}
        />
      </Paper>

      <Drawer anchor="right" open={!!viewing} onClose={() => setViewing(null)}>
        {viewing && (
          <Box sx={{ width: { xs: '85vw', sm: 400 }, maxWidth: 400, p: 3 }}>
            <Typography variant="caption" color="text.secondary">{pathTo(flat, viewing._id).slice(0, -1).join(' › ') || 'Top level'}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{viewing.title}</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
              {viewing.tags.map((t: any) => <Chip key={t} label={t} size="small" />)}
            </Stack>
            <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{viewing.description || 'No description yet.'}</Typography>
            {!isLeaf(viewing) && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{collectLeafIds(viewing).length} topic(s) inside.</Typography>}
            {editing ? (
              <Button variant="contained" onClick={() => toggleNode(viewing)}>
                {collectLeafIds(viewing).every((id: any) => selected.has(id)) ? 'Untick this topic' : 'Tick this topic'}
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Toggle “Choose Courses” ON above to select this topic.
              </Typography>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}