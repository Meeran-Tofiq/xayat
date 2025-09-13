import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";

export type TaskFiltersState = {
  metersMin?: number;
  metersMax?: number;
  design?: string;
  payed?: boolean; // undefined = don't filter, true or false = filter
  completed?: boolean; // same
  orderReceivedMin?: string; // YYYY-MM-DD
  orderReceivedMax?: string; // YYYY-MM-DD
  color?: string;
  tailorId?: number;
};

export default function TaskFilters({
  filters,
  onChangeFilters,
  onReset,
}: {
  filters: TaskFiltersState;
  onChangeFilters: (f: TaskFiltersState) => void;
  onReset: () => void;
}) {
  const { db } = useDatabase();
  const [tailors, setTailors] = useState<(typeof tailorsTable.$inferSelect)[]>(
    [],
  );

  // local UI state for date pickers show/hide
  const [showMinDatePicker, setShowMinDatePicker] = useState(false);
  const [showMaxDatePicker, setShowMaxDatePicker] = useState(false);

  useEffect(() => {
    async function loadTailors() {
      const results = await db.select().from(tailorsTable);
      setTailors(results);
    }
    loadTailors();
  }, [db]);

  function set<K extends keyof TaskFiltersState>(
    key: K,
    value: TaskFiltersState[K],
  ) {
    onChangeFilters({ ...filters, [key]: value });
  }

  // map picker string values -> boolean | undefined
  function boolFromPickerVal(v: string | undefined) {
    if (v === "any" || v === undefined) return undefined;
    return v === "true";
  }

  function pickerValFromBool(b?: boolean) {
    if (b === undefined) return "any";
    return b ? "true" : "false";
  }

  return (
    <View style={styles.container}>
      {/* meters min / max */}
      <Text style={styles.label}>Meters (min)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Minimum meters (>=)"
        value={filters.metersMin?.toString() ?? ""}
        onChangeText={(txt) =>
          set("metersMin", txt.trim() === "" ? undefined : Number(txt))
        }
      />

      <Text style={styles.label}>Meters (max)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Maximum meters (<=)"
        value={filters.metersMax?.toString() ?? ""}
        onChangeText={(txt) =>
          set("metersMax", txt.trim() === "" ? undefined : Number(txt))
        }
      />

      {/* design */}
      <Text style={styles.label}>Design</Text>
      <TextInput
        style={styles.input}
        placeholder="Search design"
        value={filters.design ?? ""}
        onChangeText={(txt) =>
          set("design", txt.trim() === "" ? undefined : txt)
        }
      />

      {/* payed - tri-state picker (Any / Yes / No) */}
      <Text style={styles.label}>Paid</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={pickerValFromBool(filters.payed)}
          onValueChange={(val) =>
            set("payed", boolFromPickerVal(val as string))
          }
        >
          <Picker.Item label="Any" value="any" />
          <Picker.Item label="Yes" value="true" />
          <Picker.Item label="No" value="false" />
        </Picker>
      </View>

      {/* completed */}
      <Text style={styles.label}>Completed</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={pickerValFromBool(filters.completed)}
          onValueChange={(val) =>
            set("completed", boolFromPickerVal(val as string))
          }
        >
          <Picker.Item label="Any" value="any" />
          <Picker.Item label="Yes" value="true" />
          <Picker.Item label="No" value="false" />
        </Picker>
      </View>

      {/* orderReceived min/max (dates) */}
      <Text style={styles.label}>Received after (min)</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowMinDatePicker(true)}
      >
        <Text>{filters.orderReceivedMin ?? "Select date (min)"}</Text>
      </TouchableOpacity>
      {showMinDatePicker && (
        <DateTimePicker
          value={
            filters.orderReceivedMin
              ? new Date(filters.orderReceivedMin)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            setShowMinDatePicker(false);
            if (selected) {
              // normalize to YYYY-MM-DD
              set("orderReceivedMin", selected.toISOString().split("T")[0]);
            }
          }}
        />
      )}

      <Text style={styles.label}>Received before (max)</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowMaxDatePicker(true)}
      >
        <Text>{filters.orderReceivedMax ?? "Select date (max)"}</Text>
      </TouchableOpacity>
      {showMaxDatePicker && (
        <DateTimePicker
          value={
            filters.orderReceivedMax
              ? new Date(filters.orderReceivedMax)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selected) => {
            setShowMaxDatePicker(false);
            if (selected) {
              set("orderReceivedMax", selected.toISOString().split("T")[0]);
            }
          }}
        />
      )}

      {/* color */}
      <Text style={styles.label}>Color</Text>
      <TextInput
        style={styles.input}
        placeholder="Search color"
        value={filters.color ?? ""}
        onChangeText={(txt) =>
          set("color", txt.trim() === "" ? undefined : txt)
        }
      />

      {/* tailor picker (optional, default is undefined) */}
      <Text style={styles.label}>Tailor</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={filters.tailorId}
          onValueChange={(val) =>
            set("tailorId", val === undefined ? undefined : (val as any))
          }
        >
          <Picker.Item label="Select a tailor..." value={undefined} />
          {tailors.map((t) => (
            <Picker.Item key={t.id} label={t.name} value={t.id} />
          ))}
        </Picker>
      </View>

      {/* Reset filters */}
      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
  },
  pickerWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  dateButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  resetButton: {
    marginTop: 8,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#333",
    fontWeight: "700",
  },
});
