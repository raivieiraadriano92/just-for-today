import { drizzleDb } from "@/db/client";
import {
  gratitudeLogsTable,
  intentionsTable,
  moodLogsTable,
  reflectionsTable,
} from "@/db/schema";
import { addDays, isFuture, parseISO, startOfWeek } from "date-fns";
import { format } from "date-fns/format";
import { and, count, gte, lte } from "drizzle-orm";
import { create } from "zustand";

type ActivityStoreState = {
  weeklyProgress: {
    date: string;
    day: string;
    isFuture: boolean; // Optional, to indicate if the day is in the future
    isCompleted: boolean;
    intentionsCount: number;
    moodLogsCount: number;
    gratitudeLogsCount: number;
    reflectionsCount: number;
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

    // Fetch the counts of intentions, mood logs, gratitude logs, and reflections for the week
    const [
      intentionsCount,
      moodLogsCount,
      gratitudeLogsCount,
      reflectionsCount,
    ] = await Promise.all([
      drizzleDb
        .select({ date: intentionsTable.date, count: count() })
        .from(intentionsTable)
        .groupBy(intentionsTable.date)
        .where(
          and(gte(intentionsTable.date, from), lte(intentionsTable.date, to)),
        ),
      drizzleDb
        .select({ datetime: moodLogsTable.datetime, count: count() })
        .from(moodLogsTable)
        .groupBy(moodLogsTable.datetime)
        .where(
          and(
            gte(moodLogsTable.datetime, from),
            lte(moodLogsTable.datetime, to),
          ),
        ),
      drizzleDb
        .select({ datetime: gratitudeLogsTable.datetime, count: count() })
        .from(gratitudeLogsTable)
        .groupBy(gratitudeLogsTable.datetime)
        .where(
          and(
            gte(gratitudeLogsTable.datetime, from),
            lte(gratitudeLogsTable.datetime, to),
          ),
        ),
      drizzleDb
        .select({ datetime: reflectionsTable.datetime, count: count() })
        .from(reflectionsTable)
        .groupBy(reflectionsTable.datetime)
        .where(
          and(
            gte(reflectionsTable.datetime, from),
            lte(reflectionsTable.datetime, to),
          ),
        ),
    ]);

    // Map the counts to the corresponding week days
    const weeklyProgress = weekDays.map((day) => {
      const intention = intentionsCount.find((i) => i.date === day.date);

      const moodLog = moodLogsCount.find(
        (m) => format(parseISO(m.datetime), "yyyy-MM-dd") === day.date,
      );

      const gratitudeLog = gratitudeLogsCount.find(
        (g) => format(parseISO(g.datetime), "yyyy-MM-dd") === day.date,
      );

      const reflection = reflectionsCount.find(
        (r) => format(parseISO(r.datetime), "yyyy-MM-dd") === day.date,
      );

      return {
        ...day,
        isCompleted:
          !!intention?.count &&
          !!moodLog?.count &&
          !!gratitudeLog?.count &&
          !!reflection?.count,
        intentionsCount: intention?.count || 0,
        moodLogsCount: moodLog?.count || 0,
        gratitudeLogsCount: gratitudeLog?.count || 0,
        reflectionsCount: reflection?.count || 0,
      };
    });

    set({
      weeklyProgress,
    });
  },
}));
