import { create } from "zustand";
import { and, eq, gte, lte, like } from "drizzle-orm";
import { tasksTable, tailorsTable } from "@/db/schema";
import { TaskFiltersState } from "@/src/components/TaskFilters";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

type TaskWithTailor = typeof tasksTable.$inferSelect & {
  tailorName: string | null;
};

type TasksState = {
  tasks: TaskWithTailor[];
  loading: boolean;
  filters: TaskFiltersState;
  setFilters: (filters: TaskFiltersState) => void;
  refresh: () => Promise<void>;
  addTask: (data: typeof tasksTable.$inferInsert) => Promise<void>;
};

// Open your DB instance once
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,
  filters: {},

  setFilters: (filters) => set({ filters }),

  refresh: async () => {
    const { filters } = get();
    set({ loading: true });

    const conds: any[] = [];
    if (filters.metersMin !== undefined)
      conds.push(gte(tasksTable.meters, filters.metersMin));
    if (filters.metersMax !== undefined)
      conds.push(lte(tasksTable.meters, filters.metersMax));
    if (filters.design)
      conds.push(like(tasksTable.design, `%${filters.design}%`));
    if (filters.payed !== undefined)
      conds.push(eq(tasksTable.payed, filters.payed));
    if (filters.completed !== undefined)
      conds.push(eq(tasksTable.completed, filters.completed));
    if (filters.orderReceivedMin)
      conds.push(gte(tasksTable.orderReceived, filters.orderReceivedMin));
    if (filters.orderReceivedMax)
      conds.push(lte(tasksTable.orderReceived, filters.orderReceivedMax));
    if (filters.color) conds.push(like(tasksTable.color, `%${filters.color}%`));
    if (filters.tailorId !== undefined)
      conds.push(eq(tasksTable.tailorId, filters.tailorId));

    const results = (await db
      .select({
        id: tasksTable.id,
        design: tasksTable.design,
        meters: tasksTable.meters,
        payed: tasksTable.payed,
        completed: tasksTable.completed,
        orderReceived: tasksTable.orderReceived,
        color: tasksTable.color,
        tailorId: tasksTable.tailorId,
        tailorName: tailorsTable.name,
      })
      .from(tasksTable)
      .leftJoin(tailorsTable, eq(tasksTable.tailorId, tailorsTable.id))
      .where(conds.length ? and(...conds) : undefined)) as TaskWithTailor[];

    set({ tasks: results, loading: false });
  },

  addTask: async (data) => {
    const { refresh } = get();
    await db.insert(tasksTable).values(data);
    await refresh();
  },
}));
