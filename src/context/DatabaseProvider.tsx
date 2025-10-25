import React, { createContext, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useTailorsStore } from "@/src/stores/useTailorsStore";

// Define the type for the context value
type DatabaseContextType = {
  db: ReturnType<typeof drizzle>;
  migrationsSuccess: boolean;
};

// Create the context with a default value of `undefined` to enforce usage checks
const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

export const DatabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(db);

  if (error) {
    console.error("Database migration error:", error.message);
  }

  if (success) {
    useTailorsStore.getState().init(db);
  }

  return (
    <DatabaseContext.Provider value={{ db, migrationsSuccess: success }}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to access the database context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
