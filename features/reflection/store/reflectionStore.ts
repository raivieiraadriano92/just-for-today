import { drizzleDb } from "@/db/client";
import { reflectionsTable } from "@/db/schema";
import { Emitter } from "@/utils/emitter";
import { eq } from "drizzle-orm";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";

export type ReflectionRow = typeof reflectionsTable.$inferSelect;

export type ReflectionPayload = Pick<ReflectionRow, "datetime" | "content"> & {
  images: string[];
};

type ReflectionStoreState = {
  //   data: ReflectionRow[];
};

type ReflectionStoreActions = {
  //   loadAll: (filters?: {
  //     dateRange?: { from: string; to: string };
  //   }) => Promise<void>;

  insert: (payload: ReflectionPayload) => Promise<{ id: string }>;
  updateById: (id: string, payload: ReflectionPayload) => Promise<void>;
  deleteById: (id: string) => Promise<void>;
};

export type ReflectionStore = ReflectionStoreState & ReflectionStoreActions;

export const useReflectionStore = create<ReflectionStore>()((set, get) => ({
  // data: [],

  // loadAll: async (filters) => {
  //   const data = await drizzleDb
  //     .select()
  //     .from(reflectionsTable)
  //     .where(() => {
  //       const from = filters?.dateRange?.from;
  //       const to = filters?.dateRange?.to;

  //       if (!from && !to) {
  //         return undefined;
  //       }

  //       if (from && to) {
  //         return and(
  //           gte(reflectionsTable.date, from),
  //           lte(reflectionsTable.date, to),
  //         );
  //       }

  //       if (from) {
  //         return gte(reflectionsTable.date, from);
  //       }

  //       if (to) {
  //         return lte(reflectionsTable.date, to);
  //       }
  //     })
  //     .orderBy(desc(reflectionsTable.date), desc(reflectionsTable.time));

  //   set({
  //     data,
  //   });
  // },

  insert: async (payload) => {
    const id = randomUUID();

    const newRow: ReflectionRow = {
      ...payload,
      id,
      images: payload.images.join(","),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await drizzleDb.insert(reflectionsTable).values(newRow);

    Emitter.emit("reflection:changed", { type: "insert" });

    //   set((state) => ({
    //     data: [...newRows, ...state.data],
    //   }));

    return { id };
  },
  updateById: async (id, payload) => {
    const updatedPayload = {
      ...payload,
      images: payload.images.join(","),
      updatedAt: new Date().toISOString(),
    };

    await drizzleDb
      .update(reflectionsTable)
      .set(updatedPayload)
      .where(eq(reflectionsTable.id, id));

    Emitter.emit("reflection:changed", { type: "update" });

    //   set((state) => ({
    //     data: state.data.map((row) =>
    //       row.id === id ? { ...row, ...updatedPayload } : row,
    //     ),
    //   }));
  },
  deleteById: async (id) => {
    await drizzleDb.delete(reflectionsTable).where(eq(reflectionsTable.id, id));

    Emitter.emit("reflection:changed", { type: "delete" });

    //   set((state) => ({
    //     data: state.data.filter((row) => row.id !== id),
    //   }));
  },
}));
