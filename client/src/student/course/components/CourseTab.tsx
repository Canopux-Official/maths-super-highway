import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Drawer, MenuItem, Paper, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  const selected = useMemo(() => new Set(selections.map((s) => s.courseId)), [selections]);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [viewing, setViewing] = useState<TreeNode | null>(null);
  const [problem, setProblem] = useState('');

  const filtering = !!(query.trim() || tag);
  const visible = useMemo(() => filterTree(tree, query, tag), [tree, query, tag]);
  const shownExpanded = useMemo(() => (filtering ? new Set(collectAllIds(visible)) : expanded), [filtering, visible, expanded]);

  // Optimistic: the tick appears at once and rolls back if the server says no
  const change = useMutation({
    mutationFn: (p: { add?: string[]; remove?: string[] }) => courseService.updateSelections(p),
    onMutate: async ({ add = [], remove = [] }) => {
      await qc.cancelQueries({ queryKey: SEL_KEY });
      const prev = qc.getQueryData<Selection[]>(SEL_KEY) ?? [];
      const removed = new Set(remove);
      const next = [
        ...prev.filter((s) => !removed.has(s.courseId)),
        ...add.filter((id) => !prev.some((s) => s.courseId === id)).map((id) => ({ courseId: id, needsReview: false })),
      ];
      qc.setQueryData(SEL_KEY, next);
      return { prev };
    },
    onError: (e: any, _v, ctx) => {
      if (ctx) qc.setQueryData(SEL_KEY, ctx.prev);
      setProblem(e?.response?.data?.message ?? 'Could not save your selection');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: SEL_KEY }),
  });

  const toggleNode = (n: TreeNode) => {
    const leaves = collectLeafIds(n);
    const all = leaves.every((id: any) => selected.has(id));
    change.mutate(all ? { remove: leaves } : { add: leaves.filter((id: any) => !selected.has(id)) })
  };
  const toggleExpand = (id: string) =>
    setExpanded((s) => { const x = new Set(s); x.has(id) ? x.delete(id) : x.add(id); return x; });

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2, alignItems: { sm: 'center' } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, flex: 1 }}>All Courses</Typography>
        <TextField size="small" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        <TextField size="small" select label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} sx={{ minWidth: 130 }}>
          <MenuItem value="">All tags</MenuItem>
          {allTags.map((t: any) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <Button onClick={() => setExpanded(new Set(collectAllIds(tree)))}>Expand all</Button>
        <Button onClick={() => setExpanded(new Set())}>Collapse all</Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Tick the topics you want. They are added to “My Superhighway”. Ticking a parent selects everything inside it.
      </Typography>

      {problem && <Alert severity="error" onClose={() => setProblem('')} sx={{ mb: 1 }}>{problem}</Alert>}
      {error && <Alert severity="error">Could not load courses.</Alert>}

      <Paper variant="outlined">
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
          <Box sx={{ width: { xs: 300, sm: 400 }, p: 3 }}>
            <Typography variant="caption" color="text.secondary">{pathTo(flat, viewing._id).slice(0, -1).join(' › ') || 'Top level'}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{viewing.title}</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
              {viewing.tags.map((t: any) => <Chip key={t} label={t} size="small" />)}
            </Stack>
            <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{viewing.description || 'No description yet.'}</Typography>
            {!isLeaf(viewing) && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{collectLeafIds(viewing).length} topic(s) inside.</Typography>}
            <Button variant="contained" onClick={() => toggleNode(viewing)}>
              {collectLeafIds(viewing).every((id: any) => selected.has(id)) ? 'Remove from My Superhighway' : 'Add to My Superhighway'}
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}