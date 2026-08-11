
// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Typography,
//     Skeleton,
//     Alert,
//     Card,
//     CardContent,
//     CardActionArea,
//     Container,
//     Stack,
//     Modal,
//     Button,
// } from "@mui/material";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { useNavigate } from "react-router-dom";
// import type { Course } from "..";
// import { getAllCourses, getEnrolledStudents } from "../api";
// import { useAuth } from "../../context/AuthContext";


// // ─── Fallback image (a generic academic/book SVG data URI) ───────────────────
// const FALLBACK_IMG =
//     "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23E8EAF6'/%3E%3Crect x='155' y='62' width='90' height='110' rx='6' fill='%231A237E' opacity='.15'/%3E%3Crect x='165' y='55' width='90' height='110' rx='6' fill='%231A237E' opacity='.25'/%3E%3Crect x='175' y='48' width='90' height='110' rx='6' fill='%231A237E' opacity='.45'/%3E%3Cline x1='190' y1='75' x2='250' y2='75' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='90' x2='250' y2='90' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='105' x2='230' y2='105' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

// // ─── Gradient palettes for thumbnail placeholders ────────────────────────────
// const PLACEHOLDER_GRADIENTS = [
//     "linear-gradient(135deg, #1A237E 0%, #3949AB 100%)",
//     "linear-gradient(135deg, #00695C 0%, #00897B 100%)",
//     "linear-gradient(135deg, #4527A0 0%, #7B1FA2 100%)",
//     "linear-gradient(135deg, #B71C1C 0%, #E53935 100%)",
//     "linear-gradient(135deg, #1565C0 0%, #0288D1 100%)",
// ];

// const getGradient = (index: number) =>
//     PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

// // ─── Sign-in modal ────────────────────────────────────────────────────────────
// interface SignInModalProps {
//     open: boolean;
//     programName?: string;
//     onClose: () => void;
//     onSignIn: () => void;
// }



// const SignInModal: React.FC<SignInModalProps> = ({
//     open,
//     programName,
//     onClose,
//     onSignIn,
    
// }) => (
//     <Modal open={open} onClose={onClose} disableScrollLock>
//         <Box
//             sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 bgcolor: "#fff",
//                 borderRadius: 4,
//                 p: { xs: 3.5, sm: 5 },
//                 width: { xs: "90vw", sm: 400 },
//                 outline: "none",
//                 textAlign: "center",
//                 boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
//             }}
//         >
//             <Box
//                 sx={{
//                     width: 64,
//                     height: 64,
//                     borderRadius: "50%",
//                     bgcolor: "#E8EAF6",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mx: "auto",
//                     mb: 2.5,
//                 }}
//             >
//                 <LockOutlinedIcon sx={{ color: "#1A237E", fontSize: 28 }} />
//             </Box>

//             <Typography
//                 variant="h6"
//                 sx={{
//                     fontWeight: 800,
//                     color: "#1a1a1a",
//                     mb: 1,
//                     fontSize: "1.35rem",
//                 }}
//             >
//                 Sign in to continue
//             </Typography>

//             <Typography
//                 variant="body2"
//                 sx={{ color: "text.secondary", mb: 3.5, lineHeight: 1.7 }}
//             >
//                 {programName
//                     ? `Sign in to explore the ${programName} program and access all available courses.`
//                     : "Sign in to browse the full programme catalogue and enrol in courses."}
//             </Typography>

//             <Button
//                 fullWidth
//                 onClick={onSignIn}
//                 sx={{
//                     bgcolor: "#1A237E",
//                     color: "#fff",
//                     borderRadius: 3,
//                     py: 1.4,
//                     fontWeight: 700,
//                     fontSize: "0.9rem",
//                     textTransform: "none",
//                     mb: 1.5,
//                     "&:hover": { bgcolor: "#13197a" },
//                 }}
//             >
//                 Sign In 
//             </Button>

//             <Button
//                 fullWidth
//                 onClick={onClose}
//                 sx={{
//                     color: "text.secondary",
//                     borderRadius: 3,
//                     py: 1.2,
//                     fontWeight: 500,
//                     fontSize: "0.875rem",
//                     textTransform: "none",
//                     "&:hover": { bgcolor: "#f5f5f5" },
//                 }}
//             >
//                 Maybe later
//             </Button>
//         </Box>
//     </Modal>
// );

// // ─── Thumbnail with fallback ──────────────────────────────────────────────────
// interface ThumbProps {
//     url?: string;
//     title: string;
//     index: number;
// }

