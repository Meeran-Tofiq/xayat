import { Tabs } from "expo-router";
import { FontAwesome6 as FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <FontAwesome name={"shirt"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="tailors"
        options={{
          title: "Tailors",
          tabBarIcon: ({ color }) => (
            <FontAwesome name={"user-tie"} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
