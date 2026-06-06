
// import React from "react";
// import { Box, Typography, Card, CardActionArea, CardContent, CardMedia, Skeleton } from "@mui/material";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ArticleIcon from "@mui/icons-material/Article";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

// interface CourseItem {
//   _id: string;
//   title: string;
//   itemType: "folder" | "page";
//   content: string;
//   thumbnail?: {
//     url: string;
//     publicId: string;
//   };
// }

// interface Props {
//   item: CourseItem;
//   onClick: () => void;
//   enrolledCount?: number | null; // null = loading, undefined = not fetched
// }

// const CourseItemCard: React.FC<Props> = ({ item, onClick, enrolledCount }) => {
//   const isFolder = item.itemType === "folder";
  
//   const imageSrc = item.thumbnail?.url || 
//     `https://t4.ftcdn.net/jpg/20/14/87/43/360_F_2014874393_yy2jeLz244nekANKGAmKCzAX5ENeOxPs.jpg`;

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
//         // Mobile is auto height to fit both blocks; Desktop stays locked at 240px for stacked overlays
//         height: { xs: "auto", sm: 240 }, 
//         borderRadius: 3,
//         border: "1px solid #efefef",
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: "#fcfcfc", 
//         transition: "all 0.3s ease-in-out",
//         "&:hover": {
//           borderColor: isFolder ? "#1A237E" : "#2E7D32",
//           boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
//           // Only trigger hover opacity changes on desktop monitors
//           "& .thumbnail-bg": { 
//             opacity: { xs: 1, sm: 0.12 }, 
//             transform: { xs: "none", sm: "scale(1.05)" }
//           },
//           "& .hover-text-content": { 
//             opacity: 1, 
//             transform: "translateY(0px)" 
//           }
//         },
//       }}
//     >
//       <CardActionArea onClick={onClick} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        
//         {/* ── IMAGE BACKGROUND LAYER ── */}
//         <CardMedia
//           component="img"
//           image={imageSrc}
//           alt={item.title}
//           className="thumbnail-bg"
//           sx={{
//             // Mobile: sits natively at the top of the card. Desktop: absolute background layer
//             position: { xs: "relative", sm: "absolute" },
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: { xs: 130, sm: "100%" }, // Fixed visible height on mobile devices
//             objectFit: "cover",
//             zIndex: 1,
//             opacity: 1,
//             transition: "opacity 0.35s ease-in-out, transform 0.4s ease-in-out",
//           }}
//         />

//         {/* ── TEXT CONTENT LAYER ── */}
//         <CardContent 
//           className="hover-text-content"
//           sx={{ 
//             // Mobile: stacks normally below the image. Desktop: absolute overlaid container
//             position: { xs: "relative", sm: "absolute" },
//             top: { xs: "auto", sm: 0 },
//             left: { xs: "auto", sm: 0 },
//             width: "100%",
//             height: { xs: "auto", sm: "100%" },
//             zIndex: 2,
//             p: 3,
//             boxSizing: "border-box",
//             display: "flex", 
//             flexDirection: "column",
//             justifyContent: "space-between",
//             // Mobile: always fully visible on solid white background. Desktop: hidden until hover
//             opacity: { xs: 1, sm: 0 }, 
//             transform: { xs: "none", sm: "translateY(10px)" },
//             bgcolor: { xs: "#ffffff", sm: "transparent" },
//             borderTop: { xs: "1px solid #f5f5f5", sm: "none" },
//             transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
//           }}
//         >
//           {/* Top Block: Title and Description */}
//           <Box>
//             {/* Icon + Title */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.5 }}>
//               <Box
//                 sx={{
//                   width: 28, height: 28, borderRadius: 1.2,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   bgcolor: isFolder ? "#1A237E" : "#2E7D32",
//                   flexShrink: 0,
//                 }}
//               >
//                 {isFolder ? (
//                   <FolderOpenIcon sx={{ fontSize: 15, color: "#fff" }} />
//                 ) : (
//                   <ArticleIcon sx={{ fontSize: 15, color: "#fff" }} />
//                 )}
//               </Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#121212", lineHeight: 1.2 }}>
//                 {item.title}
//               </Typography>
//             </Box>

//             {/* Description */}
//             <Typography
//               variant="body2"
//               sx={{
//                 color: "#424242", 
//                 fontWeight: 500,
//                 lineHeight: 1.5,
//                 display: "-webkit-box", WebkitLineClamp: { xs: 2, sm: 4 }, // Shorter clamp for clean mobile balance
//                 WebkitBoxOrient: "vertical", overflow: "hidden",
//               }}
//             >
//               {isFolder ? (item.content || "Explore this module's lessons.") : "Click to view lesson details"}
//             </Typography>
//           </Box>

