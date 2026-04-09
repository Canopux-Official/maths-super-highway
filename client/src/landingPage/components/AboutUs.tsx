import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    Stack,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";


const values = [

    {

        icon: <VerifiedIcon fontSize="medium" />,

        title: "Proven Pedagogy",

        description:

            "Our teaching methodology is built on years of research and results. We combine conceptual clarity with rigorous practice.",

    },

    {

        icon: <TrendingUpIcon fontSize="medium" />,

        title: "Result-Oriented",

        description:

            "Every curriculum decision is driven by outcomes. Our students consistently outperform at boards, JEE, and Olympiads.",

    },

    {

        icon: <PeopleAltIcon fontSize="medium" />,

        title: "Personalised Attention",

        description:

            "Small batch sizes ensure every student receives individual feedback and guidance tailored to their learning pace.",

    },

    {

        icon: <MenuBookIcon fontSize="medium" />,

        title: "Comprehensive Resources",

        description:

            "Access to curated study material, topic-wise test series, and recorded sessions — available 24/7.",

    },

];

const milestones = [

    { year: "2010", event: "Founded in Bhubaneswar with a vision to make quality maths education accessible." },

    { year: "2015", event: "Expanded to 3 centres; first batch produced AIR Top 100 in JEE Advanced." },

    { year: "2019", event: "Launched online learning platform — reaching students across Odisha." },

    { year: "2023", event: "Crossed 5,000 enrolled students with 98% board & competitive exam success rate." },

];

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (

    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>

        <Box sx={{ height: 1, width: 40, bgcolor: "secondary.main" }} />

        <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: "0.15em", fontWeight: 700 }}>

            {text}

        </Typography>

    </Box>

);

const AboutUs: React.FC = () => {
    return (
        <Box id="about" sx={{ py: { xs: 8, md: 11 }, bgcolor: "#F5F6FA" }}>
            <Container maxWidth="lg">
                {/* Replacement for the main Grid container using Flexbox */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 6, md: 9 },
                        alignItems: "flex-start"
                    }}
                >
                    {/* Left — story (Takes 50% width on desktop) */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <SectionLabel text="ABOUT US" />
                        <Typography
                            variant="h2"
                            sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, color: "primary.main", mb: 2.5, lineHeight: 1.2 }}
                        >
                            Two Decades of Building Mathematical Minds
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 2 }}>
                            Maths Super Highway was founded with a singular belief: every student...
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 4 }}>
                            Our faculty brings together alumni from IITs, NITs...
                        </Typography>

                        {/* Timeline */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
                            Our Journey
                        </Typography>
                        <Stack spacing={2.5}>
                            {milestones.map((m, i) => (
                                <Box key={m.year} sx={{ display: "flex", gap: 2.5 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: "50%",
                                                bgcolor: "primary.main",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ color: "#fff", fontWeight: 700, fontSize: "0.7rem" }}>
                                                {m.year}
                                            </Typography>
                                        </Box>
                                        {i < milestones.length - 1 && (
                                            <Box sx={{ width: "2px", flexGrow: 1, bgcolor: "grey.200", mt: 0.5 }} />
                                        )}
                                    </Box>
                                    <Box sx={{ pt: 0.8, pb: i < milestones.length - 1 ? 2 : 0 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                            {m.event}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* Right — values (Takes 50% width on desktop) */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <Box
                            sx={{
                                bgcolor: "primary.main",
                                borderRadius: 3,
                                p: { xs: 3, md: 4 },
                                mb: 3,
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "#fff", mb: 1 }}>
                                Our Mission
                            </Typography>
                            <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mb: 2 }} />
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.9 }}>
                                To provide every student with a deep, logical understanding of mathematics...
                            </Typography>
                        </Box>

                        {/* Replacement for inner Grid using CSS Grid (cleaner than MUI Grid) */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 2,
                            }}
                        >
                            {values.map((v) => (
                                <Paper
                                    key={v.title}
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        border: "1px solid",
                                        borderColor: "grey.200",
                                        borderRadius: 2,
                                        transition: "border-color 0.2s",
                                        "&:hover": { borderColor: "primary.light" },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1.5,
                                            bgcolor: "rgba(26,35,126,0.08)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "primary.main",
                                            mb: 1.5,
                                        }}
                                    >
                                        {v.icon}
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "primary.main" }}>
                                        {v.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {v.description}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;