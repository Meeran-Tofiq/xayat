import { DatabaseProvider } from "@/src/context/DatabaseProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </DatabaseProvider>
  );
}
