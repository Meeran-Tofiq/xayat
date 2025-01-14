import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";

export default function UserScreen() {
  const { db } = useDatabase();
  const [tailors, setUsers] = useState<(typeof tailorsTable.$inferSelect)[]>(
    [],
  );

  useEffect(() => {
    (async () => {
      const results = await db.select().from(tailorsTable);
      setUsers(results);
    })();
  }, [db]);

  return (
    <View>
      {tailors.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
