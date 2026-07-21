export type LessonStatus = "" | "Started" | "Done";

export interface ClassData {
  id: string;
  day: string;
  period: string;
  grade: number;
  classCode: string;
  lessons: [LessonStatus, LessonStatus, LessonStatus, LessonStatus, LessonStatus];
  notes: string;
}

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
