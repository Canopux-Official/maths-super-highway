import apiClient from '../../../context/api/apiClient';
import type { FlatNode } from '../../../utils/courseTree';

export interface NodeInput {
    title?: string;
    description?: string;
    tags?: string[];
    isActive?: boolean;
    parentId?: string | null;
    expectedUpdatedAt?: string;
}

export const courseService = {
    // One request returns the whole tree as a flat list
    getTree: async (): Promise<FlatNode[]> => (await apiClient.get('/courses-admin/tree')).data.data,

    // { [leafId]: number of students who ticked it }
    getSelectionCounts: async (): Promise<Record<string, number>> =>
        (await apiClient.get('/courses-admin/stats')).data.data,

    createCourse: async (data: NodeInput & { title: string }) =>
        (await apiClient.post('/courses-admin/create', data)).data,

    updateCourse: async (id: string, data: NodeInput) =>
        (await apiClient.patch(`/courses-admin/update/${id}`, data)).data,

    moveCourse: async (id: string, newParentId: string | null) =>
        (await apiClient.patch(`/courses-admin/move/${id}`, { newParentId })).data,

    reorderCourse: async (id: string, direction: 'up' | 'down') =>
        (await apiClient.patch(`/courses-admin/reorder/${id}`, { direction })).data,

    getDeletePreview: async (id: string): Promise<{ nodes: number; selections: number }> =>
        (await apiClient.get(`/courses-admin/delete-preview/${id}`)).data.data,

    deleteCourse: async (id: string) => (await apiClient.delete(`/courses-admin/delete/${id}`)).data,

    getEnrolledStudents: async (id: string) => (await apiClient.get(`/courses-admin/enrolled-count/${id}`)).data,

    exportCourseStudents: async (id: string) => (await apiClient.get(`/courses-admin/enrolled-students/${id}`)).data,
};