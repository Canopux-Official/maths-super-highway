import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Avatar, Rating, Alert } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import type { Testimonial } from "..";
import { getLandingPageTestimonials } from "../api";

const TestimonialCard: React.FC<{ t: Testimonial }> = ({ t }) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        width: { xs: 290, sm: 320 },
        bgcolor: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 3,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <FormatQuoteIcon sx={{ color: "red", fontSize: 28, opacity: 0.8 }} />
      <Typography
        variant="body2"
        sx={{
          color: "#000",
          lineHeight: 1.8,
          fontStyle: "italic",
          flexGrow: 1,
          fontSize: "0.88rem",
        }}
      >
        "{t.message}"
      </Typography>
      <Rating
        value={t.rating}
        readOnly
        size="small"
        sx={{
          "& .MuiRating-iconFilled": { color: "#FFD700" }, // yellow
          "& .MuiRating-iconEmpty": { color: "rgba(0,0,0,0.2)" },
        }}
      />
      <Box sx={{ height: "1px", bgcolor: "rgba(0,0,0,0.1)", my: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "rgba(0,0,0,0.1)", color: "#000", width: 40, height: 40 }}>
          {t.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ color: "#000", fontWeight: 600, fontSize: "0.85rem" }}>
            {t.user.name}
          </Typography>
          <Typography sx={{ color: "rgba(0, 76, 255, 0.8)", fontSize: "0.72rem" }}>
            {t.course.title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLandingPageTestimonials()
      .then(setTestimonials)
      .catch(() => {
        setError("Could not load testimonials from server. Showing sample reviews.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 8, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ textAlign: "center", mb: 5 }}>
          Words from Our Students
        </Typography>

        {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography sx={{ textAlign: "center" }}>Loading testimonials...</Typography>
        ) : (
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
            {testimonials.map((t) => (
              <TestimonialCard key={t._id} t={t} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Testimonials;