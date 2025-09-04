import React from "react";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditableCard from "@/src/components/EditableCard";
import TaskCardView from "@/src/components/TaskCardView";
import TaskForm from "@/src/components/TaskForm";

type Task = typeof tasksTable.$inferSelect & { tailorName: string };

export default function TaskCard({
  task,
  updateFunction,
}: {
  task: Task;
  updateFunction: () => Promise<void>;
}) {
  const { db } = useDatabase();

  // called when the form inside the modal submits (edit)
  async function onUpdate(data: Partial<typeof tasksTable.$inferInsert>) {
    // keep only provided fields (drizzle will ignore undefined usually, but safe)
    const patch: Partial<typeof tasksTable.$inferInsert> = {
      ...(data as Partial<typeof tasksTable.$inferInsert>),
    };
    await db
      .update(tasksTable)
      .set(patch as any)
      .where(eq(tasksTable.id, task.id));
  }

  // called when user confirms delete
  async function onDelete() {
    await db.delete(tasksTable).where(eq(tasksTable.id, task.id));
  }

  return (
    <EditableCard<Task>
      item={task}
      renderContent={(t) => <TaskCardView task={t} />}
      FormComponent={TaskForm as any}
      onUpdate={onUpdate}
      onDelete={onDelete}
      refreshList={updateFunction}
    />
  );
}
