import { drizzleDb } from "@/db/client";
import {
  gratitudeLogsTable,
  intentionsTable,
  moodLogsTable,
  reflectionsTable,
} from "@/db/schema";
import {
  addDays,
  endOfDay,
  isFuture,
  parseISO,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { format } from "date-fns/format";
import { and, count, gte, lte } from "drizzle-orm";
import { create } from "zustand";

type StreakState =
  | "no_streak_yet"
  | "active_streak"
  | "streak_broken"
  | "streak_restarted";

type ActivityStoreState = {
  counters: {
    loading: boolean;
    intentions: number;
    moodLogs: number;
    gratitudeLogs: number;
    reflections: number;
  };
  streak: {
    loading: boolean;
    longestStreak: number;
    currentStreak: number;
    lastStreak: number;
    state: StreakState;
  };
  weeklyProgress: {
    loading: boolean;
    data: {
      date: string;
      day: string;
      isFuture: boolean; // Optional, to indicate if the day is in the future
      isCompleted: boolean;
      intentionsCount: number;
      moodLogsCount: number;
      gratitudeLogsCount: number;
      reflectionsCount: number;
      progress: number;
    }[];
  };
};

type ActivityStoreActions = {
  loadStreak: () => Promise<void>;
  loadWeeklyProgress: () => Promise<void>;
};

export type ActivityStore = ActivityStoreState & ActivityStoreActions;

export const PROGRESS_MULTIPLIER = 25; // Each completed log contributes 25% to the progress

export const useActivityStore = create<ActivityStore>()((set, get) => ({
  counters: {
    loading: false,
    intentions: 0,
    moodLogs: 0,
    gratitudeLogs: 0,
    reflections: 0,
    wordsWritten: 0,
  },
  streak: {
    loading: false,
    longestStreak: 0,
    currentStreak: 0,
    lastStreak: 0,
    state: "no_streak_yet",
  },
  weeklyProgress: {
    loading: false,
    data: [],
  },

  loadStreak: async () => {
    console.log("Loading streak...");
    set({
      counters: {
        ...get().counters,
        loading: true,
      },
      streak: {
        ...get().streak,
        loading: true,
      },
    });

    // Step 1: Fetch all intentions, mood logs, gratitude logs, and reflections
    const [intentions, moodLogs, gratitudeLogs, reflections] =
      await Promise.all([
        drizzleDb
          .select({
            date: intentionsTable.date,
            text: intentionsTable.intention,
          })
          .from(intentionsTable),
        drizzleDb
          .select({
            datetime: moodLogsTable.datetime,
            text: moodLogsTable.note,
          })
          .from(moodLogsTable),
        drizzleDb
          .select({
            datetime: gratitudeLogsTable.datetime,
            text: gratitudeLogsTable.content,
          })
          .from(gratitudeLogsTable),
        drizzleDb
          .select({
            datetime: reflectionsTable.datetime,
            text: reflectionsTable.content,
          })
          .from(reflectionsTable),
      ]);

    const countWords = (text: string | null | undefined): number => {
      if (!text || typeof text !== "string") {
        return 0;
      }

      return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const wordsWritten = [
      ...intentions,
      ...moodLogs,
      ...gratitudeLogs,
      ...reflections,
    ].reduce((acc, i) => acc + countWords(i.text), 0);

    set({
      counters: {
        loading: false,
        intentions: intentions.length,
        moodLogs: moodLogs.length,
        gratitudeLogs: gratitudeLogs.length,
        reflections: reflections.length,
      },
    });

    const extractDate = (dateStr: string) =>
      format(parseISO(dateStr), "yyyy-MM-dd");

    // Step 2: Extract unique date strings in "yyyy-MM-dd" format
    const dates = [
      ...intentions.map((i) => extractDate(i.date)),
      ...moodLogs.map((m) => extractDate(m.datetime)),
      ...gratitudeLogs.map((g) => extractDate(g.datetime)),
      ...reflections.map((r) => extractDate(r.datetime)),
    ];
    const uniqueDates = [...new Set(dates)].sort();

    let currentStreak = 0;
    let previousStreak = 0;

    // Step 3: Start checking streak from today
    let day = new Date();
    let dayStr = format(day, "yyyy-MM-dd");

    // Step 4: If there's no entry for today, don't count it as part of streak
    if (!uniqueDates.includes(dayStr)) {
      day = subDays(day, 1);
      dayStr = format(day, "yyyy-MM-dd");
    }

    // Step 5: Count how many consecutive days (including yesterday or today) had entries
    while (uniqueDates.includes(dayStr)) {
      currentStreak++;
      day = subDays(day, 1);
      dayStr = format(day, "yyyy-MM-dd");
    }

    // Step 6: Now calculate the most recent past streak (if current streak was restarted)
    // This is useful to show “streak broken” or “streak restarted”
    let tempStreak = 0;
    let lastSeen: string | null = null;

    // Skip the current streak dates when looking for a past one
    for (let i = uniqueDates.length - 1 - currentStreak; i >= 0; i--) {
      const current = uniqueDates[i];

      if (lastSeen) {
        // Check if current date is the day before lastSeen
        const expected = subDays(parseISO(lastSeen), 1);
        const expectedStr = format(expected, "yyyy-MM-dd");

        if (current !== expectedStr) break; // streak broken
      }

      tempStreak++;
      lastSeen = current;
    }

    if (tempStreak > 0) {
      previousStreak = tempStreak;
    }

    const lastStreak = previousStreak || 0;

    let state: StreakState = "no_streak_yet";

    if (currentStreak > 1 || (currentStreak === 1 && !lastStreak)) {
      state = "active_streak";
    } else if (currentStreak === 0 && lastStreak) {
      state = "streak_broken";
    } else if (currentStreak === 1 && lastStreak) {
      state = "streak_restarted";
    }

    // Longest streak: find longest sequence of consecutive days
    let longestStreak = 0;
    let tempLongestStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = parseISO(uniqueDates[i - 1]);
      const curr = parseISO(uniqueDates[i]);

      const diff = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diff === 1) {
        tempLongestStreak++;
        longestStreak = Math.max(longestStreak, tempLongestStreak);
      } else {
        tempLongestStreak = 1;
      }
    }

    // If there's only one date, longestStreak is 1
    if (uniqueDates.length === 1) {
      longestStreak = 1;
    }

    set({
      streak: {
        loading: false,
        longestStreak,
        currentStreak,
        lastStreak,
        state,
      },
    });
  },

  loadWeeklyProgress: async () => {
    console.log("Loading weekly progress...");

    set({
      weeklyProgress: {
        ...get().weeklyProgress,
        loading: true,
      },
    });

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
    const from = startOfDay(parseISO(weekDays[0].date)).toISOString();
    const to = endOfDay(
      parseISO(weekDays[weekDays.length - 1].date),
    ).toISOString();

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
          and(
            gte(intentionsTable.date, weekDays[0].date),
            lte(intentionsTable.date, weekDays[weekDays.length - 1].date),
          ),
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
    const data = weekDays.map((day) => {
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

      const progress =
        ((intention?.count ? 1 : 0) +
          (moodLog?.count ? 1 : 0) +
          (gratitudeLog?.count ? 1 : 0) +
          (reflection?.count ? 1 : 0)) *
        PROGRESS_MULTIPLIER;

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
        progress,
      };
    });

    set({
      weeklyProgress: {
        loading: false,
        data,
      },
    });
  },
}));
