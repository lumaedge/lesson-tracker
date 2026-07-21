export type LessonStatus = "" | "Started" | "Done";

export interface ClassData {
  id: string;
  day: string;
  period: string;
  grade: number;
  classCode: string;
  lessons: [LessonStatus, LessonStatus, LessonStatus, LessonStatus, LessonStatus];
  notes: string;
  totalStudents: number;
}

export interface AttendanceRecord {
  present: number;
}

export type AttendanceData = Record<string, Record<string, AttendanceRecord>>;

export interface TermData {
  term: string;
  classes: ClassData[];
}

export const LESSON_NAMES = [
  "Meet the Robot",
  "Power Up & Roll",
  "Robot Choreography",
  "Give It Senses",
  "The Grand Challenge",
] as const;

export const LESSON_WEEKS = [
  "Wks 1-2",
  "Wks 3-4",
  "Wks 5-6",
  "Wks 7-8",
  "Wks 9-10",
] as const;

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function periodSortKey(period: string): number {
  const match = period.match(/P(\d+)/);
  return match ? parseInt(match[1]) : 99;
}

export function sortClasses(classes: ClassData[]): ClassData[] {
  return [...classes].sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return periodSortKey(a.period) - periodSortKey(b.period);
  });
}
