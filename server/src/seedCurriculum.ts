import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/connectDB';
import Course from './models/courses';
import Enrollment from './models/enrollment';
import { parseOutline } from './curriculumParser';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Usage:  npx ts-node src/seedCurriculum.ts [path/to/outline.txt] [--dry]
const run = async () => {
    const file = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? path.join(__dirname, '..', 'data', 'curriculum.txt');
    const dry = process.argv.includes('--dry');

    const nodes = parseOutline(fs.readFileSync(file, 'utf8'));
    const leaves = nodes.filter((n) => n.childCount === 0).length;
    console.log(`Parsed ${nodes.length} items (${leaves} leaves, ${nodes.length - leaves} parents) from ${file}`);
    if (dry) return console.log('Dry run: nothing written.');

    await connectDB();
    // Old tree and the selections that point to it are replaced
    await Enrollment.deleteMany({});
    await Course.deleteMany({});
    await Course.syncIndexes(); // drops old indexes, builds the new ones
    await Course.insertMany(nodes, { ordered: true });
    console.log('Curriculum imported.');
    await mongoose.connection.close();
};

run().then(() => process.exit(0)).catch((e) => { console.error(e.message); process.exit(1); });