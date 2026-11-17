import { useQuery } from "@tanstack/react-query";
import { getNewsTicker } from "./api";

export interface Headline {
    _id: string;
    text: string;
    link?: string;
    isLive: boolean;
    liveUntil?: string | null;
    createdAt: string;
}

/** Posts newer than this get the "New" tag. */
const NEW_FOR_MS = 3 * 24 * 60 * 60 * 1000;

/** The headlines endpoint has returned a few shapes over time; accept all of them. */
const normalizeHeadlines = (res: unknown): Headline[] => {
    if (Array.isArray(res)) return res as Headline[];
    const data = (res as { data?: unknown })?.data;
    if (Array.isArray(data)) return data as Headline[];
    const nested = (data as { data?: unknown })?.data;
    return Array.isArray(nested) ? (nested as Headline[]) : [];
};

/** Shared by the hero panel and the mobile strip, so the page makes one request. */
export const useHeadlines = () =>
    useQuery({
        queryKey: ["landing", "headlines"],
        queryFn: async () => normalizeHeadlines(await getNewsTicker()),
    });

export const isNew = (iso: string) => {
    const t = new Date(iso).getTime();
    return !Number.isNaN(t) && Date.now() - t < NEW_FOR_MS;
};

export const toUrl = (link: string) => (link.startsWith("http") ? link : `https://${link}`);

export const formatDate = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const timeAgo = (iso: string) => {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.round(hrs / 24);
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    return formatDate(iso);
};

/** Element id of the hero panel, so other parts of the page can scroll to it. */
export const LATEST_UPDATES_ID = "latest-updates";
