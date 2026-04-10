// import React from "react";
// import { Box, Typography, Paper } from "@mui/material";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ArticleIcon from "@mui/icons-material/Article";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// interface CourseItem {
//   _id: string;
//   title: string;
//   itemType: "folder" | "page";
//   content?: string; // Added content field
// }

// interface Props {
//   item: CourseItem;
//   onClick: () => void;
// }

// const CourseItemCard: React.FC<Props> = ({ item, onClick }) => {
//   const isFolder = item.itemType === "folder";

//   return (
//     <Paper
//       onClick={onClick}
//       elevation={0}
//       sx={{
//         display: "flex",
//         alignItems: "flex-start", // Changed from 'center' to handle multi-line text better
//         gap: 2,
//         p: 2,
//         border: "1px solid",
//         borderColor: "divider",
//         borderRadius: 2, // Slightly rounder for a modern look
//         cursor: "pointer",
//         transition: "all 0.2s ease-in-out",
//         userSelect: "none",
//         "&:hover": {
//           borderColor: "primary.main",
//           bgcolor: "rgba(25, 118, 210, 0.02)",
//           transform: "translateY(-2px)", // Subtle lift effect
//           boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//         },
//       }}
//     >
//       {/* Icon Container */}
//       <Box
//         sx={{
//           width: 44,
//           height: 44,
//           borderRadius: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           bgcolor: isFolder ? "primary.50" : "success.50",
//           color: isFolder ? "primary.main" : "success.main",
//           flexShrink: 0,
//           mt: 0.5, // Alignment adjustment for 'flex-start'
//         }}
//       >
//         {isFolder ? (
//           <FolderOpenIcon sx={{ fontSize: 22 }} />
//         ) : (
//           <ArticleIcon sx={{ fontSize: 22 }} />
//         )}
//       </Box>

//       {/* Text Content */}
//       <Box sx={{ flex: 1, minWidth: 0 }}>
//         <Typography
//           variant="subtitle2"
//           sx={{
//             fontWeight: 600,
//             color: "text.primary",
//             lineHeight: 1.2,
//             mb: 0.5,
//           }}
//         >
//           {item.title}
//         </Typography>

//         {/* Description / Content logic */}
//         <Typography
//           variant="caption"
//           sx={{
//             color: "text.secondary",
//             display: "-webkit-box",
//             WebkitLineClamp: 2, // Show up to 2 lines
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//             lineHeight: 1.4,
//           }}
//         >
//           {isFolder 
//             ? (item.content || "Explore this module's lessons.") 
//             : "Click to view lesson materials."}
//         </Typography>
//       </Box>

//       {/* Action Indicator */}
//       <Box sx={{ alignSelf: "center", ml: 1 }}>
//         <ChevronRightIcon sx={{ fontSize: 20, color: "text.disabled" }} />
//       </Box>
//     </Paper>
//   );
// };

// export default CourseItemCard;

import React from "react";
import { Box, Typography, Card, CardActionArea, CardContent, Stack } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CourseItem {
  _id: string;
  title: string;
  itemType: "folder" | "page";
  content: string;
}

interface Props {
  item: CourseItem;
  onClick: () => void;
}

const CourseItemCard: React.FC<Props> = ({ item, onClick }) => {
  const isFolder = item.itemType === "folder";

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
        bgcolor: "#fcfcfc",
        transition: "0.2s",
        "&:hover": {
          borderColor: "#1A237E",
          bgcolor: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          {/* Icon + Title Row */}
          {/* Icon + Title Row */}
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isFolder ? "#E8EAF6" : "#E8F5E9",
                flexShrink: 0,
              }}
            >
              {isFolder ? (
                <FolderOpenIcon sx={{ fontSize: 20, color: "#1A237E" }} />
              ) : (
                <ArticleIcon sx={{ fontSize: 20, color: "#2E7D32" }} />
              )}
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}
            >
              {item.title}
            </Typography>
          </Box>

          {/* Static hint message */}
          <Box sx={{ minHeight: 48, mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {isFolder
                ? (item.content || "Explore this module's lessons.")
                : "Click to view lesson details"}
            </Typography>
          </Box>

          {/* Footer CTA */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 1,
              borderTop: "1px solid #f0f0f0",
              color: "#1A237E",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              {isFolder ? "Open folder" : "View lesson"}
            </Typography>
            <ChevronRightIcon fontSize="small" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseItemCard;