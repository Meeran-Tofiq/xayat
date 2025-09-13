import { useState, useEffect, useCallback } from "react";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";
import { TailorFormInputs } from "@/src/components/TailorForm";

export function useTailors() {
  const { db } = useDatabase();
  const [tailors, setTailors] = useState<(typeof tailorsTable.$inferSelect)[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const results = await db.select().from(tailorsTable);
    setTailors(results);
    setLoading(false);
  }, [db]);

  const addTailor = useCallback(
    async (data: TailorFormInputs) => {
      await db.insert(tailorsTable).values(data);
      await refresh();
    },
    [db, refresh],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tailors, loading, refresh, addTailor };
}
