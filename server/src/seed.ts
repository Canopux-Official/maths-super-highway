import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/user';
import Course from './models/courses';
import Enrollment from './models/enrollment';
import Headline from './models/headline';
import Testimonial from './models/testimonials';
import Otp from './models/Otp';
import connectDB from './config/connectDB';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing old data and indexes...');
    // Drop the collection to remove any stale indexes (like the reported 'contact.phone')
    try {
      await mongoose.connection.db.dropCollection('users');
      console.log('Dropped users collection to clear stale indexes.');
    } catch (e) {
      console.log('Users collection not found, skipping drop.');
    }

    await Promise.all([
      Course.deleteMany({}),
      Enrollment.deleteMany({}),
      Headline.deleteMany({}),
      Testimonial.deleteMany({}),
      Otp.deleteMany({}),
    ]);

    console.log('Seeding Users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    const admin = await User.create({
      name: 'System Admin',
      email: 'architmishra062@gmail.com',
      password: adminPassword,
      phone: '1234567890',
      role: 'admin',
    });

    const student = await User.create({
      name: 'John Student',
      email: 'archit240305@gmail.com',
      password: studentPassword,
      phone: '0987654321',
      role: 'student',
    });

    console.log('Seeding Courses...');
    const mainFolder = await Course.create({
      title: 'Mathematics Level 1',
      itemType: 'folder',
      order: 1,
      parentId: null
    });

    const coursePage = await Course.create({
      title: 'Algebra Basics',
      content: '<p>Welcome to Algebra!</p>',
      itemType: 'page',
      order: 1,
      parentId: mainFolder._id
    });

    console.log('Seeding Enrollments...');
    await Enrollment.create({
      student: student._id,
      course: mainFolder._id
    });

    console.log('Seeding Headlines...');
    await Headline.create({
      text: 'Welcome to the new academic year!',
      link: '/student/courses',
      isLive: true
    });

    console.log('Seeding Testimonials...');
    await Testimonial.create({
      user: student._id,
      course: mainFolder._id,
      message: 'This course is amazing!',
      rating: 5
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
