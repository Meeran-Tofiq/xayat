import React from "react";
import { tailorsTable } from "@/db/schema";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { eq } from "drizzle-orm";
import EditableCard from "@/src/components/EditableCard";
import TailorCardView from "@/src/components/TailorCardView";
import TailorForm, { TailorFormInputs } from "./TailorForm";

type Tailor = typeof tailorsTable.$inferSelect;

export default function TailorCard({
  tailor,
  updateFunction,
}: {
  tailor: Tailor;
  updateFunction: () => void;
}) {
  const { db } = useDatabase();

  // onUpdate receives partial form values. We know which row to update by tailor.id.
  async function onUpdate(data: Partial<TailorFormInputs>) {
    // remove undefined fields for safety or cast
    const patch = { ...data } as Partial<TailorFormInputs>;
    await db
      .update(tailorsTable)
      .set(patch)
      .where(eq(tailorsTable.id, tailor.id));
  }

  async function onDelete() {
    await db.delete(tailorsTable).where(eq(tailorsTable.id, tailor.id));
  }

  return (
    <EditableCard<Tailor>
      item={tailor}
      renderContent={(t) => <TailorCardView tailor={t} />}
      FormComponent={TailorForm as any}
      onUpdate={onUpdate}
      onDelete={onDelete}
      refreshList={async () => updateFunction()}
    />
  );
}
