import "dotenv/config";
import { PrismaClient, Role, LessonStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sslUrl = url.includes("sslmode=") ? url : `${url}&sslmode=require`;
const adapter = new PrismaPg({ connectionString: sslUrl });
const prisma = new PrismaClient({ adapter });

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function periodSortKey(period: string): number {
  const match = period.match(/P(\d+)/);
  return match ? parseInt(match[1]) : 99;
}

const LESSONS = [
  { name: "Meet the Robot", weekRange: "Wks 1-2", sortOrder: 1 },
  { name: "Power Up & Roll", weekRange: "Wks 3-4", sortOrder: 2 },
  { name: "Robot Choreography", weekRange: "Wks 5-6", sortOrder: 3 },
  { name: "Give It Senses", weekRange: "Wks 7-8", sortOrder: 4 },
  { name: "The Grand Challenge", weekRange: "Wks 9-10", sortOrder: 5 },
];

const CLASSES = [
  { day: "Wednesday", period: "P5-6 & Fri P5-6", grade: 3, classCode: "SU" },
  { day: "Friday", period: "P8-9", grade: 4, classCode: "M" },
  { day: "Tuesday", period: "P3-4", grade: 4, classCode: "NX" },
  { day: "Thursday", period: "P5-6", grade: 4, classCode: "VM" },
  { day: "Monday", period: "P11-12", grade: 5, classCode: "FR" },
  { day: "Thursday", period: "P9-10", grade: 5, classCode: "MA" },
  { day: "Wednesday", period: "P11-12", grade: 5, classCode: "ND" },
  { day: "Friday", period: "P2-3", grade: 6, classCode: "RU" },
  { day: "Tuesday", period: "P8-9", grade: 6, classCode: "SIT" },
  { day: "Wednesday", period: "P8-9", grade: 6, classCode: "ZU" },
  { day: "Tuesday", period: "P11-12", grade: 7, classCode: "DM" },
  { day: "Monday", period: "P7-8", grade: 7, classCode: "GU" },
  { day: "Thursday", period: "P11-12", grade: 7, classCode: "MA" },
];

async function main() {
  console.log("Importing from Excel data...\n");

  const password = await bcrypt.hash("password123", 10);

  // Users
  const principal = await prisma.user.create({
    data: { email: "principal@school.com", name: "Mrs Nkosi", password, role: Role.PRINCIPAL },
  });

  const dept = await prisma.department.create({
    data: { name: "Coding & Robotics" },
  });

  const hod = await prisma.user.create({
    data: { email: "hod@school.com", name: "Mr Dlamini", password, role: Role.HOD, departmentId: dept.id },
  });

  const teachers = await Promise.all([
    prisma.user.create({ data: { email: "teacher1@school.com", name: "Ms Zulu", password, role: Role.TEACHER } }),
    prisma.user.create({ data: { email: "teacher2@school.com", name: "Mr Mkhize", password, role: Role.TEACHER } }),
    prisma.user.create({ data: { email: "teacher3@school.com", name: "Mrs Ndlovu", password, role: Role.TEACHER } }),
  ]);

  const subject = await prisma.subject.create({
    data: { name: "Coding & Robotics", departmentId: dept.id },
  });

  const curriculum = await prisma.curriculum.create({
    data: { subjectId: subject.id, termName: "Term 3 2026" },
  });

  const lessons = await Promise.all(
    LESSONS.map((l) =>
      prisma.lesson.create({ data: { curriculumId: curriculum.id, ...l } })
    )
  );

  // Sort classes by day then period
  const sorted = [...CLASSES].sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return periodSortKey(a.period) - periodSortKey(b.period);
  });

  // Assign teachers: cycle through 3 teachers
  const teacherIds = [hod.id, teachers[0].id, teachers[1].id, teachers[2].id];

  let created = 0;
  for (const cls of sorted) {
    const teacherId = teacherIds[created % teacherIds.length];

    const row = await prisma.class.create({
      data: {
        teacherId,
        subjectId: subject.id,
        day: cls.day,
        period: cls.period,
        grade: cls.grade,
        classCode: cls.classCode,
      },
    });

    // Create progress (all NOT_STARTED)
    for (const lesson of lessons) {
      await prisma.progress.create({
        data: {
          classId: row.id,
          lessonId: lesson.id,
          status: LessonStatus.NOT_STARTED,
        },
      });
    }

    created++;
  }

  console.log(`Imported ${created} classes sorted by day → period:\n`);
  for (const cls of sorted) {
    console.log(`  ${cls.day.padEnd(10)} ${cls.period.padEnd(18)} Grade ${cls.grade}  ${cls.classCode}`);
  }

  console.log(`\nAccounts:`);
  console.log(`  Principal: principal@school.com / password123`);
  console.log(`  HOD:       hod@school.com / password123`);
  console.log(`  Teacher 1: teacher1@school.com / password123`);
  console.log(`  Teacher 2: teacher2@school.com / password123`);
  console.log(`  Teacher 3: teacher3@school.com / password123`);

  await prisma.$disconnect();
}

main().catch(console.error);
