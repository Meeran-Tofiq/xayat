import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { tasksTable } from "@/db/schema";

type Task = typeof tasksTable.$inferSelect & { tailorName: string };

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // fallback
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
}

export default function TaskCardView({ task }: { task: Task }) {
  const rows: { left: string; right: string }[] = [
    {
      left: `Received: ${formatDate(task.orderReceived)}`,
      right: `Length: ${task.meters}m`,
    },
    {
      left: `Paid: ${task.payed ? "Yes" : "No"}`,
      right: `Completed: ${task.completed ? "Yes" : "No"}`,
    },
    { left: `Color: ${task.color}`, right: "" },
  ];

  return (
    <View style={styles.card}>
      {/* Header row: Tailor | Design */}
      <View style={styles.headerRow}>
        <Text style={styles.headerLeft}>{task.tailorName}</Text>
        <Text style={styles.headerRight}>{task.design}</Text>
      </View>

      {/* Detail rows */}
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.detail}>{row.left}</Text>
          {row.right ? <Text style={styles.detail}>{row.right}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerLeft: {
    fontWeight: "bold",
    fontSize: 16,
  },
  headerRight: {
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#333",
  },
});