// const Thumbnail: React.FC<ThumbProps> = ({ url, title, index }) => {
//     const [imgError, setImgError] = useState(false);
//     const hasValidUrl = url && url.trim() !== "";

//     // If a valid URL exists and hasn't errored, show the real image
//     if (hasValidUrl && !imgError) {
//         return (
//             <Box
//                 component="img"
//                 src={url}
//                 alt={title}
//                 onError={() => setImgError(true)}
//                 sx={{
//                     width: "100%",
//                     aspectRatio: "16/9",
//                     objectFit: "cover",
//                     display: "block",
//                 }}
//             />
//         );
//     }

//     // Gradient placeholder with initials + fallback SVG underneath
//     return (
//         <Box
//             sx={{
//                 width: "100%",
//                 aspectRatio: "16/9",
//                 background: getGradient(index),
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 position: "relative",
//                 overflow: "hidden",
//             }}
//         >
//             {/* Subtle fallback book icon as background texture */}
//             <Box
//                 component="img"
//                 src={FALLBACK_IMG}
//                 alt=""
//                 aria-hidden="true"
//                 sx={{
//                     position: "absolute",
//                     inset: 0,
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     opacity: 0.18,
//                 }}
//             />
//             <Typography
//                 sx={{
//                     fontWeight: 800,
//                     fontSize: { xs: "1.8rem", sm: "2.2rem" },
//                     color: "rgba(255,255,255,0.92)",
//                     letterSpacing: 3,
//                     position: "relative",
//                     zIndex: 1,
//                 }}
//             >
//                 {title.slice(0, 3).toUpperCase()}
//             </Typography>
//         </Box>
//     );
// };

// // ─── Constants ────────────────────────────────────────────────────────────────
// const MAX_VISIBLE = 5;

// // ─── Main component ───────────────────────────────────────────────────────────
// const Courses: React.FC = () => {
//     const navigate = useNavigate();
//     const [modalOpen, setModalOpen] = useState(false);
//     const [selectedProgram, setSelectedProgram] = useState<string | undefined>();
//     const [courses, setCourses] = useState<Course[]>([]);
//     const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number>>({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
//     const {user, logout} = useAuth();

//     useEffect(() => {
//         const fetchCourses = async () => {
//             try {
//                 setLoading(true);
//                 const res = await getAllCourses();
//                 const courseData = Array.isArray(res)
//                     ? res
//                     : (res as any).data || [];

//                 const filteredFolders = courseData.filter(
//                     (item: Course) => item.itemType === "folder"
//                 );

//                 const countEntries = await Promise.all(
//                     filteredFolders.map(async (course: Course) => {
//                         try {
//                             const data = await getEnrolledStudents(course._id);
//                             const count =
//                                 typeof data === "number"
//                                     ? data
//                                     : data?.data?.enrolledCount ?? 0;
//                             return [course._id, count] as [string, number];
//                         } catch {
//                             return [course._id, 0] as [string, number];
//                         }
//                     })
//                 );

//                 setCourses(filteredFolders);
//                 setEnrolledCounts(Object.fromEntries(countEntries));
//             } catch (err) {
//                 console.error("Error fetching courses:", err);
//                 setError(true);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCourses();
//     }, []);

//     const openSignIn = (programName?: string) => {
//         setSelectedProgram(programName);
//         setModalOpen(true);
//     };

//     const handleSignIn = () => {
//         setModalOpen(false);
//         let redirectPath = "/login"
//         if (user?.role === "admin") { 
//             redirectPath = "/admin/courses"
//         }
//         else{
//             redirectPath = "/student/courses"
//         }
//         navigate(redirectPath);
//     };

//     const visibleCourses = courses.slice(0, MAX_VISIBLE);
//     const hiddenCount = courses.length - MAX_VISIBLE;
//     const showMoreCard = hiddenCount > 0;

//     return (
//         <>
//             <Box id="courses" sx={{ py: 8, bgcolor: "#f2f4f6ca", minHeight: "50vh" }}>
//                 <Container maxWidth="lg">

//                     {/* ── Header — original style preserved ── */}
//                     <Box sx={{ mb: 5 }}>
//                         <Typography
//                             variant="overline"
//                             sx={{ color: "#1A237E", fontWeight: 700, letterSpacing: 1.2 }}
//                         >
//                             Academic Catalogue
//                         </Typography>
//                         <Typography
//                             variant="h5"
//                             sx={{ fontWeight: 800, color: "#1a1a1a", mt: 0.5 }}
//                         >
//                             Available Programs
//                         </Typography>
//                     </Box>

