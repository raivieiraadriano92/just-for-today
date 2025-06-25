import { drizzleDb } from "@/db/client";
import { moodLogsTable } from "@/db/schema";
import {
  addHours,
  addMinutes,
  eachDayOfInterval,
  startOfYear,
  subDays,
} from "date-fns";
import { randomUUID } from "expo-crypto";
import { moodTypes, moodTypesList } from "../moodTypes";

export async function generateMockMoodLogs(): Promise<void> {
  try {
    const start = startOfYear(new Date());
    const end = subDays(new Date(), 1); // yesterday

    const days = eachDayOfInterval({ start, end });
    const allLogs: (typeof moodLogsTable.$inferSelect)[] = [];

    for (const day of days) {
      const numberOfLogs = Math.floor(Math.random() * 6); // 0 to 5 logs

      for (let i = 0; i < numberOfLogs; i++) {
        const hour = Math.floor(Math.random() * 16) + 6; // random hour between 6AM and 10PM
        const minute = Math.floor(Math.random() * 60);
        const datetime = addMinutes(addHours(day, hour), minute).toISOString();

        const mood =
          moodTypesList[Math.floor(Math.random() * moodTypesList.length)];

        allLogs.push({
          datetime,
          mood,
          feelings: moodTypes[mood].feelings
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 5) + 1)
            .join(","),
          note: "",
          id: randomUUID(),
          createdAt: datetime,
          updatedAt: datetime,
        });
      }
    }

    const rows = await drizzleDb.insert(moodLogsTable).values(allLogs);

    console.log("Generated mock mood logs:", rows);
  } catch (error) {
    console.error("Error generating mock mood logs:", error);
  }
}
