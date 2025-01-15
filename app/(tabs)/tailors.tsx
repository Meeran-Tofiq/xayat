import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";
import TailorCard from "@/src/components/TailorCard";

export default function UserScreen() {
  const { db } = useDatabase();
  const [tailors, setTailors] = useState<(typeof tailorsTable.$inferSelect)[]>(
    [],
  );

  useEffect(() => {
    (async () => {
      const results = await db.select().from(tailorsTable);
      setTailors(results);
    })();
  }, [db]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {tailors.map((tailor) => (
          <TailorCard tailor={tailor} key={tailor.id} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