//                     {error && (
//                         <Alert severity="error" sx={{ mb: 4 }}>
//                             Unable to fetch program categories.
//                         </Alert>
//                     )}

//                     {/* ── Flex grid — mobile first ── */}
//                     <Box
//                         sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 3,
//                             justifyContent: "flex-start",
//                         }}
//                     >
//                         {loading ? (
//                             [1, 2, 3].map((i) => (
//                                 <Skeleton
//                                     key={i}
//                                     variant="rectangular"
//                                     sx={{
//                                         width: {
//                                             xs: "100%",
//                                             sm: "calc(50% - 12px)",
//                                             md: "calc(33.333% - 16px)",
//                                         },
//                                         height: 280,
//                                         borderRadius: 3,
//                                     }}
//                                 />
//                             ))
//                         ) : visibleCourses.length > 0 ? (
//                             <>
//                                 {visibleCourses.map((course: Course, idx: number) => (
//                                     <Card
//                                         key={course._id}
//                                         elevation={0}
//                                         sx={{
//                                             width: {
//                                                 xs: "100%",
//                                                 sm: "calc(50% - 12px)",
//                                                 md: "calc(33.333% - 16px)",
//                                             },
//                                             borderRadius: 3,
//                                             border: "1px solid #efefef",
//                                             bgcolor: "#fcfcfc",
//                                             overflow: "hidden",
//                                             transition: "0.2s",
//                                             "&:hover": {
//                                                 borderColor: "#1A237E",
//                                                 bgcolor: "#fff",
//                                                 boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                                             },
//                                         }}
//                                     >
//                                         <CardActionArea
//                                             onClick={() => openSignIn(course.title)}
//                                             sx={{
//                                                 height: "100%",
//                                                 display: "flex",
//                                                 flexDirection: "column",
//                                                 alignItems: "stretch",
//                                             }}
//                                         >
//                                             {/* Thumbnail */}
//                                             <Thumbnail
//                                                 url={course?.thumbnail?.url}
//                                                 title={course.title}
//                                                 index={idx}
//                                             />

//                                             <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>

//                                                 {/* Title row */}
//                                                 <Stack
//                                                     sx={{
//                                                         flexDirection: "row",
//                                                         alignItems: "center",
//                                                         gap: 1.5,
//                                                         mb: 2,
//                                                     }}
//                                                 >
//                                                     <FolderOpenIcon sx={{ color: "#1A237E", fontSize: 22 }} />
//                                                     <Typography
//                                                         variant="subtitle1"
//                                                         sx={{ fontWeight: 700, color: "#1a1a1a" }}
//                                                     >
//                                                         {course.title}
//                                                     </Typography>
//                                                 </Stack>

//                                                 {/* Description */}
//                                                 <Typography
//                                                     variant="body2"
//                                                     sx={{
//                                                         color: "text.secondary",
//                                                         mb: 3,
//                                                         lineHeight: 1.6,
//                                                         minHeight: "4.8em",
//                                                         display: "-webkit-box",
//                                                         WebkitLineClamp: 3,
//                                                         WebkitBoxOrient: "vertical",
//                                                         overflow: "hidden",
//                                                         flex: 1,
//                                                     }}
//                                                 >
//                                                     {course.content
//                                                         ? course.content.replace(/<[^>]*>?/gm, "")
//                                                         : "Discover this program's curriculum, structure, and career pathways by signing in."}
//                                                 </Typography>

//                                                 {/* Footer */}
//                                                 <Stack
//                                                     sx={{
//                                                         flexDirection: "row",
//                                                         alignItems: "center",
//                                                         justifyContent: "space-between",
//                                                         pt: 1,
//                                                         borderTop: "1px solid #f0f0f0",
//                                                     }}
//                                                 >
//                                                     {/* Enrolled count */}
//                                                     <Stack
//                                                         sx={{
//                                                             flexDirection: "row",
//                                                             alignItems: "center",
//                                                             gap: 0.6,
//                                                         }}
//                                                     >
//                                                         <PeopleAltOutlinedIcon
//                                                             sx={{ fontSize: 15, color: "text.disabled" }}
//                                                         />
//                                                         <Typography
//                                                             variant="caption"
//                                                             sx={{ color: "text.secondary" }}
//                                                         >
//                                                             {enrolledCounts[course._id] ?? "—"} enrolled
//                                                         </Typography>
//                                                     </Stack>

