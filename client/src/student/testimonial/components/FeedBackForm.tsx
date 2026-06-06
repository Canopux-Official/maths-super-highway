import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Rating,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { testimonialService } from "../services/api";

interface Props {
    courseId: string;
    onSubmitSuccess?: () => void;
}

const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
};

const FeedbackForm: React.FC<Props> = ({ courseId, onSubmitSuccess }) => {
    const [rating, setRating] = useState<number | null>(0);
    const [hovered, setHovered] = useState<number>(-1);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(true);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const checkExisting = async () => {
            setCheckingExisting(true);
            try {
                const res = await testimonialService.getMyTestimonialForCourse(courseId);
                if (res.data) setAlreadyReviewed(true);
            } catch {
                // No review exists — that's fine
            } finally {
                setCheckingExisting(false);
            }
        };
        checkExisting();
    }, [courseId]);

    const handleSubmit = async () => {
        if (!rating || rating < 1) {
            setErrorMsg("Please select a rating.");
            return;
        }
        if (!message.trim()) {
            setErrorMsg("Please write a short review.");
            return;
        }
        setLoading(true);
        setErrorMsg("");
        try {
            await testimonialService.createTestimonial({ courseId, rating, message });
            setSuccessMsg("Thank you! Your feedback has been submitted.");
            setAlreadyReviewed(true);
            setTimeout(() => { onSubmitSuccess?.(); }, 1600);
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            if (msg?.includes("already reviewed")) {
                setAlreadyReviewed(true);
                setErrorMsg("You have already submitted feedback for this course.");
            } else {
                setErrorMsg(msg || "Failed to submit feedback. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const displayRating = hovered !== -1 ? hovered : (rating ?? 0);

    if (checkingExisting) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <CircularProgress size={14} sx={{ color: "#1D4ED8" }} />
                <Typography sx={{ fontSize: "0.8rem", color: "#64748B", fontFamily: "'Inter', sans-serif" }}>
                    Checking feedback status…
                </Typography>
            </Box>
        );
    }

    if (alreadyReviewed && !successMsg) {
        return (
            <Chip
                icon={<CheckCircleIcon sx={{ fontSize: "14px !important", color: "#16A34A !important" }} />}
                label="You have already reviewed this course"
                sx={{
                    bgcolor: "rgba(22,163,74,0.10)",
                    color: "#16A34A",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    fontFamily: "'Inter', sans-serif",
                    border: "1px solid rgba(22,163,74,0.2)",
                }}
            />
        );
    }

    if (successMsg) {
        return (
            <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ borderRadius: "10px", bgcolor: "rgba(22,163,74,0.10)", color: "#16A34A", "& .MuiAlert-icon": { color: "#16A34A" }, fontFamily: "'Inter', sans-serif" }}
            >
                {successMsg}
            </Alert>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography sx={{ fontWeight: 700, color: "#0A1628", fontFamily: "'Sora', sans-serif", fontSize: "0.9rem" }}>
                Share your experience
            </Typography>

            {/* Star Rating */}
            <Box>
                <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>
                    Rating
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Rating
                        value={rating}
                        onChange={(_, val) => setRating(val)}
                        onChangeActive={(_, val) => setHovered(val)}
                        size="large"
                        icon={<StarRoundedIcon fontSize="inherit" sx={{ color: "#06B6D4" }} />}
                        emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" sx={{ color: "#CBD5E1" }} />}
                    />
                    {displayRating > 0 && (
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: "#06B6D4", fontFamily: "'Inter', sans-serif" }}>
                            {ratingLabels[displayRating]}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Review text */}
            <TextField
                label="Your review"
                placeholder="What did you learn? How was the experience?"
                multiline
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 100 } }}
                helperText={`${message.length} / 100`}
                size="small"
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontFamily: "'Inter', sans-serif",
                        "& fieldset": { borderColor: "#E2E8F0" },
                        "&.Mui-focused fieldset": { borderColor: "#1D4ED8" },
                    },
                    "& label.Mui-focused": { color: "#1D4ED8" },
                    "& .MuiFormHelperText-root": { color: "#94A3B8", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem" },
                }}
            />

            {errorMsg && (
                <Alert severity="error" sx={{ borderRadius: "10px", py: 0.5, fontFamily: "'Inter', sans-serif" }}>
                    {errorMsg}
                </Alert>
            )}

            <Box>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    disableElevation
                    sx={{
                        background: "linear-gradient(135deg, #0A1628, #1D4ED8)",
                        color: "#fff",
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 3,
                        py: 1,
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: "0 4px 14px rgba(29,78,216,0.25)",
                        "&:hover": { background: "linear-gradient(135deg, #112240, #2563EB)", transform: "translateY(-1px)" },
                        "&:disabled": { background: "#E2E8F0", color: "#94A3B8", boxShadow: "none" },
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    {loading ? "Submitting…" : "Submit Feedback"}
                </Button>
            </Box>
        </Box>
    );
};

export default FeedbackForm;