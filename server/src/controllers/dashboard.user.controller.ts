import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Enrollment from "../models/enrollment";
import Testimonial from "../models/testimonials";
import Course from "../models/courses";


// ─────────────────────────────────────────────
// GET /api/dashboard/student/:userId
// Student dashboard stats
// ─────────────────────────────────────────────
export const userDashboard = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId as any);

        const [
            user,
            totalEnrolled,
            recentEnrollments,
            testimonialStats,
        ] = await Promise.all([
            // Basic user info
            User.findById(userObjectId).select("name email phone role createdAt"),

            // Total courses enrolled
            Enrollment.countDocuments({ student: userObjectId }),

            // Last 5 enrolled courses with course details
            Enrollment.find({ student: userObjectId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate({
                    path: "course",
                    select: "title tags isActive ancestors depth parentId description",
                })
                .lean(),

            // Testimonial stats: count + average rating
            Testimonial.aggregate([
                { $match: { user: userObjectId } },
                {
                    $group: {
                        _id: null,
                        totalReviews: { $sum: 1 },
                        averageRating: { $avg: "$rating" },
                    },
                },
            ]),
        ]);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Collect all ancestor IDs across enrolled courses to resolve their titles
        const allAncestorIds = [
            ...new Set(
                recentEnrollments
                    .map((e: any) => e.course)
                    .filter(Boolean)
                    .flatMap((c: any) => c.ancestors || [])
                    .map(String)
            ),
        ];

        const ancestors = allAncestorIds.length
            ? await Course.find({ _id: { $in: allAncestorIds } }).select("title depth parentId").lean()
            : [];
        const ancestorMap = new Map(ancestors.map((a: any) => [a._id.toString(), a.title]));

        const formattedRecent = recentEnrollments.map((e: any) => {
            if (!e.course) return { enrolledAt: e.createdAt, course: null };
            const breadcrumb = (e.course.ancestors || [])
                .map((aId: any) => ancestorMap.get(aId.toString()))
                .filter(Boolean);
            const fullPath = [...breadcrumb, e.course.title];
            return {
                enrolledAt: e.createdAt,
                course: {
                    ...e.course,
                    breadcrumb,
                    path: fullPath,
                    pathLabel: fullPath.join(" › "),
                },
            };
        });

        return res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                memberSince: user.createdAt,
            },
            enrollments: {
                total: totalEnrolled,
                recent: formattedRecent,
            },
            testimonials: {
                total: testimonialStats[0]?.totalReviews ?? 0,
                averageRating: testimonialStats[0]
                    ? parseFloat(testimonialStats[0].averageRating.toFixed(1))
                    : 0,
            },
        });
    } catch (error) {
        console.error("Student dashboard error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};