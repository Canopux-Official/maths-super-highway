// ─── googleDriveService.ts ───────────────────────────────────────────────────
// All Google OAuth + Drive API logic lives here.
// Import from this file wherever Drive access is needed.

declare global {
    interface Window { google: any; gapi: any; }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES           = import.meta.env.VITE_SCOPES;
const DISCOVERY_DOCS   = import.meta.env.VITE_DISCOVERY_DOCS;

// ── Internal state ────────────────────────────────────────────────────────────
let _accessToken: string | null = null;
let _gapiReady = false;

// ── Stored Drive file shape ───────────────────────────────────────────────────
export interface DriveFile {
    fileId:      string;
    fileName:    string;
    webViewLink: string;
    /** Embed-friendly URL for inline iframe preview */
    previewLink: string;
    downloadLink?: string;
}

// ── Low-level helpers ─────────────────────────────────────────────────────────

/**
 * Load & initialise the gapi client (idempotent).
 */
export const initGoogleDrive = (): Promise<void> =>
    new Promise((resolve, reject) => {
        if (_gapiReady) { resolve(); return; }
        if (!window.gapi) { reject(new Error('gapi script not loaded')); return; }
        window.gapi.load('client', async () => {
            try {
                await window.gapi.client.init({ discoveryDocs: [DISCOVERY_DOCS] });
                _gapiReady = true;
                resolve();
            } catch (e) { reject(e); }
        });
    });

/**
 * Obtain (or reuse a cached) OAuth access token via Google Identity Services.
 * Triggers the Google sign-in popup if no token is cached.
 */
export const getAccessToken = (): Promise<string> =>
    new Promise((resolve, reject) => {
        if (_accessToken) { resolve(_accessToken); return; }
        if (!window.google?.accounts?.oauth2) {
            reject(new Error('Google Identity Services not loaded'));
            return;
        }
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: (r: any) => {
                if (r.error) { reject(r); return; }
                _accessToken = r.access_token;
                resolve(r.access_token);
            },
        });
        client.requestAccessToken();
    });

/**
 * Discard the cached access token (e.g. on sign-out).
 */
export const clearAccessToken = (): void => { _accessToken = null; };

/**
 * Whether the gapi client has been initialised.
 */
export const isGoogleDriveInitialized = (): boolean => _gapiReady;

// ── Permissions ───────────────────────────────────────────────────────────────

/**
 * Grant public read access to a Drive file.
 */
export const makeFilePublic = async (fileId: string): Promise<boolean> => {
    try {
        const token = await getAccessToken();
        const res = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: 'reader', type: 'anyone' }),
            }
        );
        return res.ok;
    } catch { return false; }
};

// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Upload a single File to Google Drive, make it public, and return a DriveFile
 * descriptor.  `onProgress` receives values 0-100.
 */
export const uploadFileToDrive = (
    file: File,
    onProgress?: (percent: number) => void
): Promise<DriveFile> =>
    new Promise(async (resolve, reject) => {
        try {
            await initGoogleDrive();
            const token = await getAccessToken();

            const form = new FormData();
            form.append(
                'metadata',
                new Blob([JSON.stringify({ name: file.name, mimeType: file.type })], {
                    type: 'application/json',
                })
            );
            form.append('file', file);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            });

            xhr.addEventListener('load', async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    await makeFilePublic(data.id);
                    resolve({
                        fileId:      data.id,
                        fileName:    file.name,
                        webViewLink: data.webViewLink,
                        previewLink: `https://drive.google.com/file/d/${data.id}/preview`,
                    });
                } else {
                    reject(new Error(`Upload failed: ${xhr.status} – ${xhr.responseText}`));
                }
            });

            xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
            xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

            xhr.open(
                'POST',
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink'
            );
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(form);
        } catch (e) {
            reject(e);
        }
    });

// ── Delete ────────────────────────────────────────────────────────────────────

/**
 * Permanently delete a file from Google Drive.
 * Use with caution — prefer unlinking in your app and letting users manage Drive directly.
 */
export const deleteFileFromDrive = async (fileId: string): Promise<boolean> => {
    try {
        const token = await getAccessToken();
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok || res.status === 204;
    } catch { return false; }
};

// ── Metadata ──────────────────────────────────────────────────────────────────

/**
 * Fetch metadata for a Drive file (size, mimeType, timestamps, links, …).
 */
export const getFileMetadata = async (fileId: string): Promise<any> => {
    const token = await getAccessToken();
    const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}` +
        '?fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink',
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`Failed to get file metadata: ${res.status}`);
    return res.json();
};

// ── Serialisation helpers ─────────────────────────────────────────────────────

/** Serialise a DriveFile to the JSON string stored in `content`. */
export const serializeDriveFile = (f: DriveFile): string => JSON.stringify(f);

/** Parse a `content` JSON string back to a DriveFile, or return null. */
export const parseDriveFile = (content: string): DriveFile | null => {
    try { return content ? (JSON.parse(content) as DriveFile) : null; }
    catch { return null; }
};