//                                                     {/* Explore CTA */}
//                                                     <Stack
//                                                         sx={{
//                                                             flexDirection: "row",
//                                                             alignItems: "center",
//                                                             gap: 0.5,
//                                                             color: "#1A237E",
//                                                         }}
//                                                     >
//                                                         <Typography
//                                                             variant="caption"
//                                                             sx={{
//                                                                 fontWeight: 700,
//                                                                 textTransform: "uppercase",
//                                                             }}
//                                                         >
//                                                             Explore
//                                                         </Typography>
//                                                         <ChevronRightIcon fontSize="small" />
//                                                     </Stack>
//                                                 </Stack>
//                                             </CardContent>
//                                         </CardActionArea>
//                                     </Card>
//                                 ))}

//                                 {/* ── More programs card ── */}
//                                 {showMoreCard && (
//                                     <Card
//                                         elevation={0}
//                                         onClick={() => openSignIn()}
//                                         sx={{
//                                             width: {
//                                                 xs: "100%",
//                                                 sm: "calc(50% - 12px)",
//                                                 md: "calc(33.333% - 16px)",
//                                             },
//                                             borderRadius: 3,
//                                             background: "linear-gradient(145deg, #1A237E 0%, #283593 100%)",
//                                             border: "none",
//                                             cursor: "pointer",
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             minHeight: 220,
//                                             p: 4,
//                                             transition: "transform 0.22s ease, box-shadow 0.22s ease",
//                                             "&:hover": {
//                                                 transform: "translateY(-4px)",
//                                                 boxShadow: "0 16px 40px rgba(26,35,126,0.25)",
//                                             },
//                                         }}
//                                     >
//                                         <Box
//                                             sx={{
//                                                 width: 56,
//                                                 height: 56,
//                                                 borderRadius: "50%",
//                                                 bgcolor: "rgba(255,255,255,0.12)",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 mb: 1.5,
//                                             }}
//                                         >
//                                             <GridViewRoundedIcon
//                                                 sx={{ color: "rgba(255,255,255,0.7)", fontSize: 26 }}
//                                             />
//                                         </Box>

//                                         <Typography
//                                             sx={{
//                                                 fontWeight: 800,
//                                                 color: "#fff",
//                                                 fontSize: "1.1rem",
//                                                 textAlign: "center",
//                                                 mb: 0.5,
//                                             }}
//                                         >
//                                             +{hiddenCount} more{" "}
//                                             {hiddenCount === 1 ? "program" : "programs"}
//                                         </Typography>

//                                         <Typography
//                                             sx={{
//                                                 fontSize: "0.8rem",
//                                                 color: "rgba(255,255,255,0.6)",
//                                                 textAlign: "center",
//                                                 lineHeight: 1.5,
//                                                 mb: 2,
//                                             }}
//                                         >
//                                             Sign in to browse the full catalogue
//                                         </Typography>

//                                         <Stack
//                                             sx={{
//                                                 flexDirection: "row",
//                                                 alignItems: "center",
//                                                 gap: 0.5,
//                                                 color: "rgba(255,255,255,0.85)",
//                                                 bgcolor: "rgba(255,255,255,0.12)",
//                                                 borderRadius: 5,
//                                                 px: 2,
//                                                 py: 0.8,
//                                             }}
//                                         >
//                                             <Typography
//                                                 sx={{
//                                                     fontSize: "0.72rem",
//                                                     fontWeight: 700,
//                                                     textTransform: "uppercase",
//                                                     letterSpacing: 1,
//                                                     color: "rgba(255,255,255,0.85)",
//                                                 }}
//                                             >
//                                                 Sign in
//                                             </Typography>
//                                             <ChevronRightIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.85)" }} />
//                                         </Stack>
//                                     </Card>
//                                 )}
//                             </>
//                         ) : (
//                             <Typography
//                                 sx={{
//                                     color: "text.secondary",
//                                     width: "100%",
//                                     textAlign: "center",
//                                     py: 5,
//                                 }}
//                             >
//                                 No folders found.
//                             </Typography>
//                         )}
//                     </Box>
//                 </Container>
//             </Box>

//             {/* ── Sign-in modal ── */}
//             <SignInModal
//                 open={modalOpen}
//                 programName={selectedProgram}
//                 onClose={() => setModalOpen(false)}
//                 onSignIn={handleSignIn}
//             />
//         </>
//     );
// };

// export default Courses;


import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Container,
    Stack,
    Breadcrumbs,
    Link,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import FunctionsIcon from "@mui/icons-material/Functions";
import type { SvgIconComponent } from "@mui/icons-material";