//           {/* Bottom Block: Footer Badges */}
//           <Box
//             sx={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               pt: 1.5, 
//               borderTop: "1px solid rgba(0, 0, 0, 0.08)",
//               mt: { xs: 2, sm: 0 } // Extra margin for spacing on mobile viewports
//             }}
//           >
//             {/* Enrolled Badge */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
//               <PeopleAltOutlinedIcon sx={{ fontSize: 16, color: isFolder ? "#1A237E" : "#2E7D32" }} />
//               {enrolledCount === null ? (
//                 <Skeleton width={32} height={14} sx={{ borderRadius: 0.5 }} />
//               ) : (
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     fontWeight: 700, fontSize: "0.75rem",
//                     color: isFolder ? "#1A237E" : "#2E7D32",
//                   }}
//                 >
//                   {enrolledCount ?? 0} Student{enrolledCount !== 1 ? "s" : ""}
//                 </Typography>
//               )}
//             </Box>

//             {/* CTA Action Tag */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 0.2, color: isFolder ? "#1A237E" : "#2E7D32" }}>
//               <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.7rem" }}>
//                 {isFolder ? "Open" : "View"}
//               </Typography>
//               <ChevronRightIcon fontSize="small" />
//             </Box>
//           </Box>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// };

// export default CourseItemCard;


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

// ─── Fallback SVG data URI (same as landing Courses) ─────────────────────────
const FALLBACK_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23E8EAF6'/%3E%3Crect x='155' y='62' width='90' height='110' rx='6' fill='%231A237E' opacity='.15'/%3E%3Crect x='165' y='55' width='90' height='110' rx='6' fill='%231A237E' opacity='.25'/%3E%3Crect x='175' y='48' width='90' height='110' rx='6' fill='%231A237E' opacity='.45'/%3E%3Cline x1='190' y1='75' x2='250' y2='75' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='90' x2='250' y2='90' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3Cline x1='190' y1='105' x2='230' y2='105' stroke='white' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

// ─── Gradient palettes (same as landing Courses) ──────────────────────────────
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
    index?: number; // for gradient cycling
}

// ─── Thumbnail with fallback (same logic as landing Courses) ──────────────────
interface ThumbProps {
    url?: string;
    title: string;
    index: number;
    isFolder: boolean;
}

const Thumbnail: React.FC<ThumbProps> = ({ url, title, index, isFolder }) => {
    const [imgError, setImgError] = useState(false);
    const hasValidUrl = url && url.trim() !== "";

    if (hasValidUrl && !imgError) {
        return (
            <Box
                component="img"
                src={url}
                alt={title}
                onError={() => setImgError(true)}
                className="thumbnail-bg"
                sx={{
                    position: { xs: "relative", sm: "absolute" },
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: { xs: 130, sm: "100%" },
                    objectFit: "cover",
                    zIndex: 1,
                    opacity: 1,
                    display: "block",
                    transition: "opacity 0.35s ease-in-out, transform 0.4s ease-in-out",
                }}
            />
        );
    }

    // Gradient + subtle fallback SVG + initials
    return (
        <Box
            className="thumbnail-bg"
            sx={{
                position: { xs: "relative", sm: "absolute" },
                top: 0,
                left: 0,
                width: "100%",
                height: { xs: 130, sm: "100%" },
                background: getGradient(index),
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transition: "opacity 0.35s ease-in-out, transform 0.4s ease-in-out",
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
                    fontSize: { xs: "1.6rem", sm: "2rem" },
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
                height: { xs: "auto", sm: 240 },
                borderRadius: 3,
                border: "1px solid #efefef",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#fcfcfc",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    borderColor: accentColor,
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    "& .thumbnail-bg": {
                        opacity: { xs: 1, sm: 0.12 },
                        transform: { xs: "none", sm: "scale(1.05)" },
                    },
                    "& .hover-text-content": {
                        opacity: 1,
                        transform: "translateY(0px)",
                    },
                },
            }}
        >
            <CardActionArea
                onClick={onClick}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                {/* ── Thumbnail ── */}
                <Thumbnail
                    url={item.thumbnail?.url}
                    title={item.title}
                    index={index}
                    isFolder={isFolder}
                />

                {/* ── Text content layer ── */}
                <CardContent
                    className="hover-text-content"
                    sx={{
                        position: { xs: "relative", sm: "absolute" },
                        top: { xs: "auto", sm: 0 },
                        left: { xs: "auto", sm: 0 },
                        width: "100%",
                        height: { xs: "auto", sm: "100%" },
                        zIndex: 2,
                        p: 3,
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        opacity: { xs: 1, sm: 0 },
                        transform: { xs: "none", sm: "translateY(10px)" },
                        bgcolor: { xs: "#ffffff", sm: "transparent" },
                        borderTop: { xs: "1px solid #f5f5f5", sm: "none" },
                        transition:
                            "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                    }}
                >
                    {/* Top: icon + title + description */}
                    <Box>
                        <Stack
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1.2,
                                mb: 1.5,
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
                                color: "#424242",
                                fontWeight: 500,
                                lineHeight: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: { xs: 2, sm: 4 },
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
                            borderTop: "1px solid rgba(0,0,0,0.08)",
                            mt: { xs: 2, sm: 0 },
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