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
import { testimonialService } from "../services/api";

interface Props {
    courseId: string;
    onSubmitSuccess?: () => void;
}

const FeedbackForm: React.FC<Props> = ({ courseId, onSubmitSuccess }) => {
    const [rating, setRating] = useState<number | null>(0);
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
                if (res.data) {
                    setAlreadyReviewed(true);
                }
            } catch {
                // No review exists
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
            setTimeout(() => {
                onSubmitSuccess?.();
            }, 1500);
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

    if (checkingExisting) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Checking your feedback status...
                </Typography>
            </Box>
        );
    }

    if (alreadyReviewed && !successMsg) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                    icon={<CheckCircleIcon />}
                    label="You have already submitted feedback for this course"
                    color="success"
                    variant="outlined"
                    size="small"
                />
            </Box>
        );
    }

    if (successMsg) {
        return (
            <Alert severity="success" icon={<CheckCircleIcon />}>
                {successMsg}
            </Alert>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                Share your experience
            </Typography>

            <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 0.5, display: "block" }}>
                    Rating
                </Typography>
                <Rating
                    value={rating}
                    onChange={(_, val) => setRating(val)}
                    size="medium"
                />
            </Box>

            <TextField
                label="Your review"
                placeholder="What did you learn? How was the experience?"
                multiline
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                // Change inputProps to slotProps.htmlInput
                slotProps={{
                    htmlInput: {
                        maxLength: 500
                    }
                }}
                helperText={`${message.length}/500`}
                size="small"
                sx={{ bgcolor: "background.paper", borderRadius: 1 }}
            />

            {errorMsg && (
                <Alert severity="error" sx={{ py: 0.5 }}>
                    {errorMsg}
                </Alert>
            )}

            <Box>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    disableElevation
                    size="small"
                    sx={{ textTransform: "none", fontWeight: 500, borderRadius: 1.5 }}
                >
                    {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
            </Box>
        </Box>
    );
};

export default FeedbackForm;