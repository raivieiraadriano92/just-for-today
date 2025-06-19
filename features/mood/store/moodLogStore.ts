import { drizzleDb } from "@/db/client";
import { moodLogsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

export type MoodType = "really_good" | "good" | "okay" | "bad" | "really_bad";

export type MoodLogRow = Omit<
  typeof moodLogsTable.$inferSelect,
  "mood" | "feelings"
> & {
  mood: MoodType;
  feelings: string[];
};

export type MoodLogPayload = Pick<
  MoodLogRow,
  "datetime" | "mood" | "feelings" | "note"
>;

type MoodLogStoreState = {
  //   data: MoodLogRow[];
};

type MoodLogStoreActions = {
  //   loadAll: (filters?: {
  //     dateRange?: { from: string; to: string };
  //   }) => Promise<void>;

  insert: (payload: MoodLogPayload) => Promise<void>;
  updateById: (id: string, payload: MoodLogPayload) => Promise<void>;
  deleteById: (id: string) => Promise<void>;
};

export type MoodLogStore = MoodLogStoreState & MoodLogStoreActions;

export const useMoodLogStore = create<MoodLogStore>()((set, get) => ({
  data: [],

  //   loadAll: async (filters) => {
  //     const data = await drizzleDb
  //       .select()
  //       .from(moodLogsTable)
  //       .where(() => {
  //         const from = filters?.dateRange?.from;
  //         const to = filters?.dateRange?.to;

  //         if (!from && !to) {
  //           return undefined;
  //         }

  //         if (from && to) {
  //           return and(
  //             gte(moodLogsTable.date, from),
  //             lte(moodLogsTable.date, to),
  //           );
  //         }

  //         if (from) {
  //           return gte(moodLogsTable.date, from);
  //         }

  //         if (to) {
  //           return lte(moodLogsTable.date, to);
  //         }
  //       })
  //       .orderBy(desc(moodLogsTable.date), desc(moodLogsTable.time));

  //     set({
  //       data: data.map((row) => ({
  //         ...row,
  //         mood: row.mood as MoodLogRow["mood"],
  //         feelings: row.feelings ? row.feelings.split(",") : [],
  //       })),
  //     });
  //   },

  insert: async (payload) => {
    const newRow: MoodLogRow = {
      ...payload,
      id: randomUUID(),

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await drizzleDb
      .insert(moodLogsTable)
      .values({ ...newRow, feelings: newRow.feelings.join(",") });

    // set((state) => ({
    //   data: [newRow, ...state.data],
    // }));
  },
  updateById: async (id, payload) => {
    const updatedPayload = { ...payload, updatedAt: new Date().toISOString() };

    await drizzleDb
      .update(moodLogsTable)
      .set({ ...updatedPayload, feelings: updatedPayload.feelings.join(",") })
      .where(eq(moodLogsTable.id, id));

    // set((state) => ({
    //   data: state.data.map((row) =>
    //     row.id === id ? { ...row, ...updatedPayload } : row,
    //   ),
    // }));
  },
  deleteById: async (id) => {
    await drizzleDb.delete(moodLogsTable).where(eq(moodLogsTable.id, id));

    // set((state) => ({
    //   data: state.data.filter((row) => row.id !== id),
    // }));
  },
}));
