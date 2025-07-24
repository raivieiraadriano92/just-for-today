import { drizzleDb } from "@/db/client";
import { intentionsTable } from "@/db/schema";
import { useUserStore } from "@/features/user/store/userStore";
import { Emitter } from "@/utils/emitter";
import { ExtensionStorage } from "@bacons/apple-targets";
import { format } from "date-fns/format";
import { eq } from "drizzle-orm";
import { Platform } from "react-native";
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

const intentionWidgetStorage = new ExtensionStorage(
  "group.app.justfortoday.widgets",
);

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

      Emitter.emit("intention:created");

      set(() => ({
        todaysIntention: newRow,
      }));

      if (Platform.OS === "ios") {
        try {
          const user = useUserStore.getState().user;

          intentionWidgetStorage.set("userDisplayName", user?.name || "");
          intentionWidgetStorage.set("intention:intention", newRow.intention);
          intentionWidgetStorage.set("intention:date", newRow.date);

          ExtensionStorage.reloadWidget();
        } catch (error) {
          console.error("Failed to update intention widget storage:", error);
        }
      }
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

      Emitter.emit("intention:updated");

      const updatedRow = {
        ...todaysIntention,
        ...updatedPayload,
      };

      set(() => ({
        todaysIntention: updatedRow,
      }));

      if (Platform.OS === "ios") {
        try {
          const user = useUserStore.getState().user;

          intentionWidgetStorage.set("userDisplayName", user?.name || "");
          intentionWidgetStorage.set(
            "intention:intention",
            updatedRow.intention,
          );
          intentionWidgetStorage.set("intention:date", updatedRow.date);

          ExtensionStorage.reloadWidget();
        } catch (error) {
          console.error("Failed to update intention widget storage:", error);
        }
      }
    },
  }),
);
