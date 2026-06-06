// import React from "react";
// import { 
//     Box, Typography, Skeleton, Alert, Card, 
//     CardContent, CardActionArea, Container, Stack 
// } from "@mui/material";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import { useQuery } from "@tanstack/react-query";
// import type { Course } from "..";
// import { getAllCourses, getEnrolledStudents } from "../api";

// const Courses: React.FC = () => {
//     const { data: { courses, enrolledCounts } = { courses: [], enrolledCounts: {} }, isLoading: loading, error } = useQuery({
//         queryKey: ['landingCourses'],
//         queryFn: async () => {
//             const res = await getAllCourses();
//             const courseData = Array.isArray(res) ? res : (res as any).data || [];

//             // Filtering: Only show active folders
//             const filteredFolders = courseData.filter(
//                 (item: Course) => item.itemType === "folder"
//             );

//             // Fetch enrolled counts for all folders in parallel
//             const countEntries = await Promise.all(
//                 filteredFolders.map(async (course: Course) => {
//                     try {
//                         const data = await getEnrolledStudents(course._id);
//                         // Support both { count: number } and a plain number response
//                         const count = typeof data === "number" ? data : data?.data?.enrolledCount ?? 0;
//                         return [course._id, count] as [string, number];
//                     } catch {
//                         return [course._id, 0] as [string, number];
//                     }
//                 })
//             );
            
//             return {
//                 courses: filteredFolders,
//                 enrolledCounts: Object.fromEntries(countEntries)
//             };
//         }
//     });

//     return (
//         <Box sx={{ py: 8, bgcolor: "#f2f4f6ca", minHeight: "50vh" }}>
//             <Container maxWidth="lg">
//                 {/* --- Clean, Smaller Heading --- */}
//                 <Box sx={{ mb: 5 }}>
//                     <Typography 
//                         variant="overline" 
//                         sx={{ color: "#1A237E", fontWeight: 700, letterSpacing: 1.2 }}
//                     >
//                         Academic Catalogue
//                     </Typography>
//                     <Typography 
//                         variant="h5" 
//                         sx={{ fontWeight: 800, color: "#1a1a1a", mt: 0.5 }}
//                     >
//                         Available Programs
//                     </Typography>
//                 </Box>

//                 {error && <Alert severity="error" sx={{ mb: 4 }}>Unable to fetch program categories.</Alert>}

//                 {/* --- Flex Container --- */}
//                 <Box 
//                     sx={{ 
//                         display: "flex", 
//                         flexWrap: "wrap", 
//                         gap: 3,
//                         justifyContent: "flex-start" 
//                     }}
//                 >
//                     {loading ? (
//                         [1, 2, 3].map((i) => (
//                             <Skeleton 
//                                 key={i} 
//                                 variant="rectangular" 
//                                 sx={{ 
//                                     width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" }, 
//                                     height: 220, 
//                                     borderRadius: 3 
//                                 }} 
//                             />
//                         ))
//                     ) : courses.length > 0 ? (
//                         courses.map((course: Course) => (
//                             <Card 
//                                 key={course._id}
//                                 elevation={0}
//                                 sx={{ 
//                                     width: { 
//                                         xs: "100%", 
//                                         sm: "calc(50% - 12px)", 
//                                         md: "calc(33.333% - 16px)" 
//                                     },
//                                     borderRadius: 3,
//                                     border: "1px solid #efefef",
//                                     bgcolor: "#fcfcfc",
//                                     transition: "0.2s",
//                                     "&:hover": {
//                                         borderColor: "#1A237E",
//                                         bgcolor: "#fff",
//                                         boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
//                                     }
//                                 }}
//                             >
//                                 <CardActionArea sx={{ height: '100%' }}>
//                                     <CardContent sx={{ p: 3 }}>
//                                         <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, mb: 2 }}>
//                                             <FolderOpenIcon sx={{ color: "#1A237E", fontSize: 22 }} />
//                                             <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
//                                                 {course.title}
//                                             </Typography>
//                                         </Stack>

//                                         <Typography 
//                                             variant="body2" 
//                                             sx={{ 
//                                                 color: "text.secondary", 
//                                                 mb: 3,
//                                                 lineHeight: 1.6,
//                                                 minHeight: "4.8em",
//                                                 display: "-webkit-box",
//                                                 WebkitLineClamp: 3,
//                                                 WebkitBoxOrient: "vertical",
//                                                 overflow: "hidden"
//                                             }}
//                                         >
//                                             {course.content.replace(/<[^>]*>?/gm, "")}
//                                         </Typography>

