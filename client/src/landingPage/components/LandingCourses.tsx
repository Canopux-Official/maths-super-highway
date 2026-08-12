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
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import FunctionsIcon from "@mui/icons-material/Functions";
import type { SvgIconComponent } from "@mui/icons-material";

const ICONS: Record<string, SvgIconComponent> = {
    public: PublicIcon,
    bank: AccountBalanceIcon,
    school: SchoolIcon,
    award: WorkspacePremiumIcon,
    quiz: QuizOutlinedIcon,
    functions: FunctionsIcon,
};

interface DemoNode {
    id: string;
    title: string;
    label: string;
    icon?: keyof typeof ICONS;
    logo?: string;
    description: string;
    children?: DemoNode[];
}

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

const DEMO_DATA: DemoNode[] = [
    {
        id: "ib",
        title: "IB",
        label: "IB",
        icon: "public",
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
        description:
            "Cambridge International offers globally benchmarked qualifications across AS & A Level, IGCSE, spanning pure mathematics, mechanics, and statistics.",
        children: [
            {
                id: "caie-9231",
                title: "AS & A Level Further Mathematics 9231",
                label: "9231",
                description:
                    "An advanced qualification extending beyond A Level Mathematics, covering further pure mathematics, mechanics, and probability & statistics.",
                children: [
                    {
                        id: "caie-9231-p1",
                        title: "Paper 1 Further Pure Mathematics",
                        label: "P1",
                        description:
                            "Advanced pure mathematics techniques including complex numbers, matrices, and further calculus.",
                    },
                    {
                        id: "caie-9231-p2",
                        title: "Paper 2 Further Pure Mathematics",
                        label: "P2",
                        description:
                            "Continues the pure mathematics strand with deeper coverage of series, differential equations, and proof.",
                    },
                    {
                        id: "caie-9231-p3",
                        title: "Paper 3 Further Mechanics",
                        label: "P3",
                        description:
                            "Explores advanced mechanics topics such as momentum, circular motion, and rigid body dynamics.",
                    },
                    {
                        id: "caie-9231-p4",
                        title: "Paper 4 Further Probability & Statistics",
                        label: "P4",
                        description:
                            "Builds on core statistics with advanced probability distributions and hypothesis testing.",
                    },
                ],
            },
            {
                id: "caie-9709",
                title: "AS & A-Level Mathematics 9709",
                label: "9709",
                description:
                    "One of the most widely taken Cambridge qualifications, covering pure mathematics, mechanics, and probability & statistics across six papers.",
                children: [
                    {
                        id: "caie-9709-p1",
                        title: "Paper 1 Pure Mathematics",
                        label: "P1",
                        description:
                            "Foundational pure mathematics covering algebra, functions, and calculus.",
                    },
                    {
                        id: "caie-9709-p2",
                        title: "Paper 2 Pure Mathematics",
                        label: "P2",
                        description:
                            "Continues pure mathematics with further calculus, trigonometry, and algebraic methods.",
                    },
                    {
                        id: "caie-9709-p3",
                        title: "Paper 3 Pure Mathematics",
                        label: "P3",
                        description:
                            "Advanced pure mathematics including numerical methods, vectors, and differential equations.",
                    },
                    {
                        id: "caie-9709-p4",
                        title: "Paper 4 Mechanics",
                        label: "P4",
                        description:
                            "Introduces mechanics concepts including forces, motion, and energy.",
                    },
                    {
                        id: "caie-9709-p5",
                        title: "Paper 5 Probability & Statistics",
                        label: "P5",
                        description:
                            "Covers representation of data, probability, and discrete random variables.",
                    },
                    {
                        id: "caie-9709-p6",
                        title: "Paper 6 Probability & Statistics",
                        label: "P6",
                        description:
                            "Extends statistical concepts with continuous distributions and hypothesis testing.",
                    },
                ],
            },
            {
                id: "caie-0606",
                title: "IGCSE Additional Mathematics 0606",
                label: "0606",
                description:
                    "A challenging IGCSE option that bridges the gap to A Level, covering functions, trigonometry, and calculus basics.",
            },
            {
                id: "caie-0607",
                title: "IGCSE International Mathematics 0607",
                label: "0607",
                description:
                    "An internationally focused syllabus emphasising practical application of mathematical concepts.",
            },
            {
                id: "caie-0580-ext",
                title: "IGCSE Extended Mathematics 0580-Extended",
                label: "EXT",
                description:
                    "The extended tier of IGCSE Mathematics, covering a broader and more challenging range of topics.",
            },
            {
                id: "caie-0580-core",
                title: "IGCSE Mathematics 0580-Core",
                label: "COR",
                description:
                    "The core tier of IGCSE Mathematics, focusing on essential mathematical skills and understanding.",
            },
        ],
    },
    {
        id: "edexcel",
        title: "Edexcel",
        label: "EDX",
        icon: "school",
        description:
            "Edexcel qualifications provide flexible, internationally recognised routes through advanced pure and discrete mathematics.",
        children: [
            {
                id: "edexcel-fp",
                title: "A-Level Further Pure Mathematics",
                label: "FP",
                description:
                    "Deepens understanding of pure mathematics beyond the core A-Level syllabus, preparing students for STEM degrees.",
            },
            {
                id: "edexcel-dm",
                title: "A-Level Discrete Mathematics",
                label: "DM",
                description:
                    "Covers algorithms, graph theory, and decision mathematics used widely in computer science and operations research.",
            },
        ],
    },
    {
        id: "ap",
        title: "Advanced Placement",
        label: "AP",
        icon: "award",
        description:
            "College Board's Advanced Placement programme lets students earn college-level credit while still in high school.",
        children: [
            {
                id: "ap-calc-ab",
                title: "AP Calculus AB",
                label: "AB",
                description:
                    "An introductory college-level calculus course covering limits, derivatives, and integrals.",
            },
            {
                id: "ap-calc-bc",
                title: "AP Calculus BC",
                label: "BC",
                description:
                    "Extends AP Calculus AB with additional topics such as series and parametric equations.",
            },
            {
                id: "ap-stats",
                title: "AP Statistics",
                label: "STAT",
                description:
                    "Introduces students to the major concepts of collecting, analysing, and drawing conclusions from data.",
            },
        ],
    },
    {
        id: "foreign-admission",
        title: "Foreign Admission Tests",
        label: "FAT",
        icon: "quiz",
        description:
            "Preparation for standardised admissions tests required by universities abroad.",
        children: [
            {
                id: "tmua",
                title: "TMUA",
                label: "TMUA",
                icon: "quiz",
                description:
                    "The Test of Mathematics for University Admission, used by several UK universities for maths and joint-honours courses.",
            },
        ],
    },
    {
        id: "indian-admission",
        title: "Indian Admission Tests",
        label: "IAT",
        icon: "quiz",
        description:
            "Preparation for entrance examinations required for admission into Indian institutions.",
        children: [
            {
                id: "mht-cet",
                title: "MHT CET",
                label: "CET",
                icon: "quiz",
                description:
                    "Maharashtra's Common Entrance Test for admission into engineering and pharmacy programmes.",
            },
        ],
    },
    {
        id: "state-engineering",
        title: "State Engineering Entrance Tests",
        label: "SEET",
        icon: "quiz",
        description:
            "Preparation for state and national level engineering entrance examinations.",
        children: [
            {
                id: "bitsat",
                title: "BITSAT",
                label: "BITS",
                icon: "quiz",
                description:
                    "The Birla Institute of Technology and Science Admission Test for undergraduate engineering programmes.",
            },
            {
                id: "cuet",
                title: "CUET",
                label: "CUET",
                icon: "quiz",
                description:
                    "The Common University Entrance Test used for admission into central and participating universities.",
            },
        ],
    },
];

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
    const [path, setPath] = useState<DemoNode[]>([]);
    // const skipScrollOnMount = useRef(true);

    const currentLevel: DemoNode[] = useMemo(() => {
        if (path.length === 0) return DEMO_DATA;
        return path[path.length - 1].children ?? [];
    }, [path]);

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

    const handleExplore = (node: DemoNode) => {
        if (node.children && node.children.length > 0) {
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
            : path[path.length - 1].description;

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
                            label={`${DEMO_DATA.length} programmes`}
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
                                    key={node.id}
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
                    {currentLevel.length > 0 ? (
                        currentLevel.map((node, idx) => {
                            const hasChildren = !!node.children && node.children.length > 0;
                            return (
                                <Box
                                    key={node.id}
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
                                        <Thumbnail cover={getGeneralCover(idx)} index={idx} />
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
                                                mb: hasChildren ? 1.5 : 0,
                                            }}
                                        >
                                            {node.description}
                                        </Typography>

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
                            No courses found.
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Courses;
