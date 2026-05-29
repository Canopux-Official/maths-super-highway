import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import Enrollment from "../models/enrollment";
import Testimonial from "../models/testimonials";
import Course from "../models/courses";
import Headline from "../models/headline";

// ─────────────────────────────────────────────
// GET /api/dashboard/admin
// Admin dashboard stats
// ─────────────────────────────────────────────

export const adminDashboard   =  async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
 
    const [
      // ── Users ──
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newUsersThisMonth,
      usersByRole,
 
      // ── Courses ──
      totalFolders,
      totalPages,
      activeCourses,
 
      // ── Enrollments ──
      totalEnrollments,
      mostEnrolledCourses,
 
      // ── Testimonials ──
      totalTestimonials,
      ratingBreakdown,
      overallRating,
 
      // ── Headlines ──
      liveHeadlines,
    ] = await Promise.all([
      // Users
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
 
      // Courses
      Course.countDocuments({ itemType: "folder" }),
      Course.countDocuments({ itemType: "page" }),
      Course.countDocuments({ isActive: true }),
 
      // Enrollments
      Enrollment.countDocuments(),
      Enrollment.aggregate([
        { $group: { _id: "$course", enrolledCount: { $sum: 1 } } },
        { $sort: { enrolledCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "courseDetails",
          },
        },
        { $unwind: "$courseDetails" },
        {
          $project: {
            _id: 0,
            courseId: "$_id",
            title: "$courseDetails.title",
            enrolledCount: 1,
          },
        },
      ]),
 
      // Testimonials
      Testimonial.countDocuments(),
      Testimonial.aggregate([
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Testimonial.aggregate([
        { $group: { _id: null, average: { $avg: "$rating" } } },
      ]),
 
      // Headlines
      Headline.countDocuments({ isLive: true }),
    ]);
 
    return res.status(200).json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
        byRole: usersByRole.reduce(
          (acc: Record<string, number>, r: { _id: string; count: number }) => {
            acc[r._id] = r.count;
            return acc;
          },
          {}
        ),
      },
      courses: {
        totalFolders,
        totalPages,
        active: activeCourses,
        inactive: totalFolders + totalPages - activeCourses,
      },
      enrollments: {
        total: totalEnrollments,
        topCourses: mostEnrolledCourses,
      },
      testimonials: {
        total: totalTestimonials,
        averageRating: overallRating[0]
          ? parseFloat(overallRating[0].average.toFixed(1))
          : 0,
        ratingBreakdown: ratingBreakdown.reduce(
          (acc: Record<number, number>, r: { _id: number; count: number }) => {
            acc[r._id] = r.count;
            return acc;
          },
          {}
        ),
      },
      headlines: {
        live: liveHeadlines,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};