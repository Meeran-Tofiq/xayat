import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 as FontAwesome } from "@expo/vector-icons";

export default function TaskActions({
  hasTailors,
  onAddTask,
  onToggleFilters,
}: {
  hasTailors: boolean;
  onAddTask: () => void;
  onToggleFilters: () => void;
}) {
  return (
    <View style={styles.actionsRow}>
      {hasTailors && (
        <>
          <TouchableOpacity
            style={[styles.addTaskButton, { flex: 1 }]}
            onPress={onAddTask}
          >
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onToggleFilters}
          >
            <FontAwesome name="filter" size={18} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addTaskButton: {
    backgroundColor: "#4552CB",
    padding: 10,
    borderRadius: 10,
  },
  addTaskButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  filterButton: {
    backgroundColor: "#bbb",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  warningText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