// ─── Icon set used for fallback thumbnails (when no real logo is set) ──────
// Board-level nodes get something that signals "institution" (globe, bank,
// cap, medal). Everything else defaults to a math symbol, since every leaf
// course here is a mathematics course — far more legible at a glance than a
// cryptic code like "P1" or "9231".
const ICONS: Record<string, SvgIconComponent> = {
    public: PublicIcon,
    bank: AccountBalanceIcon,
    school: SchoolIcon,
    award: WorkspacePremiumIcon,
    quiz: QuizOutlinedIcon,
    functions: FunctionsIcon,
};

// ─── Demo data node shape ──────────────────────────────────────────────────
// `label` is the fallback shown on the thumbnail placeholder (explicit, from
// the demo data itself — NOT auto-derived from the first 3 letters of the
// title). `logo` is a path to the board/exam's real logo — drop the actual
// files into your project's public folder (see the list at the bottom of
// this file) and the image will be used automatically; if it's missing or
// fails to load, it falls back to the gradient + label design.
interface DemoNode {
    id: string;
    title: string;
    label: string;
    icon?: keyof typeof ICONS;
    logo?: string;
    description: string;
    children?: DemoNode[];
}

// ─── Gradient palettes for thumbnail placeholders ────────────────────────────
const PLACEHOLDER_GRADIENTS = [
    "linear-gradient(135deg, #1A237E 0%, #3949AB 100%)",
    "linear-gradient(135deg, #00695C 0%, #00897B 100%)",
    "linear-gradient(135deg, #4527A0 0%, #7B1FA2 100%)",
    "linear-gradient(135deg, #B71C1C 0%, #E53935 100%)",
    "linear-gradient(135deg, #1565C0 0%, #0288D1 100%)",
    "linear-gradient(135deg, #EF6C00 0%, #FB8C00 100%)",
    "linear-gradient(135deg, #2E7D32 0%, #43A047 100%)",
];

const getGradient = (index: number) =>
    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

