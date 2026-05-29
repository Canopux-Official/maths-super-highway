

// import React from "react";
// import { Box, Typography, Card, CardActionArea, CardContent } from "@mui/material";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import ArticleIcon from "@mui/icons-material/Article";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// interface CourseItem {
//   _id: string;
//   title: string;
//   itemType: "folder" | "page";
//   content: string;
// }

// interface Props {
//   item: CourseItem;
//   onClick: () => void;
// }

// const CourseItemCard: React.FC<Props> = ({ item, onClick }) => {
//   const isFolder = item.itemType === "folder";

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         width: {
//           xs: "100%",
//           sm: "calc(50% - 12px)",
//           md: "calc(33.333% - 16px)",
//         },
//         borderRadius: 3,
//         border: "1px solid #efefef",
//         bgcolor: "#fcfcfc",
//         transition: "0.2s",
//         "&:hover": {
//           borderColor: "#1A237E",
//           bgcolor: "#fff",
//           boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//         },
//       }}
//     >
//       <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
//         <CardContent sx={{ p: 3 }}>
//           {/* Icon + Title Row */}
//           {/* Icon + Title Row */}
//           <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, mb: 1.5 }}>
//             <Box
//               sx={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 bgcolor: isFolder ? "#E8EAF6" : "#E8F5E9",
//                 flexShrink: 0,
//               }}
//             >
//               {isFolder ? (
//                 <FolderOpenIcon sx={{ fontSize: 20, color: "#1A237E" }} />
//               ) : (
//                 <ArticleIcon sx={{ fontSize: 20, color: "#2E7D32" }} />
//               )}
//             </Box>
//             <Typography
//               variant="subtitle2"
//               sx={{ fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}
//             >
//               {item.title}
//             </Typography>
//           </Box>

//           {/* Static hint message */}
//           <Box sx={{ minHeight: 48, mb: 2 }}>
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "text.secondary",
//                 lineHeight: 1.5,
//                 display: "-webkit-box",
//                 WebkitLineClamp: 2,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//               }}
//             >
//               {isFolder
//                 ? (item.content || "Explore this module's lessons.")
//                 : "Click to view lesson details"}
//             </Typography>
//           </Box>

//           {/* Footer CTA */}
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//               pt: 1,
//               borderTop: "1px solid #f0f0f0",
//               color: "#1A237E",
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
//             >
//               {isFolder ? "Open folder" : "View lesson"}
//             </Typography>
//             <ChevronRightIcon fontSize="small" />
//           </Box>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// };

// export default CourseItemCard;


import React from "react";
import { Box, Typography, Card, CardActionArea, CardContent, Skeleton } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

interface CourseItem {
  _id: string;
  title: string;
  itemType: "folder" | "page";
  content: string;
}

interface Props {
  item: CourseItem;
  onClick: () => void;
  enrolledCount?: number | null; // null = loading, undefined = not fetched
}

const CourseItemCard: React.FC<Props> = ({ item, onClick, enrolledCount }) => {
  const isFolder = item.itemType === "folder";

  return (
    <Card
      elevation={0}
      sx={{
        width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
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
          {/* Icon + Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "center",
                bgcolor: isFolder ? "#E8EAF6" : "#E8F5E9",
                flexShrink: 0,
              }}
            >
              {isFolder
                ? <FolderOpenIcon sx={{ fontSize: 20, color: "#1A237E" }} />
                : <ArticleIcon sx={{ fontSize: 20, color: "#2E7D32" }} />}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>
              {item.title}
            </Typography>
          </Box>

          {/* Description */}
          <Box sx={{ minHeight: 40, mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary", lineHeight: 1.5,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}
            >
              {isFolder ? (item.content || "Explore this module's lessons.") : "Click to view lesson details"}
            </Typography>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              pt: 1.5, borderTop: "1px solid #f0f0f0",
            }}
          >
            {/* ── Enrolled badge ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 14, color: isFolder ? "#5C6BC0" : "#43A047" }} />
              {enrolledCount === null ? (
                <Skeleton width={32} height={14} sx={{ borderRadius: 1 }} />
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700, fontSize: "0.7rem",
                    color: isFolder ? "#5C6BC0" : "#43A047",
                  }}
                >
                  {enrolledCount ?? 0} student{enrolledCount !== 1 ? "s" : ""}
                </Typography>
              )}
            </Box>

            {/* CTA */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, color: "#1A237E" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.68rem" }}>
                {isFolder ? "Open folder" : "View lesson"}
              </Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseItemCard;