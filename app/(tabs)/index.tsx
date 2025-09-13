import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  View,
} from "react-native";
import { and, eq, gte, lte, like } from "drizzle-orm";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tasksTable, tailorsTable } from "@/db/schema";
import TaskForm from "@/src/components/TaskForm";
import ModalWrapper from "@/src/components/ModalWrapper";
import TaskCard from "@/src/components/TaskCard";
import TaskFilters, { TaskFiltersState } from "@/src/components/TaskFilters";
import { FontAwesome6 as FontAwesome } from "@expo/vector-icons";

export default function TasksScreen() {
  const { db } = useDatabase();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState<
    (typeof tasksTable.$inferSelect & { tailorName: string | null })[]
  >([]);
  const [hasTailors, setHasTailors] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersState>({});

  async function addTask(data: typeof tasksTable.$inferInsert) {
    setIsModalVisible(false);
    await db.insert(tasksTable).values(data);
    await refreshAll();
  }

  async function updateListOfTasks() {
    const conds: any[] = [];

    // metersMin/meterMax inclusive
    if (filters.metersMin !== undefined)
      conds.push(gte(tasksTable.meters, filters.metersMin));
    if (filters.metersMax !== undefined)
      conds.push(lte(tasksTable.meters, filters.metersMax));

    // design (partial text search)
    if (filters.design)
      conds.push(like(tasksTable.design, `%${filters.design}%`));

    // payed/completed
    if (filters.payed !== undefined)
      conds.push(eq(tasksTable.payed, filters.payed));
    if (filters.completed !== undefined)
      conds.push(eq(tasksTable.completed, filters.completed));

    // orderReceived min/max (strings YYYY-MM-DD — string compare works)
    if (filters.orderReceivedMin)
      conds.push(gte(tasksTable.orderReceived, filters.orderReceivedMin));
    if (filters.orderReceivedMax)
      conds.push(lte(tasksTable.orderReceived, filters.orderReceivedMax));

    // color partial match
    if (filters.color) conds.push(like(tasksTable.color, `%${filters.color}%`));

    // tailor exact match
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
  }

  async function checkTailors() {
    const results = await db.select().from(tailorsTable).limit(1);
    setHasTailors(results.length > 0);
  }

  // refresh function
  async function refreshAll() {
    setRefreshing(true);
    await Promise.all([updateListOfTasks(), checkTailors()]);
    setRefreshing(false);
  }

  // whenever db or filters change, refresh list (keeps filters active even when hidden)
  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, filters]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshAll} />
      }
    >
      <View style={styles.actionsRow}>
        {hasTailors ? (
          <TouchableOpacity
            style={[styles.addTaskButton, { flex: 1 }]}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.warningText}>
            ⚠️ You cannot add a task until you have added at least one tailor.
          </Text>
        )}

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters((s) => !s)}
        >
          <FontAwesome name="filter" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <TaskFilters
          filters={filters}
          onChangeFilters={(f) => setFilters(f)}
          onReset={() => setFilters({})}
        />
      )}

      {/* list */}
      {tasks.map((task) => (
        <View key={task.id} style={{ marginBottom: 8 }}>
          <TaskCard task={task as any} updateFunction={updateListOfTasks} />
        </View>
      ))}

      {/* Add modal */}
      {hasTailors && (
        <ModalWrapper
          visible={isModalVisible}
          closeModal={() => setIsModalVisible(false)}
        >
          <TaskForm onSubmit={addTask} />
        </ModalWrapper>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addTaskButton: {
    backgroundColor: "#4552CB",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
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
    margin: 10,
    marginRight: 0,
  },
  warningText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
