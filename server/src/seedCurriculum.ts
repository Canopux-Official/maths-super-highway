import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/connectDB';
import Course from './models/courses';
import Enrollment from './models/enrollment';
import User from './models/user';
import { parseOutline } from './curriculumParser';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Usage:  npx ts-node src/seedCurriculum.ts [path/to/outline.txt] [--dry]
const run = async () => {
    const file = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? path.join(__dirname, '..', 'data', 'curriculum.txt');
    const dry = process.argv.includes('--dry');

    const nodes = parseOutline(fs.readFileSync(file, 'utf8'));
    const leafNodes = nodes.filter((n) => n.childCount === 0);
    console.log(`Parsed ${nodes.length} items (${leafNodes.length} leaves, ${nodes.length - leafNodes.length} parents) from ${file}`);
    if (dry) return console.log('Dry run: nothing written.');

    await connectDB();
    // Old tree and the selections that point to it are replaced
    await Enrollment.deleteMany({});
    await Course.deleteMany({});
    await Course.syncIndexes(); // drops old indexes, builds the new ones
    await Course.insertMany(nodes, { ordered: true });
    console.log('Curriculum imported.');

    // Seed realistic enrollments for existing students
    const students = await User.find({ role: 'student' });
    if (students.length && leafNodes.length) {
        const demoEnrollments = [];
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const leaf1 = leafNodes[i % leafNodes.length];
            const leaf2 = leafNodes[(i + 3) % leafNodes.length];
            demoEnrollments.push(
                { student: student._id, course: leaf1._id, needsReview: false },
                { student: student._id, course: leaf2._id, needsReview: false }
            );
        }
        await Enrollment.insertMany(demoEnrollments);
        console.log(`Seeded demo enrollments for ${students.length} students.`);
    }

    await mongoose.connection.close();
};

run().then(() => process.exit(0)).catch((e) => { console.error(e.message); process.exit(1); });