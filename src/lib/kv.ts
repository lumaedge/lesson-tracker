import { Redis } from "@upstash/redis";
import type { TermData } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const TERM_KEY = "lesson-tracker:term";

export async function getTermData(): Promise<TermData | null> {
  return redis.get<TermData>(TERM_KEY);
}

export async function setTermData(data: TermData): Promise<void> {
  await redis.set(TERM_KEY, data);
}