// ─── Demo data ─────────────────────────────────────────────────────────────
const DEMO_DATA: DemoNode[] = [
    {
        id: "ib",
        title: "IB",
        label: "IB",
        icon: "public",
        logo: "/logos/ib.svg",
        description:
            "The International Baccalaureate (IB) offers rigorous, globally recognised programmes that build strong mathematical reasoning and problem-solving skills for university and beyond.",
        children: [
            {
                id: "ib-aa",
                title: "IBDP Mathematics: Analysis and Approaches HL & SL",
                label: "AA",
                description:
                    "Focused on algebraic and analytical techniques, calculus, and proof — designed for students who enjoy the abstract, theoretical side of mathematics.",
            },
            {
                id: "ib-ai",
                title: "IBDP Mathematics: Applications and Interpretation HL & SL",
                label: "AI",
                description:
                    "Emphasises statistics, modelling, and technology-driven problem solving — ideal for students interested in real-world applications of mathematics.",
            },
            {
                id: "ib-myp",
                title: "IB MYP Extended Mathematics",
                label: "MYP",
                description:
                    "An extended pathway within the Middle Years Programme that challenges students with deeper mathematical content ahead of Diploma-level study.",
            },
            {
                id: "ib-std",
                title: "IB Standard Mathematics",
                label: "STD",
                description:
                    "A balanced foundation in core mathematical concepts, building the skills students need to progress confidently through the IB curriculum.",
            },
        ],
    },
    {
        id: "caie",
        title: "Cambridge Assessment International Education",
        label: "CAIE",
        icon: "bank",
        logo: "/logos/caie.svg",
        description:
            "Cambridge International offers globally benchmarked qualifications across AS & A Level, IGCSE, spanning pure mathematics, mechanics, and statistics.",
        children: [
            {
                id: "caie-9231",
                title: "AS & A Level Further Mathematics 9231",
                label: "9231",
                logo: "/logos/caie.svg",
                description:
                    "An advanced qualification extending beyond A Level Mathematics, covering further pure mathematics, mechanics, and probability & statistics.",
                children: [
                    {
                        id: "caie-9231-p1",
                        title: "Paper 1 Further Pure Mathematics",
                        label: "P1",
                        description: "Advanced pure mathematics techniques including complex numbers, matrices, and further calculus.",
                    },
                    {
                        id: "caie-9231-p2",
                        title: "Paper 2 Further Pure Mathematics",
                        label: "P2",
                        description: "Continues the pure mathematics strand with deeper coverage of series, differential equations, and proof.",
                    },
                    {
                        id: "caie-9231-p3",
                        title: "Paper 3 Further Mechanics",
                        label: "P3",
                        description: "Explores advanced mechanics topics such as momentum, circular motion, and rigid body dynamics.",
                    },
                    {
                        id: "caie-9231-p4",
                        title: "Paper 4 Further Probability & Statistics",
                        label: "P4",
                        description: "Builds on core statistics with advanced probability distributions and hypothesis testing.",
                    },
                ],
            },
            {
                id: "caie-9709",
                title: "AS & A-Level Mathematics 9709",
                label: "9709",
                logo: "/logos/caie.svg",
                description:
                    "One of the most widely taken Cambridge qualifications, covering pure mathematics, mechanics, and probability & statistics across six papers.",
                children: [
                    { id: "caie-9709-p1", title: "Paper 1 Pure Mathematics", label: "P1", description: "Foundational pure mathematics covering algebra, functions, and calculus." },
                    { id: "caie-9709-p2", title: "Paper 2 Pure Mathematics", label: "P2", description: "Continues pure mathematics with further calculus, trigonometry, and algebraic methods." },
                    { id: "caie-9709-p3", title: "Paper 3 Pure Mathematics", label: "P3", description: "Advanced pure mathematics including numerical methods, vectors, and differential equations." },
                    { id: "caie-9709-p4", title: "Paper 4 Mechanics", label: "P4", description: "Introduces mechanics concepts including forces, motion, and energy." },
                    { id: "caie-9709-p5", title: "Paper 5 Probability & Statistics", label: "P5", description: "Covers representation of data, probability, and discrete random variables." },
                    { id: "caie-9709-p6", title: "Paper 6 Probability & Statistics", label: "P6", description: "Extends statistical concepts with continuous distributions and hypothesis testing." },
                ],
            },
            {
                id: "caie-0606",
                title: "IGCSE Additional Mathematics 0606",
                label: "0606",
                logo: "/logos/caie.svg",
                description: "A challenging IGCSE option that bridges the gap to A Level, covering functions, trigonometry, and calculus basics.",
            },
            {
                id: "caie-0607",
                title: "IGCSE International Mathematics 0607",
                label: "0607",
                logo: "/logos/caie.svg",
                description: "An internationally focused syllabus emphasising practical application of mathematical concepts.",
            },
            {
                id: "caie-0580-ext",
                title: "IGCSE Extended Mathematics 0580-Extended",
                label: "EXT",
                logo: "/logos/caie.svg",
                description: "The extended tier of IGCSE Mathematics, covering a broader and more challenging range of topics.",
            },
            {
                id: "caie-0580-core",
                title: "IGCSE Mathematics 0580-Core",
                label: "COR",
                logo: "/logos/caie.svg",
                description: "The core tier of IGCSE Mathematics, focusing on essential mathematical skills and understanding.",
            },
        ],
    },
    {
        id: "edexcel",
        title: "Edexcel",
        label: "EDX",
        icon: "school",
        logo: "/logos/edexcel.svg",
        description:
            "Edexcel qualifications provide flexible, internationally recognised routes through advanced pure and discrete mathematics.",
        children: [
            {
                id: "edexcel-fp",
                title: "A-Level Further Pure Mathematics",
                label: "FP",
                logo: "/logos/edexcel.svg",
                description: "Deepens understanding of pure mathematics beyond the core A-Level syllabus, preparing students for STEM degrees.",
            },
            {
                id: "edexcel-dm",
                title: "A-Level Discrete Mathematics",
                label: "DM",
                logo: "/logos/edexcel.svg",
                description: "Covers algorithms, graph theory, and decision mathematics used widely in computer science and operations research.",
            },
        ],
    },
    {
        id: "ap",
        title: "Advanced Placement",
        label: "AP",
        icon: "award",
        logo: "/logos/ap.svg",
        description:
            "College Board's Advanced Placement programme lets students earn college-level credit while still in high school.",
        children: [
            { id: "ap-calc-ab", title: "AP Calculus AB", label: "AB", logo: "/logos/ap.svg", description: "An introductory college-level calculus course covering limits, derivatives, and integrals." },
            { id: "ap-calc-bc", title: "AP Calculus BC", label: "BC", logo: "/logos/ap.svg", description: "Extends AP Calculus AB with additional topics such as series and parametric equations." },
            { id: "ap-stats", title: "AP Statistics", label: "STAT", logo: "/logos/ap.svg", description: "Introduces students to the major concepts of collecting, analysing, and drawing conclusions from data." },
        ],
    },
    {
        id: "foreign-admission",
        title: "Foreign Admission Tests",
        label: "FAT",
        icon: "quiz",
        description: "Preparation for standardised admissions tests required by universities abroad.",
        children: [
            { id: "tmua", title: "TMUA", label: "TMUA", icon: "quiz", logo: "/logos/tmua.svg", description: "The Test of Mathematics for University Admission, used by several UK universities for maths and joint-honours courses." },
        ],
    },
    {
        id: "indian-admission",
        title: "Indian Admission Tests",
        label: "IAT",
        icon: "quiz",
        description: "Preparation for entrance examinations required for admission into Indian institutions.",
        children: [
            { id: "mht-cet", title: "MHT CET", label: "CET", icon: "quiz", logo: "https://mhtcet.in/logo1.svg", description: "Maharashtra's Common Entrance Test for admission into engineering and pharmacy programmes." },
        ],
    },
    {
        id: "state-engineering",
        title: "State Engineering Entrance Tests",
        label: "SEET",
        icon: "quiz",
        description: "Preparation for state and national level engineering entrance examinations.",
        children: [
            { id: "bitsat", title: "BITSAT", label: "BITS", icon: "quiz", logo: "https://engineering4india.com/images/nationallevelexam/169.jpg", description: "The Birla Institute of Technology and Science Admission Test for undergraduate engineering programmes." },
            { id: "cuet", title: "CUET", label: "CUET", icon: "quiz", logo: "https://www.maansarovarlawcentre.com/images/cuet.webp", description: "The Common University Entrance Test used for admission into central and participating universities." },
        ],
    },
];

