import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";

export interface TaskFormInputs {
  meters: number;
  design: string;
  payed: boolean;
  orderReceived: string;
  orderDueDate: string;
  tailorId: number;
}

interface TaskFormProps {
  initialValues?: TaskFormInputs;
  onSubmit: (data: TaskFormInputs) => Promise<void>;
}

export default function TaskForm({ initialValues, onSubmit }: TaskFormProps) {
  const { db } = useDatabase();
  const [tailors, setTailors] = useState<(typeof tailorsTable.$inferSelect)[]>(
    [],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    defaultValues: initialValues || {
      meters: undefined,
      design: "",
      payed: false,
      orderReceived: new Date().toISOString().split("T")[0], // default today
      orderDueDate: new Date().toISOString().split("T")[0], // default today
      tailorId: undefined,
    },
  });

  useEffect(() => {
    async function fetchTailors() {
      const results = await db.select().from(tailorsTable);
      setTailors(results);
    }
    fetchTailors();
  }, [db]);

  const handleFormSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error inside task form:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* meters */}
      <Text style={styles.label}>
        Meters of fabric <Text style={styles.required}>*</Text>
      </Text>
      <Controller
        control={control}
        name="meters"
        rules={{ required: "Meters is required." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="Enter meters"
            onBlur={onBlur}
            onChangeText={(text) => onChange(Number(text))}
            value={value?.toString()}
          />
        )}
      />
      {errors.meters && (
        <Text style={styles.error}>{errors.meters.message}</Text>
      )}

      {/* design */}
      <Text style={styles.label}>
        Design description <Text style={styles.required}>*</Text>
      </Text>
      <Controller
        control={control}
        name="design"
        rules={{ required: "Design is required." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Enter design details"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.design && (
        <Text style={styles.error}>{errors.design.message}</Text>
      )}

      {/* payed */}
      <Controller
        control={control}
        name="payed"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Paid?</Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />

      {/* orderReceived */}
      <Text style={styles.label}>
        Order received date <Text style={styles.required}>*</Text>
      </Text>
      <Controller
        control={control}
        name="orderReceived"
        rules={{ required: "Order received date is required." }}
        render={({ field: { onChange, value } }) => {
          const [showPicker, setShowPicker] = useState(false);
          return (
            <View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text>{value || "Select date"}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      onChange(selectedDate.toISOString().split("T")[0]);
                    }
                  }}
                />
              )}
            </View>
          );
        }}
      />
      {errors.orderReceived && (
        <Text style={styles.error}>{errors.orderReceived.message}</Text>
      )}

      {/* orderDueDate */}
      <Text style={styles.label}>
        Order due date <Text style={styles.required}>*</Text>
      </Text>
      <Controller
        control={control}
        name="orderDueDate"
        rules={{ required: "Order due date is required." }}
        render={({ field: { onChange, value } }) => {
          const [showPicker, setShowPicker] = useState(false);
          return (
            <View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text>{value || "Select date"}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      onChange(selectedDate.toISOString().split("T")[0]);
                    }
                  }}
                />
              )}
            </View>
          );
        }}
      />
      {errors.orderDueDate && (
        <Text style={styles.error}>{errors.orderDueDate.message}</Text>
      )}

      {/* tailorId */}
      <Text style={styles.label}>
        Tailor <Text style={styles.required}>*</Text>
      </Text>
      <Controller
        control={control}
        name="tailorId"
        rules={{ required: "Tailor is required." }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
            >
              <Picker.Item label="Select a tailor..." value={undefined} />
              {tailors.map((tailor) => (
                <Picker.Item
                  key={tailor.id}
                  label={tailor.name}
                  value={tailor.id}
                />
              ))}
            </Picker>
          </View>
        )}
      />
      {errors.tailorId && (
        <Text style={styles.error}>{errors.tailorId.message}</Text>
      )}

      {/* submit */}
      <TouchableOpacity
        onPress={handleSubmit(handleFormSubmit)}
        style={styles.submitContainer}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: "600", marginBottom: 4 },
  required: { color: "red" },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  dateButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  error: { color: "red", marginBottom: 8 },
  submitText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  submitContainer: {
    padding: 12,
    backgroundColor: "#4552CB",
    borderRadius: 6,
    marginTop: 8,
  },
});
