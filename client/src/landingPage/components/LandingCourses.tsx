import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Stack,
    Breadcrumbs,
    Link,
    Chip,
    Button,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FunctionsIcon from "@mui/icons-material/Functions";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { getLandingCurriculum, type LandingFlatNode } from "../api";

/** One card: a topic from the database plus everything inside it. */
interface LandingNode extends LandingFlatNode {
    children: LandingNode[];
}

/** Flat list from the server -> nested cards (built once, drilling in/out needs no more requests). */
const buildLandingTree = (flat: LandingFlatNode[]): LandingNode[] => {
    const map = new Map<string, LandingNode>();
    flat.forEach((n) => map.set(n._id, { ...n, children: [] }));
    const roots: LandingNode[] = [];
    flat.forEach((n) => {
        const node = map.get(n._id)!;
        const parent = n.parentId ? map.get(n.parentId) : undefined;
        (parent ? parent.children : roots).push(node);
    });
    const sort = (list: LandingNode[]) => {
        list.sort((a, b) => a.order - b.order);
        list.forEach((c) => sort(c.children));
    };
    sort(roots);
    return roots;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Unacademy-style flat illustrations, cycled across cards. */
const GENERAL_COVERS = [
    "/courses/illustration-1.png",
    "/courses/illustration-2.png",
    "/courses/illustration-3.png",
    "/courses/illustration-4.png",
];

const getGeneralCover = (index: number) =>
    GENERAL_COVERS[index % GENERAL_COVERS.length];

/** Soft pastel panels like Unacademy feature cards. */
const PASTEL_PANELS = ["#B8D4E8", "#F0B8B0", "#F0D878", "#C5E0D8", "#D4C4E8", "#F5D0A8", "#C8D8F0"];

const getPastel = (index: number) => PASTEL_PANELS[index % PASTEL_PANELS.length];

interface ThumbProps {
    cover: string;
    index: number;
}

const Thumbnail: React.FC<ThumbProps> = ({ cover, index }) => {
    const [coverError, setCoverError] = useState(false);
    const hasCover = !!cover && !coverError;

    return (
        <Box
            sx={{
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "16px",
                bgcolor: getPastel(index),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                px: { xs: 2, sm: 2.5 },
                py: { xs: 2, sm: 2.5 },
                transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                ".course-card:hover &": {
                    transform: "translateY(-2px)",
                },
            }}
        >
            {hasCover ? (
                <Box
                    component="img"
                    src={cover}
                    alt=""
                    onError={() => setCoverError(true)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        filter: "drop-shadow(0 10px 24px rgba(15, 23, 42, 0.12))",
                    }}
                />
            ) : (
                <FunctionsIcon sx={{ fontSize: 56, color: "rgba(15,23,42,0.25)" }} />
            )}
        </Box>
    );
};

