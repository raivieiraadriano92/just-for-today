import { drizzleDb } from "@/db/client";
import { intentionsTable } from "@/db/schema";
import { Emitter } from "@/utils/emitter";
import { format } from "date-fns/format";
import { eq } from "drizzle-orm";
import { create } from "zustand";

export type IntentionRow = typeof intentionsTable.$inferSelect;

export type IntentionPayload = Pick<IntentionRow, "intention">;

type TodaysIntentionStoreState = {
  todaysIntention: IntentionRow | null;
};

type TodaysIntentionStoreActions = {
  loadTodaysIntention: () => Promise<void>;

  insertTodaysIntention: (payload: IntentionPayload) => Promise<void>;

  updateTodaysIntention: (payload: IntentionPayload) => Promise<void>;
};

export type TodaysIntentionStore = TodaysIntentionStoreState &
  TodaysIntentionStoreActions;

export const useTodaysIntentionStore = create<TodaysIntentionStore>()(
  (set, get) => ({
    todaysIntention: null,

    loadTodaysIntention: async () => {
      const today = format(new Date(), "yyyy-MM-dd");

      const data = await drizzleDb
        .select()
        .from(intentionsTable)
        .where(eq(intentionsTable.date, today))
        .limit(1);

      set({
        todaysIntention: data.length > 0 ? data[0] : null,
      });
    },

    insertTodaysIntention: async (payload) => {
      const today = format(new Date(), "yyyy-MM-dd");

      // Check if an intention for the date already exists
      const existingIntention = await drizzleDb
        .select()
        .from(intentionsTable)
        .where(eq(intentionsTable.date, today))
        .limit(1);

      if (existingIntention.length > 0) {
        throw new Error("An intention for the date already exists.");
      }

      const newRow: IntentionRow = {
        ...payload,
        date: today,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await drizzleDb.insert(intentionsTable).values(newRow);

      Emitter.emit("intention:changed", { type: "insert" });

      set(() => ({
        todaysIntention: newRow,
      }));
    },

    updateTodaysIntention: async (payload) => {
      const updatedPayload = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      const todaysIntention = get().todaysIntention;

      if (!todaysIntention) {
        throw new Error("No daily intention to update.");
      }

      await drizzleDb
        .update(intentionsTable)
        .set(updatedPayload)
        .where(eq(intentionsTable.date, todaysIntention.date));

      Emitter.emit("intention:changed", { type: "update" });

      set(() => ({
        todaysIntention: {
          ...todaysIntention,
          ...updatedPayload,
        },
      }));
    },
  }),
);
