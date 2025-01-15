import React from "react";
import { tailorsTable } from "@/db/schema";
import { StyleSheet, Text, View } from "react-native";

interface TailorCardProps {
  tailor: typeof tailorsTable.$inferSelect;
}

export default function TailorCard({ tailor }: TailorCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.mainInfoContainer}>
        <Text style={styles.text}>{tailor.name}</Text>
        <Text style={styles.text}>{tailor.phone}</Text>
      </View>
      {tailor.notes ? <Text style={styles.text}>{tailor.notes}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    borderColor: "#4552CB",
    borderWidth: 2,
    padding: 10,
    backgroundColor: "white",
  },
  mainInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 20,
  },
});