//                                         <Stack 
//                                             sx={{ 
//                                                 flexDirection: "row", 
//                                                 alignItems: "center", 
//                                                 justifyContent: "space-between",
//                                                 pt: 1,
//                                                 borderTop: "1px solid #f0f0f0"
//                                             }}
//                                         >
//                                             {/* Enrolled count badge */}
//                                             <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.6 }}>
//                                                 <PeopleAltOutlinedIcon sx={{ fontSize: 15, color: "text.disabled" }} />
//                                                 <Typography variant="caption" sx={{ color: "text.secondary" }}>
//                                                     {enrolledCounts[course._id] ?? "—"} enrolled
//                                                 </Typography>
//                                             </Stack>

//                                             <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5, color: "#1A237E" }}>
//                                                 <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
//                                                     Explore
//                                                 </Typography>
//                                                 <ChevronRightIcon fontSize="small" />
//                                             </Stack>
//                                         </Stack>
//                                     </CardContent>
//                                 </CardActionArea>
//                             </Card>
//                         ))
//                     ) : (
//                         <Typography sx={{ color: "text.secondary", width: "100%", textAlign: "center", py: 5 }}>
//                             No folders found.
//                         </Typography>
//                     )}
//                 </Box>
//             </Container>
//         </Box>
//     );
// };

// export default Courses;


import React, { useState } from "react";
import {
    Box,
    Typography,
    Skeleton,
    Alert,
    Card,
    CardContent,
    CardActionArea,
    Container,
    Stack,
    Modal,
    Button,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Course } from "..";
import { getAllCourses, getEnrolledStudents } from "../api";

// ─── Fallback image (a generic academic/book SVG data URI) ───────────────────
const FALLBACK_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23E8EAF6'/%3E%3Crect x='155' y='62' width='90' height='110' rx='6' fill='%231A237E' opacity='.15'/%3E%3Crect x='165' y='55' width='90' height='110' rx='6' fill='%231A237E' opacity='.25'/%3E%3Crect x='175' y='48' width='90' height='110' rx='6' fill='%231A237E' opacity='.45'/%3E%3Cline x1='190' y1='75' x2='250' y2='75' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='90' x2='250' y2='90' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='105' x2='230' y2='105' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

// ─── Gradient palettes for thumbnail placeholders ────────────────────────────
const PLACEHOLDER_GRADIENTS = [
    "linear-gradient(135deg, #1A237E 0%, #3949AB 100%)",
    "linear-gradient(135deg, #00695C 0%, #00897B 100%)",
    "linear-gradient(135deg, #4527A0 0%, #7B1FA2 100%)",
    "linear-gradient(135deg, #B71C1C 0%, #E53935 100%)",
    "linear-gradient(135deg, #1565C0 0%, #0288D1 100%)",
];

const getGradient = (index: number) =>
    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

// ─── Sign-in modal ────────────────────────────────────────────────────────────
interface SignInModalProps {
    open: boolean;
    programName?: string;
    onClose: () => void;
    onSignIn: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({
    open,
    programName,
    onClose,
    onSignIn,
}) => (
    <Modal open={open} onClose={onClose} disableScrollLock>
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "#fff",
                borderRadius: 4,
                p: { xs: 3.5, sm: 5 },
                width: { xs: "90vw", sm: 400 },
                outline: "none",
                textAlign: "center",
                boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            }}
        >
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "#E8EAF6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2.5,
                }}
            >
                <LockOutlinedIcon sx={{ color: "#1A237E", fontSize: 28 }} />
            </Box>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 800,
                    color: "#1a1a1a",
                    mb: 1,
                    fontSize: "1.35rem",
                }}
            >
                Sign in to continue
            </Typography>

            <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3.5, lineHeight: 1.7 }}
            >
                {programName
                    ? `Sign in to explore the ${programName} program and access all available courses.`
                    : "Sign in to browse the full programme catalogue and enrol in courses."}
            </Typography>

            <Button
                fullWidth
                onClick={onSignIn}
                sx={{
                    bgcolor: "#1A237E",
                    color: "#fff",
                    borderRadius: 3,
                    py: 1.4,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    mb: 1.5,
                    "&:hover": { bgcolor: "#13197a" },
                }}
            >
                Sign in
            </Button>

            <Button
                fullWidth
                onClick={onClose}
                sx={{
                    color: "text.secondary",
                    borderRadius: 3,
                    py: 1.2,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#f5f5f5" },
                }}
            >
                Maybe later
            </Button>
        </Box>
    </Modal>
);