const Courses: React.FC = () => {
    const [tree, setTree] = useState<LandingNode[]>([]);
    const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
    const [path, setPath] = useState<LandingNode[]>([]);

    // Load every visible topic once, straight from the database
    useEffect(() => {
        let cancelled = false;
        getLandingCurriculum()
            .then((flat) => {
                if (cancelled) return;
                setTree(buildLandingTree(flat));
                setStatus("ready");
            })
            .catch(() => !cancelled && setStatus("error"));
        return () => {
            cancelled = true;
        };
    }, []);
    // const skipScrollOnMount = useRef(true);

    const currentLevel: LandingNode[] = useMemo(() => {
        if (path.length === 0) return tree;
        return path[path.length - 1].children;
    }, [path, tree]);

    // Keep Academic Catalogue in view when drilling into / out of programme levels.
    // useEffect(() => {
    //     if (skipScrollOnMount.current) {
    //         skipScrollOnMount.current = false;
    //         return;
    //     }

    //     const section = document.getElementById("courses");
    //     if (!section) return;

    //     const headerOffset = 88; // sticky AppBar clearance
    //     const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    //     window.scrollTo({
    //         top: Math.max(0, top),
    //         behavior: "smooth",
    //     });
    // }, [path]);

    const handleExplore = (node: LandingNode) => {
        if (node.children.length > 0) {
            setPath((prev) => [...prev, node]);
        }
    };

    const goHome = () => setPath([]);
    const goToCrumb = (index: number) => setPath((prev) => prev.slice(0, index + 1));
    const goBack = () => setPath((prev) => prev.slice(0, -1));

    const heading = path.length === 0 ? "Explore our programmes" : path[path.length - 1].title;
    const subheading =
        path.length === 0
            ? "Structured pathways across international boards and entrance exams — pick a track and go deeper."
            : path[path.length - 1].description ||
            `${plural(path[path.length - 1].children.length, "topic")} inside. Pick one to go deeper.`;

    return (
        <Box
            id="courses"
            sx={{
                py: { xs: 8, md: 10 },
                bgcolor: "#F8FAFC",
                minHeight: "50vh",
                position: "relative",
                overflow: "hidden",
                scrollMarginTop: "88px",
            }}
        >
            <Box
                aria-hidden
                sx={{
                    position: "absolute",
                    top: -120,
                    right: -80,
                    width: 360,
                    height: 360,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ mb: 4, alignItems: { md: "flex-end" }, justifyContent: "space-between" }}
                >
                    <Box sx={{ maxWidth: 640 }}>
                        <Typography
                            sx={{
                                color: "#0891B2",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                letterSpacing: 1.4,
                                textTransform: "uppercase",
                                mb: 1,
                            }}
                        >
                            Academic Catalogue
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 700,
                                color: "#0A1628",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.2,
                                mb: 1,
                            }}
                        >
                            {heading}
                        </Typography>
                        <Typography
                            sx={{
                                color: "#475569",
                                fontSize: "0.95rem",
                                lineHeight: 1.7,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {subheading}
                        </Typography>
                    </Box>

                    {path.length === 0 && (
                        <Chip
                            icon={<FunctionsIcon sx={{ fontSize: "16px !important" }} />}
                            label={plural(tree.length, "programme")}
                            sx={{
                                alignSelf: { xs: "flex-start", md: "flex-end" },
                                bgcolor: "#fff",
                                border: "1px solid #E2E8F0",
                                fontWeight: 600,
                                color: "#0A1628",
                                height: 36,
                                borderRadius: "999px",
                                px: 0.5,
                            }}
                        />
                    )}
                </Stack>

                {path.length > 0 && (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{
                            mb: 3.5,
                            alignItems: { sm: "center" },
                            p: 1.5,
                            bgcolor: "#fff",
                            border: "1px solid #E2E8F0",
                            borderRadius: "14px",
                        }}
                    >
                        <Button
                            onClick={goBack}
                            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "13px !important" }} />}
                            sx={{
                                flexShrink: 0,
                                color: "#0A1628",
                                bgcolor: "#F1F5F9",
                                borderRadius: "10px",
                                px: 1.75,
                                py: 0.85,
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                "&:hover": { bgcolor: "#E2E8F0" },
                            }}
                        >
                            Back
                        </Button>
                        <Breadcrumbs
                            separator={<ChevronRightIcon sx={{ fontSize: 16, color: "#94A3B8" }} />}
                            sx={{ px: { sm: 0.5 }, rowGap: 0.5 }}
                        >
                            <Link
                                component="button"
                                underline="hover"
                                onClick={goHome}
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    color: "#64748B",
                                    fontSize: "0.82rem",
                                    fontWeight: 500,
                                    border: 0,
                                    background: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <HomeOutlinedIcon sx={{ fontSize: 15 }} />
                                All programmes
                            </Link>
                            {path.map((node, idx) => (
                                <Link
                                    key={node._id}
                                    component="button"
                                    underline="hover"
                                    onClick={() => goToCrumb(idx)}
                                    sx={{
                                        fontSize: "0.82rem",
                                        border: 0,
                                        background: "none",
                                        cursor: "pointer",
                                        color: idx === path.length - 1 ? "#0A1628" : "#64748B",
                                        fontWeight: idx === path.length - 1 ? 700 : 500,
                                        maxWidth: { xs: 160, sm: 220 },
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {node.title}
                                </Link>
                            ))}
                        </Breadcrumbs>
                    </Stack>
                )}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: { xs: 4, md: 5 },
                        rowGap: { xs: 5, md: 6 },
                    }}
                >
                    {status === "ready" && currentLevel.length > 0 ? (
                        currentLevel.map((node, idx) => {
                            const hasChildren = node.children.length > 0;
                            return (
                                <Box
                                    key={node._id}
                                    className="course-card"
                                    onClick={() => handleExplore(node)}
                                    role={hasChildren ? "button" : undefined}
                                    tabIndex={hasChildren ? 0 : undefined}
                                    onKeyDown={(e) => {
                                        if (!hasChildren) return;
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleExplore(node);
                                        }
                                    }}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        cursor: hasChildren ? "pointer" : "default",
                                        bgcolor: "transparent",
                                        outline: "none",
                                        "&:focus-visible .thumb-frame": {
                                            boxShadow: "0 0 0 3px rgba(8,145,178,0.35)",
                                        },
                                    }}
                                >
                                    <Box className="thumb-frame">
                                        <Thumbnail cover={getGeneralCover(idx + path.length)} index={idx + path.length} />
                                    </Box>

                                    <Box sx={{ pt: 2.75, px: 0.25 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontWeight: 700,
                                                fontSize: { xs: "1.15rem", sm: "1.25rem" },
                                                color: "#3C4852",
                                                letterSpacing: "-0.01em",
                                                lineHeight: 1.35,
                                                mb: 1.25,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {node.title}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: "#7A8B94",
                                                fontSize: "0.95rem",
                                                lineHeight: 1.65,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                mb: 1.25,
                                            }}
                                        >
                                            {node.description ||
                                                (hasChildren ? `${plural(node.children.length, "topic")} inside` : "")}
                                        </Typography>

                                        {/* students enrolled · rating · topics inside */}
                                        <Stack
                                            direction="row"
                                            spacing={1.75}
                                            sx={{
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                rowGap: 0.5,
                                                color: "#7A8B94",
                                                fontSize: "0.85rem",
                                                mb: hasChildren ? 1.5 : 0,
                                            }}
                                        >
                                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                                <PeopleAltOutlinedIcon sx={{ fontSize: 16 }} />
                                                <span>{plural(node.students, "student")}</span>
                                            </Stack>
                                            {node.reviews > 0 && (
                                                <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
                                                    <StarRoundedIcon sx={{ fontSize: 17, color: "#F59E0B" }} />
                                                    <span>
                                                        {node.rating.toFixed(1)} ({node.reviews})
                                                    </span>
                                                </Stack>
                                            )}
                                            {hasChildren && (
                                                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                                    <LayersOutlinedIcon sx={{ fontSize: 16 }} />
                                                    <span>{plural(node.children.length, "topic")}</span>
                                                </Stack>
                                            )}
                                        </Stack>

                                        {hasChildren && (
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                sx={{
                                                    alignItems: "center",
                                                    color: "#0891B2",
                                                    mt: 0.5,
                                                    ".course-card:hover &": { color: "#0E7490" },
                                                }}
                                            >
                                                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                                                    Explore
                                                </Typography>
                                                <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                            </Stack>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })
                    ) : (
                        <Typography
                            sx={{
                                color: "#64748B",
                                gridColumn: "1 / -1",
                                textAlign: "center",
                                py: 6,
                            }}
                        >
                            {status === "loading"
                                ? "Loading courses…"
                                : status === "error"
                                    ? "Could not load courses. Please try again later."
                                    : "No courses found."}
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Courses;