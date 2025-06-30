// utils/generateMockExtras.ts
import { drizzleDb } from "@/db/client";
import { reflectionsTable } from "@/db/schema";
import {
  addHours,
  addMinutes,
  eachDayOfInterval,
  startOfYear,
  subDays,
} from "date-fns";
import { randomUUID } from "expo-crypto";

type Reflection = { datetime: string; text: string };

const reflectionPhrases = [
  "Today felt overwhelming but I handled it.",
  "I noticed I was more patient.",
  "I wish I had taken more breaks.",
  "I felt grateful during lunch.",
  "Even when tired, I found small joys.",
];

const images = [
  "https://images.unsplash.com/photo-1653569746987-8c1c63b2ffe2?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1556644424-2379c2803793?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1515463626042-123ab67dcaa7?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1479334053136-4dcabc560c9a?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1658279366796-e0c28623cd27?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1473861646675-0252edc45daa?q=80&w=800&auto=format",
];

export async function generateMockReflections() {
  try {
    const start = startOfYear(new Date());
    const end = subDays(new Date(), 1);
    const days = eachDayOfInterval({ start, end });

    const allReflections = days.flatMap((day) => {
      const count = Math.floor(Math.random() * 3); // 0 to 2
      return Array.from({ length: count }).map(() => {
        const hour = Math.floor(Math.random() * 4) + 20; // reflections at night: 8–11pm
        const minute = Math.floor(Math.random() * 60);
        return {
          datetime: addMinutes(addHours(day, hour), minute).toISOString(),
          content:
            reflectionPhrases[
              Math.floor(Math.random() * reflectionPhrases.length)
            ],
          images: images[Math.floor(Math.random() * images.length)],
          id: randomUUID(),
          createdAt: day.toISOString(),
          updatedAt: day.toISOString(),
        };
      });
    });

    const rows = await drizzleDb
      .insert(reflectionsTable)
      .values(allReflections);

    console.log("Generated mock reflections:", rows);
  } catch (error) {
    console.error("Error generating mock reflections:", error);
  }
}
