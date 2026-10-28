import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Drawer, MenuItem, Paper, Stack, TextField, Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseService } from '../services/api';
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
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: SEL_KEY }); // wait so the screen doesn't flash old ticks
      setEditing(false);
    },
    onError: (e: any) => setProblem(e?.response?.data?.message ?? 'Could not save your selection'),
  });

  const startEditing = () => {
    setDraft(new Set(savedSelected));
    setProblem('');
    setEditing(true);
  };
  const cancelEditing = () => setEditing(false);

  const toAdd = Array.from(draft).filter((id) => !savedSelected.has(id));
  const toRemove = Array.from(savedSelected).filter((id) => !draft.has(id));
  const changes = toAdd.length + toRemove.length;

  const saveChanges = () => {
    if (!changes) return setEditing(false);
    save.mutate({ add: toAdd, remove: toRemove });
  };

  const toggleNode = (n: TreeNode) => {
    if (!editing) return;
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

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => setExpanded(new Set(collectAllIds(tree)))}>Expand all</Button>
          <Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
          {!editing ? (
            <Button variant="contained" onClick={startEditing}>Choose Courses</Button>
          ) : (
            <>
              <Button variant="contained" color="success" onClick={saveChanges} disabled={save.isPending}>
                {save.isPending ? 'Updating…' : `Update${changes ? ` (${changes})` : ''}`}
              </Button>
              <Button onClick={cancelEditing} disabled={save.isPending}>Cancel</Button>
            </>
          )}
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {editing
          ? 'Tick the topics you want, then press Update. Ticking a parent selects everything inside it.'
          : 'Press “Choose Courses” to pick topics for “My Superhighway”. You can still browse, expand and collapse.'}
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
                Press “Choose Courses” on the main page to select this topic.
              </Typography>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}