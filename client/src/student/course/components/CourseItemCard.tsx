import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    Skeleton,
    Stack,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

// ─── Fallback SVG data URI ────────────────────────────────────────────────────
const FALLBACK_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23E8EAF6'/%3E%3Crect x='155' y='62' width='90' height='110' rx='6' fill='%231A237E' opacity='.15'/%3E%3Crect x='165' y='55' width='90' height='110' rx='6' fill='%231A237E' opacity='.25'/%3E%3Crect x='175' y='48' width='90' height='110' rx='6' fill='%231A237E' opacity='.45'/%3E%3Cline x1='190' y1='75' x2='250' y2='75' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='90' x2='250' y2='90' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='105' x2='230' y2='105' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

// ─── Gradient palettes ────────────────────────────────────────────────────────
const PLACEHOLDER_GRADIENTS = [
    "linear-gradient(135deg, #1A237E 0%, #3949AB 100%)",
    "linear-gradient(135deg, #00695C 0%, #00897B 100%)",
    "linear-gradient(135deg, #4527A0 0%, #7B1FA2 100%)",
    "linear-gradient(135deg, #B71C1C 0%, #E53935 100%)",
    "linear-gradient(135deg, #1565C0 0%, #0288D1 100%)",
];

const getGradient = (index: number) =>
    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

// ─── Types ────────────────────────────────────────────────────────────────────
interface CourseItem {
    _id: string;
    title: string;
    itemType: "folder" | "page";
    content: string;
    thumbnail?: {
        url: string;
        publicId: string;
    };
}

interface Props {
    item: CourseItem;
    onClick: () => void;
    enrolledCount?: number | null;
    index?: number;
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────
interface ThumbProps {
    url?: string;
    title: string;
    index: number;
    isFolder: boolean;
}

const Thumbnail: React.FC<ThumbProps> = ({ url, title, index }) => {
    const [imgError, setImgError] = useState(false);
    const hasValidUrl = url && url.trim() !== "";

    if (hasValidUrl && !imgError) {
        return (
            <Box
                component="img"
                src={url}
                alt={title}
                onError={() => setImgError(true)}
                sx={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    display: "block",
                    flexShrink: 0,
                }}
            />
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: 140,
                background: getGradient(index),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
            }}
        >
            <Box
                component="img"
                src={FALLBACK_IMG}
                alt=""
                aria-hidden="true"
                sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.18,
                }}
            />
            <Typography
                sx={{
                    fontWeight: 800,
                    fontSize: "1.8rem",
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: 3,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {title.slice(0, 3).toUpperCase()}
            </Typography>
        </Box>
    );
};

// ─── Main card component ──────────────────────────────────────────────────────
const CourseItemCard: React.FC<Props> = ({
    item,
    onClick,
    enrolledCount,
    index = 0,
}) => {
    const isFolder = item.itemType === "folder";
    const accentColor = isFolder ? "#1A237E" : "#2E7D32";

    return (
        <Card
            elevation={0}
            sx={{
                width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.333% - 16px)",
                },
                borderRadius: 3,
                border: "1px solid #efefef",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fcfcfc",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                    borderColor: accentColor,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                },
            }}
        >
            <CardActionArea
                onClick={onClick}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    height: "100%",
                }}
            >
                {/* ── Thumbnail ── */}
                <Thumbnail
                    url={item.thumbnail?.url}
                    title={item.title}
                    index={index}
                    isFolder={isFolder}
                />

                {/* ── Always-visible text content ── */}
                <CardContent
                    sx={{
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        flexGrow: 1,
                        bgcolor: "#ffffff",
                        borderTop: "1px solid #f0f0f0",
                    }}
                >
                    {/* Top: icon + title + description */}
                    <Box>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1.2,
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 1.2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: accentColor,
                                    flexShrink: 0,
                                }}
                            >
                                {isFolder ? (
                                    <FolderOpenIcon sx={{ fontSize: 15, color: "#fff" }} />
                                ) : (
                                    <ArticleIcon sx={{ fontSize: 15, color: "#fff" }} />
                                )}
                            </Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 800,
                                    color: "#121212",
                                    lineHeight: 1.2,
                                }}
                            >
                                {item.title}
                            </Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#616161",
                                fontWeight: 500,
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {isFolder
                                ? item.content || "Explore this module's lessons."
                                : "Click to view lesson details"}
                        </Typography>
                    </Box>

                    {/* Bottom: enrolled + CTA */}
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            pt: 1.5,
                            mt: 1.5,
                            borderTop: "1px solid rgba(0,0,0,0.07)",
                        }}
                    >
                        {/* Enrolled badge */}
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 0.6,
                            }}
                        >
                            <PeopleAltOutlinedIcon
                                sx={{ fontSize: 16, color: accentColor }}
                            />
                            {enrolledCount === null ? (
                                <Skeleton
                                    width={32}
                                    height={14}
                                    sx={{ borderRadius: 0.5 }}
                                />
                            ) : (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                        color: accentColor,
                                    }}
                                >
                                    {enrolledCount ?? 0}{" "}
                                    {enrolledCount !== 1 ? "Students" : "Student"}
                                </Typography>
                            )}
                        </Stack>

                        {/* CTA */}
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 0.2,
                                color: accentColor,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    fontSize: "0.7rem",
                                    color: accentColor,
                                }}
                            >
                                {isFolder ? "Open" : "View"}
                            </Typography>
                            <ChevronRightIcon fontSize="small" />
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CourseItemCard;