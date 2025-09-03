import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export interface TailorFormInputs {
  name: string;
  phone?: string;
  notes?: string;
}

interface TailorFormProps {
  initialValues?: TailorFormInputs;
  onSubmit: (data: TailorFormInputs) => Promise<void>;
}

export default function TailorForm({
  initialValues,
  onSubmit,
}: TailorFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TailorFormInputs>({
    defaultValues: initialValues || {
      name: "",
      phone: "",
      notes: "",
    },
  });

  const handleFormSubmit: SubmitHandler<TailorFormInputs> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error inside tailor form:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* name */}
      <Text style={styles.label}>
        Name of tailor <Text style={styles.required}>*</Text>
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "The name of the tailor is required." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Enter tailor name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      {/* phone (optional) */}
      <Text style={styles.label}>Phone number (optional)</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Enter phone number"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {/* notes (optional) */}
      <Text style={styles.label}>Notes (optional)</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Any extra details..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {/* submit */}
      <TouchableOpacity
        onPress={handleSubmit(handleFormSubmit)}
        style={styles.submitContainer}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
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
