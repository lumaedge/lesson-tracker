import { Redis } from "@upstash/redis";
import type { TermData, AttendanceData } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const TERM_KEY = "lesson-tracker:term";
const ATTENDANCE_KEY = "lesson-tracker:attendance";

export async function getTermData(): Promise<TermData | null> {
  return redis.get<TermData>(TERM_KEY);
}

export async function setTermData(data: TermData): Promise<void> {
  await redis.set(TERM_KEY, data);
}

export async function getAttendance(): Promise<AttendanceData> {
  const data = await redis.get<AttendanceData>(ATTENDANCE_KEY);
  return data || {};
}

export async function setAttendance(data: AttendanceData): Promise<void> {
  await redis.set(ATTENDANCE_KEY, data);
}
