import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { eq } from "drizzle-orm"; // make sure to import eq
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tasksTable, tailorsTable } from "@/db/schema";
import TaskForm, { TaskFormInputs } from "@/src/components/TaskForm";
import ModalWrapper from "@/src/components/ModalWrapper";
import TaskCard from "@/src/components/TaskCard";

export default function TasksScreen() {
  const { db } = useDatabase();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState<
    (typeof tasksTable.$inferSelect & {
      tailorName: string;
    })[]
  >([]);
  const [hasTailors, setHasTailors] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function addTask(data: TaskFormInputs) {
    setIsModalVisible(false);
    await db.insert(tasksTable).values(data);
    await refreshAll();
  }

  async function updateListOfTasks() {
    const results: (typeof tasksTable.$inferSelect & {
      tailorName: string;
    })[] = (await db
      .select({
        id: tasksTable.id,
        design: tasksTable.design,
        meters: tasksTable.meters,
        payed: tasksTable.payed,
        orderReceived: tasksTable.orderReceived,
        orderDueDate: tasksTable.orderDueDate,
        tailorId: tasksTable.tailorId,
        // wrap this in sql<string | null> so type is correct for left join
        tailorName: tailorsTable.name,
      })
      .from(tasksTable)
      .leftJoin(
        tailorsTable,
        eq(tasksTable.tailorId, tailorsTable.id),
      )) as (typeof tasksTable.$inferSelect & {
      tailorName: string;
    })[];

    setTasks(results);
  }

  async function checkTailors() {
    const results = await db.select().from(tailorsTable).limit(1);
    setHasTailors(results.length > 0);
  }

  async function refreshAll() {
    setRefreshing(true);
    await Promise.all([updateListOfTasks(), checkTailors()]);
    setRefreshing(false);
  }

  useEffect(() => {
    refreshAll();
  }, [db]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshAll} />
      }
    >
      {hasTailors ? (
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addTaskButtonText}>Add Task</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.warningText}>
          ⚠️ You cannot add a task until you have added at least one tailor.
        </Text>
      )}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

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
  warningText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
