import { drizzleDb } from "@/db/client";
import { intentionsTable } from "@/db/schema";
import { addDays, isFuture, startOfWeek } from "date-fns";
import { format } from "date-fns/format";
import { and, count, gte, lte } from "drizzle-orm";
import { create } from "zustand";

type ActivityStoreState = {
  weeklyProgress: {
    date: string;
    day: string;
    isFuture: boolean; // Optional, to indicate if the day is in the future
    value: number; // Percentage of completion for the day
  }[];
};

type ActivityStoreActions = {
  loadWeeklyProgress: () => Promise<void>;
};

export type ActivityStore = ActivityStoreState & ActivityStoreActions;

export const useActivityStore = create<ActivityStore>()((set, get) => ({
  weeklyProgress: [],

  loadWeeklyProgress: async () => {
    const firstDayOfWeek = startOfWeek(new Date());

    // Generate an array of dates for the current week starting from the first day of the week
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(new Date(firstDayOfWeek), i);

      return {
        date: format(date, "yyyy-MM-dd"), // Format as YYYY-MM-DD
        day: format(date, "EEEEE"), // First letter of the day (e.g., "M - Mon", "T - Tue")
        isFuture: isFuture(date),
        value: 0,
      };
    });

    // Get the start and end dates of the week
    const from = weekDays[0].date;
    const to = weekDays[weekDays.length - 1].date;

    // Fetch the count of intentions for each day in the week
    const [intentionCount] = await Promise.all([
      drizzleDb
        .select({ date: intentionsTable.date, count: count() })
        .from(intentionsTable)
        .groupBy(intentionsTable.date)
        .where(
          and(gte(intentionsTable.date, from), lte(intentionsTable.date, to)),
        ),
    ]);

    // Map the intention count to the week days
    const weeklyProgress = weekDays.map((day) => {
      const intention = intentionCount.find((i) => i.date === day.date);

      let value = 0;

      if (intention) {
        value += 25;
      }

      return {
        ...day,
        value,
      };
    });

    set({
      weeklyProgress,
    });
  },
}));
