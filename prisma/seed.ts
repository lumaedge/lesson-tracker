import "dotenv/config";
import { PrismaClient, Role, LessonStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sslUrl = url.includes("sslmode=") ? url : `${url}&sslmode=require`;
const adapter = new PrismaPg({ connectionString: sslUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.auditLog.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      email: "principal@school.com",
      name: "Mrs Nkosi",
      password,
      role: Role.PRINCIPAL,
    },
  });

  const dept = await prisma.department.create({
    data: { name: "Coding & Robotics" },
  });

  const hod = await prisma.user.create({
    data: {
      email: "hod@school.com",
      name: "Mr Dlamini",
      password,
      role: Role.HOD,
      departmentId: dept.id,
    },
  });

  const teacher1 = await prisma.user.create({
    data: { email: "teacher1@school.com", name: "Ms Zulu", password, role: Role.TEACHER },
  });
  const teacher2 = await prisma.user.create({
    data: { email: "teacher2@school.com", name: "Mr Mkhize", password, role: Role.TEACHER },
  });
  const teacher3 = await prisma.user.create({
    data: { email: "teacher3@school.com", name: "Mrs Ndlovu", password, role: Role.TEACHER },
  });

  const subject = await prisma.subject.create({
    data: { name: "Coding & Robotics", departmentId: dept.id },
  });

  const curriculum = await prisma.curriculum.create({
    data: { subjectId: subject.id, termName: "Term 3 2026" },
  });

  const lessons = await Promise.all([
    prisma.lesson.create({ data: { curriculumId: curriculum.id, name: "Meet the Robot", weekRange: "Wks 1-2", sortOrder: 1 } }),
    prisma.lesson.create({ data: { curriculumId: curriculum.id, name: "Power Up & Roll", weekRange: "Wks 3-4", sortOrder: 2 } }),
    prisma.lesson.create({ data: { curriculumId: curriculum.id, name: "Robot Choreography", weekRange: "Wks 5-6", sortOrder: 3 } }),
    prisma.lesson.create({ data: { curriculumId: curriculum.id, name: "Give It Senses", weekRange: "Wks 7-8", sortOrder: 4 } }),
    prisma.lesson.create({ data: { curriculumId: curriculum.id, name: "The Grand Challenge", weekRange: "Wks 9-10", sortOrder: 5 } }),
  ]);

  const classData = [
    { teacherId: teacher1.id, day: "Wednesday", period: "P5-6", grade: 3, classCode: "SU" },
    { teacherId: teacher1.id, day: "Friday", period: "P8-9", grade: 4, classCode: "M" },
    { teacherId: teacher1.id, day: "Tuesday", period: "P3-4", grade: 4, classCode: "NX" },
    { teacherId: hod.id, day: "Thursday", period: "P5-6", grade: 4, classCode: "VM" },
    { teacherId: hod.id, day: "Monday", period: "P11-12", grade: 5, classCode: "FR" },
    { teacherId: hod.id, day: "Thursday", period: "P9-10", grade: 5, classCode: "MA" },
    { teacherId: teacher2.id, day: "Wednesday", period: "P11-12", grade: 5, classCode: "ND" },
    { teacherId: teacher2.id, day: "Friday", period: "P2-3", grade: 6, classCode: "RU" },
    { teacherId: teacher2.id, day: "Tuesday", period: "P8-9", grade: 6, classCode: "SIT" },
    { teacherId: teacher3.id, day: "Wednesday", period: "P8-9", grade: 6, classCode: "ZU" },
    { teacherId: teacher3.id, day: "Tuesday", period: "P11-12", grade: 7, classCode: "DM" },
    { teacherId: teacher3.id, day: "Monday", period: "P7-8", grade: 7, classCode: "GU" },
    { teacherId: teacher3.id, day: "Thursday", period: "P11-12", grade: 7, classCode: "MA2" },
  ];

  const statuses: LessonStatus[] = [
    LessonStatus.DONE,
    LessonStatus.DONE,
    LessonStatus.STARTED,
    LessonStatus.NOT_STARTED,
    LessonStatus.NOT_STARTED,
  ];

  for (const cls of classData) {
    const created = await prisma.class.create({
      data: { ...cls, subjectId: subject.id },
    });

    for (let i = 0; i < lessons.length; i++) {
      await prisma.progress.create({
        data: {
          classId: created.id,
          lessonId: lessons[i].id,
          status: statuses[i],
          markedAt: statuses[i] !== LessonStatus.NOT_STARTED ? new Date() : null,
        },
      });
    }
  }

  console.log("Seed complete:");
  console.log("  Principal: principal@school.com / password123");
  console.log("  HOD:       hod@school.com / password123");
  console.log("  Teacher 1: teacher1@school.com / password123");
  console.log("  Teacher 2: teacher2@school.com / password123");
  console.log("  Teacher 3: teacher3@school.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
