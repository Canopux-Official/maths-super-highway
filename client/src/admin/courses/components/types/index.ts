// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface ThumbnailData {
    url: string;
    publicId: string;
}

export interface CourseItem {
    _id: string;
    title: string;
    itemType: 'folder' | 'page';
    content?: string;
    thumbnail?: ThumbnailData;
}

export interface CourseFormState {
    title: string;
    itemType: 'folder' | 'page';
    content: string;
    thumbnail: ThumbnailData;
}

export interface ConfirmState {
    open: boolean;
    title: string;
    message: string;
    action: (() => void) | null;
    color: 'primary' | 'error' | 'warning';
}

export interface PageDetails {
    details: CourseItem;
    enrolledStudents: Array<{ name: string; email: string; phone: string }>;
}