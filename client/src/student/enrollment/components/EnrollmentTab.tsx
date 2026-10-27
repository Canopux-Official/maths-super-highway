import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseService } from '../../course/services/api';
import { buildTree, collectAllIds, collectLeafIds, isLeaf, pruneToLeaves } from '../../../utils/courseTree';
import CurriculumTree from '../../../admin/courses/components/CurriCulumTree';

// "My Superhighway": only the leaves the student ticked, grouped under their parents.
export default function EnrollmentTab() {
  const qc = useQueryClient();
  const { data: flat = [], isLoading } = useQuery({ queryKey: ['user-tree'], queryFn: courseService.getTree });
  const { data: selections = [] } = useQuery({ queryKey: ['my-selections'], queryFn: courseService.getMySelections });

  const reviewIds = useMemo(() => new Set(selections.filter((s) => s.needsReview).map((s) => s.courseId)), [selections]);
  const tree = useMemo(
    () => pruneToLeaves(buildTree(flat), new Set(selections.map((s) => s.courseId))),
    [flat, selections]
  );
  // A selected leaf that is now hidden or gone simply does not appear; it comes back if re-activated.
  const [expanded, setExpanded] = useState<Set<string> | null>(null);
  const open = expanded ?? new Set(collectAllIds(tree)); // everything open by default

  const refresh = () => qc.invalidateQueries({ queryKey: ['my-selections'] });
  const remove = useMutation({ mutationFn: (id: string) => courseService.updateSelections({ remove: [id] }), onSuccess: refresh });
  const reviewed = useMutation({ mutationFn: (id: string) => courseService.markReviewed(id), onSuccess: refresh });

  const toggle = (id: string) =>
    setExpanded((s) => { const x = new Set(s ?? open); x.has(id) ? x.delete(id) : x.add(id); return x; });
  const total = tree.reduce((n, t) => n + collectLeafIds(t).length, 0);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>My Superhighway</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{total} topic(s) selected</Typography>

      {reviewIds.size > 0 && (
        <Alert severity="info" sx={{ mb: 1 }}>
          Some topics you selected have been split into smaller topics. Please review them and choose what you want.
        </Alert>
      )}

      <Paper variant="outlined">
        {isLoading && <Typography sx={{ p: 2 }}>Loading…</Typography>}
        {!isLoading && !tree.length && (
          <Typography sx={{ p: 2 }} color="text.secondary">Nothing selected yet. Go to All Courses and tick the topics you need.</Typography>
        )}
        <CurriculumTree
          nodes={tree}
          expanded={open}
          onToggle={toggle}
          renderActions={(n) =>
            isLeaf(n) ? (
              <Stack direction="row" sx={{ alignItems: "center" }}>
                {reviewIds.has(n._id) && (
                  <>
                    <Chip size="small" color="warning" label="Needs review" />
                    <Tooltip title="Keep as is"><IconButton size="small" onClick={() => reviewed.mutate(n._id)}><CheckIcon fontSize="small" /></IconButton></Tooltip>
                  </>
                )}
                <Tooltip title="Remove"><IconButton size="small" onClick={() => remove.mutate(n._id)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
              </Stack>
            ) : null
          }
        />
      </Paper>
      <Box sx={{ mt: 2 }}><Button href="/student/courses">Browse all courses</Button></Box>
    </Box>
  );
}