import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Request, Response, NextFunction } from 'express';
import connectDB from "./config/connectDB";
import courseAdminRoutes from './routes/courses.admin.routes';
import courseUserRoutes from './routes/courses.user.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import testimonialRoutes from './routes/testimonial.routes';
import headlineRoutes from './routes/headlines.routes';
import adminManageStudentRoutes from './routes/studentmanage.admin.routes'
import landingPageRoutes from './routes/landingPage.routes';
import authRoutes from './routes/auth.routes';
import { verifyAuth, verifyRole } from './middlewares/auth.middleware';

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[App] DB unavailable:', err);
    res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable. Please retry in a moment.',
    });
  }
});

app.use('/auth', authRoutes);

app.use("/courses-admin", verifyAuth, verifyRole(['admin']), courseAdminRoutes);

app.use('/courses-user', verifyAuth, courseUserRoutes);

app.use('/enrollment', verifyAuth, enrollmentRoutes);

app.use('/testimonials', testimonialRoutes);

app.use('/headlines', headlineRoutes);

app.use('/admin-manage-student', verifyAuth, verifyRole(['admin']), adminManageStudentRoutes);

app.use('/landing-page', landingPageRoutes);

// -----------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`[App] Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('[App] Failed to start server:', err);
      process.exit(1);
    });
}

export default app;