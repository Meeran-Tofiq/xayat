import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDatabase } from "../context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";

interface TailorFormInputs {
  name: string;
  phone?: string;
  notes?: string;
}

export default function TailorForm() {
  const { db } = useDatabase();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TailorFormInputs>();

  const handleFormSubmit: SubmitHandler<TailorFormInputs> = async (data) => {
    try {
      await db.insert(tailorsTable).values(data);
      console.log("Tailor added successfully:", data);
    } catch (error) {
      console.error("Error adding tailor:", error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        name="name"
        rules={{ required: "You must enter the name of the tailor" }}
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

      <Button title="Submit" onPress={handleSubmit(handleFormSubmit)} />
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
});