// ─── Thumbnail ────────────────────────────────────────────────────────────
// Tries the real board/exam logo first (contained on a clean card so any
// logo aspect ratio looks right). If `logo` isn't set, or the file 404s
// (e.g. you haven't dropped the asset in yet), it falls back to a large,
// legible icon on a gradient — a symbol reads instantly, unlike a bare code
// such as "P1" or "9231". The code/label still appears, but small, in a
// corner pill, as a secondary detail rather than the headline.
interface ThumbProps {
    logo?: string;
    label: string;
    icon?: keyof typeof ICONS;
    title: string;
    index: number;
}

const Thumbnail: React.FC<ThumbProps> = ({ logo, label, icon, title, index }) => {
    const [imgError, setImgError] = useState(false);
    const hasLogo = !!logo && !imgError;

    if (hasLogo) {
        return (
            <Box
                sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    bgcolor: "#f5f6fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt={`${title} logo`}
                    onError={() => setImgError(true)}
                    sx={{
                        maxWidth: "70%",
                        maxHeight: "70%",
                        objectFit: "contain",
                    }}
                />
            </Box>
        );
    }

    const IconComp = ICONS[icon ?? "functions"];

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
            <IconComp
                sx={{
                    fontSize: { xs: 44, sm: 52 },
                    color: "rgba(255,255,255,0.9)",
                    position: "relative",
                    zIndex: 1,
                }}
            />

            {/* Secondary detail — the short code, small and tucked away */}
            <Box
                sx={{
                    position: "absolute",
                    left: 10,
                    bottom: 10,
                    bgcolor: "rgba(0,0,0,0.28)",
                    borderRadius: 1.5,
                    px: 1,
                    py: 0.3,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "rgba(255,255,255,0.9)",
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Box>
    );
};

// ─── Main component ───────────────────────────────────────────────────────
const Courses: React.FC = () => {
    // Path of node ids representing how deep we've drilled in.
    const [path, setPath] = useState<DemoNode[]>([]);

    const currentLevel: DemoNode[] = useMemo(() => {
        if (path.length === 0) return DEMO_DATA;
        return path[path.length - 1].children ?? [];
    }, [path]);

    const handleExplore = (node: DemoNode) => {
        if (node.children && node.children.length > 0) {
            setPath((prev) => [...prev, node]);
        }
    };

    const goHome = () => setPath([]);
    const goToCrumb = (index: number) => setPath((prev) => prev.slice(0, index + 1));
    const goBack = () => setPath((prev) => prev.slice(0, -1));

    const heading = path.length === 0 ? "Available Programs" : path[path.length - 1].title;

    return (
        <Box id="courses" sx={{ py: 8, bgcolor: "#f2f4f6ca", minHeight: "50vh" }}>
            <Container maxWidth="lg">
                {/* ── Header ── */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: "#1A237E", fontWeight: 700, letterSpacing: 1.2 }}
                    >
                        Academic Catalogue
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a1a1a", mt: 0.5 }}>
                        {heading}
                    </Typography>
                </Box>

                {/* ── Breadcrumbs + back ── */}
                {path.length > 0 && (
                    <Stack direction="row"  spacing={2} sx={{ mb: 3 , alignItems:"center"}}>
                        <CardActionArea
                            onClick={goBack}
                            sx={{
                                width: "auto",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.7,
                                px: 1.5,
                                py: 0.7,
                                borderRadius: 5,
                                bgcolor: "#fff",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: 13, color: "#1A237E" }} />
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#1A237E" }}>
                                Back
                            </Typography>
                        </CardActionArea>

                        <Breadcrumbs separator={<ChevronRightIcon sx={{ fontSize: 16 }} />}>
                            <Link
                                component="button"
                                underline="hover"
                                onClick={goHome}
                                sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", fontSize: "0.85rem" }}
                            >
                                <HomeOutlinedIcon sx={{ fontSize: 16 }} />
                                Programs
                            </Link>
                            {path.map((node, idx) => (
                                <Link
                                    key={node.id}
                                    component="button"
                                    underline="hover"
                                    onClick={() => goToCrumb(idx)}
                                    sx={{
                                        fontSize: "0.85rem",
                                        color: idx === path.length - 1 ? "#1A237E" : "text.secondary",
                                        fontWeight: idx === path.length - 1 ? 700 : 400,
                                    }}
                                >
                                    {node.title}
                                </Link>
                            ))}
                        </Breadcrumbs>
                    </Stack>
                )}

                {/* ── Flex grid ── */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
                    {currentLevel.length > 0 ? (
                        currentLevel.map((node, idx) => {
                            const hasChildren = !!node.children && node.children.length > 0;
                            return (
                                <Card
                                    key={node.id}
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
                                        "&:hover": hasChildren
                                            ? {
                                                  borderColor: "#1A237E",
                                                  bgcolor: "#fff",
                                                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                              }
                                            : undefined,
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleExplore(node)}
                                        disabled={!hasChildren}
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "stretch",
                                            cursor: hasChildren ? "pointer" : "default",
                                            "&.Mui-disabled": { opacity: 1 },
                                        }}
                                    >
                                        <Thumbnail logo={node.logo} label={node.label} icon={node.icon} title={node.title} index={idx} />

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
                                                {hasChildren ? (
                                                    <FolderOpenIcon sx={{ color: "#1A237E", fontSize: 22 }} />
                                                ) : (
                                                    <MenuBookOutlinedIcon sx={{ color: "#1A237E", fontSize: 22 }} />
                                                )}
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                                                    {node.title}
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
                                                {node.description}
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
                                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                                    {hasChildren
                                                        ? `${node.children!.length} ${node.children!.length === 1 ? "item" : "items"}`
                                                        : "Individual course"}
                                                </Typography>

                                                {hasChildren && (
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
                                                            sx={{ fontWeight: 700, textTransform: "uppercase" }}
                                                        >
                                                            Explore
                                                        </Typography>
                                                        <ChevronRightIcon fontSize="small" />
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            );
                        })
                    ) : (
                        <Typography sx={{ color: "text.secondary", width: "100%", textAlign: "center", py: 5 }}>
                            No courses found.
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Courses;

/*
 * ── Logos ──────────────────────────────────────────────────────────────
 * Drop the following files into your project's `public/logos/` folder
 * (download each board's official logo from their own site/press kit —
 * avoid hotlinking from random third-party sites, they're unreliable and
 * often not licensed for reuse). Until a file exists, that card just shows
 * the gradient + short-label placeholder, so nothing breaks in the meantime.
 *
 *   /logos/ib.svg        → ibo.org press/brand page
 *   /logos/caie.svg      → cambridgeinternational.org (used for CAIE + all
 *                          its 9231 / 9709 / IGCSE courses)
 *   /logos/edexcel.svg   → qualifications.pearson.com (Edexcel branding)
 *   /logos/ap.svg        → apcentral.collegeboard.org (AP logo)
 *   /logos/tmua.svg      → tmua.org
 *   /logos/mht-cet.svg   → cetcell.mahacet.org
 *   /logos/bitsat.svg    → bitsadmission.com
 *   /logos/cuet.svg      → cuet.nta.nic.in
 *
 * SVG is preferred (crisp at any size), PNG with a transparent background
 * works too. Any aspect ratio is fine — the thumbnail contains it rather
 * than stretching it.
 */