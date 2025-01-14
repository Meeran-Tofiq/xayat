import { DatabaseProvider } from "@/src/context/DatabaseProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack />
    </DatabaseProvider>
  );
}
