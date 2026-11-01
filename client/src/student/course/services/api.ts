import apiClient from '../../../context/api/apiClient';
import type { FlatNode } from '../../../utils/courseTree';

export interface Selection {
  courseId: string;
  needsReview: boolean;
}

export const courseService = {
  getTree: async (): Promise<FlatNode[]> => (await apiClient.get('/courses-user/tree')).data.data,

  getMySelections: async (): Promise<Selection[]> =>
    (await apiClient.get('/courses-user/my-selections')).data.data,

  // add / remove many leaf ids in one idempotent call
  updateSelections: async (payload: { add?: string[]; remove?: string[] }) =>
    (await apiClient.post('/courses-user/selections', payload)).data,

  markReviewed: async (id: string) =>
    (await apiClient.patch(`/courses-user/selections/${id}/reviewed`)).data,
};