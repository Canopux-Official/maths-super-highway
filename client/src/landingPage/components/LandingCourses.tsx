import React, { useEffect, useState } from "react";
import { 
    Box, Typography, Skeleton, Alert, Card, 
    CardContent, CardActionArea, Container, Stack 
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Course } from "..";
import { getAllCourses } from "../api";

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllCourses()
            .then((res: any) => {
                const courseData = Array.isArray(res) ? res : res.data || [];
                
                // Filtering: Only show active folders
                const filteredFolders = courseData.filter(
                    (item: Course) => item.itemType === "folder"
                );
                setCourses(filteredFolders);
            })
            .catch(() => setError("Unable to fetch program categories."))
            .finally(() => setLoading(false));
    }, []);

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

                {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

                {/* --- Flex Container (Alternative to Grid) --- */}
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: 3, // Spacing between cards
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
                        courses.map((course) => (
                            <Card 
                                key={course._id}
                                elevation={0}
                                sx={{ 
                                    // Logic for 3 per row: 100% / 3 minus gap adjustment
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
                                                minHeight: "4.8em", // Ensures height consistency
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}
                                        >
                                            {course.content}
                                        </Typography>

                                        <Stack 
                                            sx={{ 
                                                flexDirection: "row", 
                                                alignItems: "center", 
                                                justifyContent: "space-between",
                                                color: "#1A237E",
                                                pt: 1,
                                                borderTop: "1px solid #f0f0f0"
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                                                Explore
                                            </Typography>
                                            <ChevronRightIcon fontSize="small" />
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