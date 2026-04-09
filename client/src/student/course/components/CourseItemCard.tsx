import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CourseItem {
  _id: string;
  title: string;
  itemType: "folder" | "page";
  content?: string; // Added content field
}

interface Props {
  item: CourseItem;
  onClick: () => void;
}

const CourseItemCard: React.FC<Props> = ({ item, onClick }) => {
  const isFolder = item.itemType === "folder";

  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "flex-start", // Changed from 'center' to handle multi-line text better
        gap: 2,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2, // Slightly rounder for a modern look
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        userSelect: "none",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: "rgba(25, 118, 210, 0.02)",
          transform: "translateY(-2px)", // Subtle lift effect
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isFolder ? "primary.50" : "success.50",
          color: isFolder ? "primary.main" : "success.main",
          flexShrink: 0,
          mt: 0.5, // Alignment adjustment for 'flex-start'
        }}
      >
        {isFolder ? (
          <FolderOpenIcon sx={{ fontSize: 22 }} />
        ) : (
          <ArticleIcon sx={{ fontSize: 22 }} />
        )}
      </Box>

      {/* Text Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {item.title}
        </Typography>

        {/* Description / Content logic */}
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Show up to 2 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          {isFolder 
            ? (item.content || "Explore this module's lessons.") 
            : "Click to view lesson materials."}
        </Typography>
      </Box>

      {/* Action Indicator */}
      <Box sx={{ alignSelf: "center", ml: 1 }}>
        <ChevronRightIcon sx={{ fontSize: 20, color: "text.disabled" }} />
      </Box>
    </Paper>
  );
};

export default CourseItemCard;