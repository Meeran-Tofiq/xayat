import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  View,
} from "react-native";
import TaskForm from "@/src/components/TaskForm";
import ModalWrapper from "@/src/components/ModalWrapper";
import TaskCard from "@/src/components/TaskCard";
import TaskFilters, { TaskFiltersState } from "@/src/components/TaskFilters";
import { useTasks } from "@/src/hooks/useTasks";
import TaskActions from "@/src/components/TaskActions";
import { useTailorsStore } from "@/src/stores/useTailorsStore";

export default function TasksScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersState>({});

  const { tasks, refresh, addTask } = useTasks(filters);
  const { tailors, refresh: refreshTailors } = useTailorsStore();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={async () => {
            await refresh();
            await refreshTailors();
          }}
        />
      }
    >
      <TaskActions
        hasTailors={tailors.length > 0}
        onAddTask={() => setIsModalVisible(true)}
        onToggleFilters={() => setShowFilters((s) => !s)}
      />

      {tailors.length === 0 && (
        <Text style={styles.warningText}>
          ⚠️ You cannot add a task until you have added at least one tailor.
        </Text>
      )}

      {showFilters && (
        <TaskFilters
          filters={filters}
          onChangeFilters={(f) => setFilters(f)}
          onReset={() => setFilters({})}
        />
      )}

      {tasks.map((task) => (
        <View key={task.id} style={{ marginBottom: 8 }}>
          <TaskCard task={task as any} updateFunction={refresh} />
        </View>
      ))}

      {tailors.length > 0 && (
        <ModalWrapper
          visible={isModalVisible}
          closeModal={() => setIsModalVisible(false)}
        >
          <TaskForm
            onSubmit={async (data) => {
              await addTask(data);
              setIsModalVisible(false);
            }}
          />
        </ModalWrapper>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 10 },
  warningText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
