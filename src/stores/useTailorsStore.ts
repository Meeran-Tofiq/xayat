import { tailorsTable } from "@/db/schema";
import { create } from "zustand";
import { TailorFormInputs } from "@/src/components/TailorForm";

type Tailor = typeof tailorsTable.$inferSelect;

interface TailorsStore {
  tailors: Tailor[];
  loading: boolean;
  init: (db: any) => void;
  refresh: () => Promise<void>;
  addTailor: (data: TailorFormInputs) => Promise<void>;
}

export const useTailorsStore = create<TailorsStore>((set, get) => {
  let db: any = null;

  return {
    tailors: [],
    loading: false,

    init: (database) => {
      db = database;
      get().refresh();
    },

    refresh: async () => {
      if (!db) return;
      set({ loading: true });
      const results = await db.select().from(tailorsTable);
      set({ tailors: results, loading: false });
    },

    addTailor: async (data) => {
      if (!db) return;

      // Convert empty strings to null for optional fields
      const normalizedData = {
        ...data,
        phone: data.phone?.trim() === "" ? null : data.phone,
        notes: data.notes?.trim() === "" ? null : data.notes,
      };

      await db.insert(tailorsTable).values(normalizedData);
      await get().refresh();
    },
  };
});
