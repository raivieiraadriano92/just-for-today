// utils/generateMockExtras.ts
import { drizzleDb } from "@/db/client";
import { gratitudeLogsTable } from "@/db/schema";
import {
  addHours,
  addMinutes,
  eachDayOfInterval,
  startOfYear,
  subDays,
} from "date-fns";
import { randomUUID } from "expo-crypto";

const gratitudePhrases = [
  "A warm cup of coffee",
  "A call with a friend",
  "Having a roof over my head",
  "The sound of birds in the morning",
  "My health and my body",
];

const images = [
  "https://images.unsplash.com/photo-1528938102132-4a9276b8e320?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1545945774-73922eb27813?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1510194638421-92f54ce46444?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1609114215005-d2a87febd22b?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1501747315-124a0eaca060?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1668027400307-c316968e8015?q=80&w=800&auto=format",
  "https://images.unsplash.com/photo-1615230106436-fd04a9cbaef6?q=80&w=800&auto=format",
];

export async function generateMockGratitudeLogs() {
  try {
    const start = startOfYear(new Date());
    const end = subDays(new Date(), 1);
    const days = eachDayOfInterval({ start, end });

    const allLogs = days.flatMap((day) => {
      const count = Math.floor(Math.random() * 4); // 0 to 3
      return Array.from({ length: count }).map(() => {
        const hour = Math.floor(Math.random() * 16) + 6;
        const minute = Math.floor(Math.random() * 60);
        return {
          datetime: addMinutes(addHours(day, hour), minute).toISOString(),
          content:
            gratitudePhrases[
              Math.floor(Math.random() * gratitudePhrases.length)
            ],
          images: images[Math.floor(Math.random() * images.length)],
          id: randomUUID(),
          createdAt: day.toISOString(),
          updatedAt: day.toISOString(),
        };
      });
    });

    const rows = await drizzleDb.insert(gratitudeLogsTable).values(allLogs);

    console.log("Generated mock gratitude logs:", rows);
  } catch (error) {
    console.error("Error generating mock gratitude logs:", error);
  }
}
