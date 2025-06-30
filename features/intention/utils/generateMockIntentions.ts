// utils/generateMockExtras.ts
import { drizzleDb } from "@/db/client";
import { intentionsTable } from "@/db/schema";
import { eachDayOfInterval, format, startOfYear, subDays } from "date-fns";
import { randomUUID } from "expo-crypto";

const intentionPhrases = [
  "Be kind to myself.",
  "Stay present.",
  "Focus on what I can control.",
  "Breathe deeply.",
  "Avoid judging myself.",
];

export async function generateMockIntentions() {
  try {
    const start = startOfYear(new Date());
    const end = subDays(new Date(), 1);

    const allIntentions = eachDayOfInterval({ start, end })
      .filter(() => Math.random() > 0.3) // 70% chance of having an intention
      .map((day) => ({
        date: format(day, "yyyy-MM-dd"),
        intention:
          intentionPhrases[Math.floor(Math.random() * intentionPhrases.length)],
        id: randomUUID(),
        createdAt: day.toISOString(),
        updatedAt: day.toISOString(),
      }));

    const rows = await drizzleDb.insert(intentionsTable).values(allIntentions);

    console.log("Generated mock intentions:", rows);
  } catch (error) {
    console.error("Error generating mock intentions:", error);
  }
}