// ─── Thumbnail with fallback ──────────────────────────────────────────────────
interface ThumbProps {
    url?: string;
    title: string;
    index: number;
}

const Thumbnail: React.FC<ThumbProps> = ({ url, title, index }) => {
    const [imgError, setImgError] = useState(false);
    const hasValidUrl = url && url.trim() !== "";

    // If a valid URL exists and hasn't errored, show the real image
    if (hasValidUrl && !imgError) {
        return (
            <Box
                component="img"
                src={url}
                alt={title}
                onError={() => setImgError(true)}
                sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    display: "block",
                }}
            />
        );
    }

    // Gradient placeholder with initials + fallback SVG underneath
    return (
        <Box
            sx={{
                width: "100%",
                aspectRatio: "16/9",
                background: getGradient(index),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle fallback book icon as background texture */}
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
                    fontSize: { xs: "1.8rem", sm: "2.2rem" },
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

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_VISIBLE = 5;

// ─── Main component ───────────────────────────────────────────────────────────
const Courses: React.FC = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<string | undefined>();

    const {
        data: { courses, enrolledCounts } = { courses: [], enrolledCounts: {} },
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ["landingCourses"],
        queryFn: async () => {
            const res = await getAllCourses();
            const courseData = Array.isArray(res)
                ? res
                : (res as any).data || [];

            const filteredFolders = courseData.filter(
                (item: Course) => item.itemType === "folder"
            );

            const countEntries = await Promise.all(
                filteredFolders.map(async (course: Course) => {
                    try {
                        const data = await getEnrolledStudents(course._id);
                        const count =
                            typeof data === "number"
                                ? data
                                : data?.data?.enrolledCount ?? 0;
                        return [course._id, count] as [string, number];
                    } catch {
                        return [course._id, 0] as [string, number];
                    }
                })
            );

            return {
                courses: filteredFolders,
                enrolledCounts: Object.fromEntries(countEntries),
            };
        },
    });

    const openSignIn = (programName?: string) => {
        setSelectedProgram(programName);
        setModalOpen(true);
    };

    const handleSignIn = () => {
        setModalOpen(false);
        navigate("/login");
    };

    const visibleCourses = courses.slice(0, MAX_VISIBLE);
    const hiddenCount = courses.length - MAX_VISIBLE;
    const showMoreCard = hiddenCount > 0;

    return (
        <>
            <Box id="courses" sx={{ py: 8, bgcolor: "#f2f4f6ca", minHeight: "50vh" }}>
                <Container maxWidth="lg">

                    {/* ── Header — original style preserved ── */}
                    <Box sx={{ mb: 5 }}>
                        <Typography
                            variant="overline"
                            sx={{ color: "#1A237E", fontWeight: 700, letterSpacing: 1.2 }}
                        >
                            Academic Catalogue
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 800, color: "#1a1a1a", mt: 0.5 }}
                        >
                            Available Programs
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            Unable to fetch program categories.
                        </Alert>
                    )}

                    {/* ── Flex grid — mobile first ── */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            justifyContent: "flex-start",
                        }}
                    >
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <Skeleton
                                    key={i}
                                    variant="rectangular"
                                    sx={{
                                        width: {
                                            xs: "100%",
                                            sm: "calc(50% - 12px)",
                                            md: "calc(33.333% - 16px)",
                                        },
                                        height: 280,
                                        borderRadius: 3,
                                    }}
                                />
                            ))
                        ) : visibleCourses.length > 0 ? (
                            <>
                                {visibleCourses.map((course: Course, idx: number) => (
                                    <Card
                                        key={course._id}
                                        elevation={0}
                                        sx={{
                                            width: {
                                                xs: "100%",
                                                sm: "calc(50% - 12px)",
                                                md: "calc(33.333% - 16px)",
                                            },
                                            borderRadius: 3,
                                            border: "1px solid #efefef",
                                            bgcolor: "#fcfcfc",
                                            overflow: "hidden",
                                            transition: "0.2s",
                                            "&:hover": {
                                                borderColor: "#1A237E",
                                                bgcolor: "#fff",
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                            },
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => openSignIn(course.title)}
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "stretch",
                                            }}
                                        >
                                            {/* Thumbnail */}
                                            <Thumbnail
                                                url={course?.thumbnail?.url}
                                                title={course.title}
                                                index={idx}
                                            />

                                            <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>

                                                {/* Title row */}
                                                <Stack
                                                    sx={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <FolderOpenIcon sx={{ color: "#1A237E", fontSize: 22 }} />
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ fontWeight: 700, color: "#1a1a1a" }}
                                                    >
                                                        {course.title}
                                                    </Typography>
                                                </Stack>

                                                {/* Description */}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "text.secondary",
                                                        mb: 3,
                                                        lineHeight: 1.6,
                                                        minHeight: "4.8em",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        flex: 1,
                                                    }}
                                                >
                                                    {course.content
                                                        ? course.content.replace(/<[^>]*>?/gm, "")
                                                        : "Discover this program's curriculum, structure, and career pathways by signing in."}
                                                </Typography>

                                                {/* Footer */}
                                                <Stack
                                                    sx={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        pt: 1,
                                                        borderTop: "1px solid #f0f0f0",
                                                    }}
                                                >
                                                    {/* Enrolled count */}
                                                    <Stack
                                                        sx={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: 0.6,
                                                        }}
                                                    >
                                                        <PeopleAltOutlinedIcon
                                                            sx={{ fontSize: 15, color: "text.disabled" }}
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{ color: "text.secondary" }}
                                                        >
                                                            {enrolledCounts[course._id] ?? "—"} enrolled
                                                        </Typography>
                                                    </Stack>

                                                    {/* Explore CTA */}
                                                    <Stack
                                                        sx={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: 0.5,
                                                            color: "#1A237E",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontWeight: 700,
                                                                textTransform: "uppercase",
                                                            }}
                                                        >
                                                            Explore
                                                        </Typography>
                                                        <ChevronRightIcon fontSize="small" />
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                ))}

                                {/* ── More programs card ── */}
                                {showMoreCard && (
                                    <Card
                                        elevation={0}
                                        onClick={() => openSignIn()}
                                        sx={{
                                            width: {
                                                xs: "100%",
                                                sm: "calc(50% - 12px)",
                                                md: "calc(33.333% - 16px)",
                                            },
                                            borderRadius: 3,
                                            background: "linear-gradient(145deg, #1A237E 0%, #283593 100%)",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minHeight: 220,
                                            p: 4,
                                            transition: "transform 0.22s ease, box-shadow 0.22s ease",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: "0 16px 40px rgba(26,35,126,0.25)",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: "50%",
                                                bgcolor: "rgba(255,255,255,0.12)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                mb: 1.5,
                                            }}
                                        >
                                            <GridViewRoundedIcon
                                                sx={{ color: "rgba(255,255,255,0.7)", fontSize: 26 }}
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                color: "#fff",
                                                fontSize: "1.1rem",
                                                textAlign: "center",
                                                mb: 0.5,
                                            }}
                                        >
                                            +{hiddenCount} more{" "}
                                            {hiddenCount === 1 ? "program" : "programs"}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: "0.8rem",
                                                color: "rgba(255,255,255,0.6)",
                                                textAlign: "center",
                                                lineHeight: 1.5,
                                                mb: 2,
                                            }}
                                        >
                                            Sign in to browse the full catalogue
                                        </Typography>

                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 0.5,
                                                color: "rgba(255,255,255,0.85)",
                                                bgcolor: "rgba(255,255,255,0.12)",
                                                borderRadius: 5,
                                                px: 2,
                                                py: 0.8,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    letterSpacing: 1,
                                                    color: "rgba(255,255,255,0.85)",
                                                }}
                                            >
                                                Sign in
                                            </Typography>
                                            <ChevronRightIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }} />
                                        </Stack>
                                    </Card>
                                )}
                            </>
                        ) : (
                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    width: "100%",
                                    textAlign: "center",
                                    py: 5,
                                }}
                            >
                                No folders found.
                            </Typography>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* ── Sign-in modal ── */}
            <SignInModal
                open={modalOpen}
                programName={selectedProgram}
                onClose={() => setModalOpen(false)}
                onSignIn={handleSignIn}
            />
        </>
    );
};

export default Courses;