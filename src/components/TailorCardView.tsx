import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { tailorsTable } from "@/db/schema";

type Tailor = typeof tailorsTable.$inferSelect;

function formatPhoneNumber(phone: string | null) {
  if (!phone) return "";
  if (phone.length !== 11) return phone;

  const part1 = phone.substring(0, 4);
  const part2 = phone.substring(4, 7);
  const part3 = phone.substring(7, 11);
  return `${part1} ${part2} ${part3}`;
}

export default function TailorCardView({ tailor }: { tailor: Tailor }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.mainInfoContainer}>
        <Text style={styles.nameText}>{tailor.name}</Text>
        <Text style={styles.text}>{formatPhoneNumber(tailor.phone)}</Text>
      </View>
      {tailor.notes ? <Text style={styles.text}>{tailor.notes}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    elevation: 3,
    margin: 4,
  },
  mainInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  nameText: { fontSize: 20 },
  text: { fontSize: 16, color: "grey" },
});
