import { useState, useEffect, useCallback } from "react";
import { and, eq, gte, lte, like } from "drizzle-orm";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tasksTable, tailorsTable } from "@/db/schema";
import { TaskFiltersState } from "@/src/components/TaskFilters";

export function useTasks(filters: TaskFiltersState = {}) {
  const { db } = useDatabase();
  const [tasks, setTasks] = useState<
    (typeof tasksTable.$inferSelect & { tailorName: string | null })[]
  >([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);

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
      .where(conds.length ? and(...conds) : undefined)) as (
      | typeof tasksTable.$inferSelect
      | { tailorName: string | null }
    )[];

    setTasks(results as any);
    setLoading(false);
  }, [db, filters]);

  const addTask = useCallback(
    async (data: typeof tasksTable.$inferInsert) => {
      await db.insert(tasksTable).values(data);
      await refresh();
    },
    [db, refresh],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tasks, loading, refresh, addTask };
}
