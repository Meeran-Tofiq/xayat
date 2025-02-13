import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

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
      notes: "",
      phone: "",
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
    <View>
      <Controller
        control={control}
        name="name"
        rules={{ required: "The name of the tailor is required." }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Name of the tailor"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Phone number of the tailor"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Notes"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

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
  container: {
    padding: 16,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  submitText: {
    textAlign: "center",
    color: "blue",
  },
  submitContainer: {},
});
