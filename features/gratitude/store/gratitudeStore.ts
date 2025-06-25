import { drizzleDb } from "@/db/client";
import { gratitudeLogsTable } from "@/db/schema";
import { Emitter } from "@/utils/emitter";
import { eq } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

export type GratitudeLogRow = Omit<
  typeof gratitudeLogsTable.$inferSelect,
  "images"
> & {
  images: string[]; // Store images as a comma-separated string in the database
};

export type GratitudeLogPayload = Pick<
  GratitudeLogRow,
  "datetime" | "content" | "images"
>;

type GratitudeLogStoreState = {
  //   data: GratitudeLogRow[];
};

type GratitudeLogStoreActions = {
  //   loadAll: (filters?: {
  //     dateRange?: { from: string; to: string };
  //   }) => Promise<void>;

  insert: (payload: GratitudeLogPayload) => Promise<{ id: string }>;
  updateById: (id: string, payload: GratitudeLogPayload) => Promise<void>;
  deleteById: (id: string) => Promise<void>;
};

export type GratitudeLogStore = GratitudeLogStoreState &
  GratitudeLogStoreActions;

export const useGratitudeLogStore = create<GratitudeLogStore>()((set, get) => ({
  // data: [],

  // loadAll: async (filters) => {
  //   const data = await drizzleDb
  //     .select()
  //     .from(gratitudeLogsTable)
  //     .where(() => {
  //       const from = filters?.dateRange?.from;
  //       const to = filters?.dateRange?.to;

  //       if (!from && !to) {
  //         return undefined;
  //       }

  //       if (from && to) {
  //         return and(
  //           gte(gratitudeLogsTable.date, from),
  //           lte(gratitudeLogsTable.date, to),
  //         );
  //       }

  //       if (from) {
  //         return gte(gratitudeLogsTable.date, from);
  //       }

  //       if (to) {
  //         return lte(gratitudeLogsTable.date, to);
  //       }
  //     })
  //     .orderBy(desc(gratitudeLogsTable.date), desc(gratitudeLogsTable.time));

  //   set({
  //     data,
  //   });
  // },

  insert: async (payload) => {
    const id = randomUUID();

    const newRow: GratitudeLogRow = {
      ...payload,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await drizzleDb
      .insert(gratitudeLogsTable)
      .values({ ...newRow, images: payload.images.join(",") });

    Emitter.emit("gratitudeLog:created");

    //   set((state) => ({
    //     data: [...newRows, ...state.data],
    //   }));

    return { id };
  },
  updateById: async (id, payload) => {
    const updatedPayload = {
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    await drizzleDb
      .update(gratitudeLogsTable)
      .set({ ...updatedPayload, images: payload.images.join(",") })
      .where(eq(gratitudeLogsTable.id, id));

    Emitter.emit("gratitudeLog:updated");

    //   set((state) => ({
    //     data: state.data.map((row) =>
    //       row.id === id ? { ...row, ...updatedPayload } : row,
    //     ),
    //   }));
  },
  deleteById: async (id) => {
    await drizzleDb
      .delete(gratitudeLogsTable)
      .where(eq(gratitudeLogsTable.id, id));

    Emitter.emit("gratitudeLog:deleted");

    //   set((state) => ({
    //     data: state.data.filter((row) => row.id !== id),
    //   }));
  },
}));
