import React from "react";
import { 
    Box, Typography, Skeleton, Alert, Card, 
    CardContent, CardActionArea, Container, Stack 
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "..";
import { getAllCourses, getEnrolledStudents } from "../api";

const Courses: React.FC = () => {
    const { data: { courses, enrolledCounts } = { courses: [], enrolledCounts: {} }, isLoading: loading, error } = useQuery({
        queryKey: ['landingCourses'],
        queryFn: async () => {
            const res = await getAllCourses();
            const courseData = Array.isArray(res) ? res : (res as any).data || [];

            // Filtering: Only show active folders
            const filteredFolders = courseData.filter(
                (item: Course) => item.itemType === "folder"
            );

            // Fetch enrolled counts for all folders in parallel
            const countEntries = await Promise.all(
                filteredFolders.map(async (course: Course) => {
                    try {
                        const data = await getEnrolledStudents(course._id);
                        // Support both { count: number } and a plain number response
                        const count = typeof data === "number" ? data : data?.data?.enrolledCount ?? 0;
                        return [course._id, count] as [string, number];
                    } catch {
                        return [course._id, 0] as [string, number];
                    }
                })
            );
            
            return {
                courses: filteredFolders,
                enrolledCounts: Object.fromEntries(countEntries)
            };
        }
    });

    return (
        <Box sx={{ py: 8, bgcolor: "#f2f4f6ca", minHeight: "50vh" }}>
            <Container maxWidth="lg">
                {/* --- Clean, Smaller Heading --- */}
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

                {error && <Alert severity="error" sx={{ mb: 4 }}>Unable to fetch program categories.</Alert>}

                {/* --- Flex Container --- */}
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: 3,
                        justifyContent: "flex-start" 
                    }}
                >
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <Skeleton 
                                key={i} 
                                variant="rectangular" 
                                sx={{ 
                                    width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" }, 
                                    height: 220, 
                                    borderRadius: 3 
                                }} 
                            />
                        ))
                    ) : courses.length > 0 ? (
                        courses.map((course: Course) => (
                            <Card 
                                key={course._id}
                                elevation={0}
                                sx={{ 
                                    width: { 
                                        xs: "100%", 
                                        sm: "calc(50% - 12px)", 
                                        md: "calc(33.333% - 16px)" 
                                    },
                                    borderRadius: 3,
                                    border: "1px solid #efefef",
                                    bgcolor: "#fcfcfc",
                                    transition: "0.2s",
                                    "&:hover": {
                                        borderColor: "#1A237E",
                                        bgcolor: "#fff",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
                                    }
                                }}
                            >
                                <CardActionArea sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1.5, mb: 2 }}>
                                            <FolderOpenIcon sx={{ color: "#1A237E", fontSize: 22 }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                                                {course.title}
                                            </Typography>
                                        </Stack>

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
                                                overflow: "hidden"
                                            }}
                                        >
                                            {course.content.replace(/<[^>]*>?/gm, "")}
                                        </Typography>

                                        <Stack 
                                            sx={{ 
                                                flexDirection: "row", 
                                                alignItems: "center", 
                                                justifyContent: "space-between",
                                                pt: 1,
                                                borderTop: "1px solid #f0f0f0"
                                            }}
                                        >
                                            {/* Enrolled count badge */}
                                            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.6 }}>
                                                <PeopleAltOutlinedIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                                    {enrolledCounts[course._id] ?? "—"} enrolled
                                                </Typography>
                                            </Stack>

                                            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 0.5, color: "#1A237E" }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                                    Explore
                                                </Typography>
                                                <ChevronRightIcon fontSize="small" />
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
                    ) : (
                        <Typography sx={{ color: "text.secondary", width: "100%", textAlign: "center", py: 5 }}>
                            No folders found.
                        </Typography>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Courses;
