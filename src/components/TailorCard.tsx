import React, { useState } from "react";
import { tailorsTable } from "@/db/schema";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDatabase } from "@/src/context/DatabaseProvider";
import ModalWrapper from "@/src/components/ModalWrapper";
import { eq } from "drizzle-orm";
import TailorForm, { TailorFormInputs } from "./TailorForm";

interface TailorCardProps {
  tailor: typeof tailorsTable.$inferSelect;
  updateFunction: () => void;
}

export default function TailorCard({
  tailor,
  updateFunction,
}: TailorCardProps) {
  const { db } = useDatabase();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  async function updateTailor(data: TailorFormInputs) {
    await db
      .update(tailorsTable)
      .set(data)
      .where(eq(tailorsTable.id, tailor.id));
    setIsModalVisible(false);
    updateFunction();
  }

  async function deleteTailor() {
    setIsModalVisible(false);
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this tailor?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await db
                .delete(tailorsTable)
                .where(eq(tailorsTable.id, tailor.id));
              setIsModalVisible(false);
              updateFunction();
            } catch (error) {
              console.error("Failed to delete tailor:", error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.cardContainer}>
          <View style={styles.mainInfoContainer}>
            <Text style={styles.nameText}>{tailor.name}</Text>
            <Text style={styles.text}>{tailor.phone}</Text>
          </View>
          {tailor.notes ? (
            <Text style={styles.text}>{tailor.notes}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <ModalWrapper
        visible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      >
        <TailorForm
          onSubmit={updateTailor}
          initialValues={tailor as TailorFormInputs}
        />
        <TouchableOpacity onPress={deleteTailor} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </ModalWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    borderColor: "#4552CB",
    borderWidth: 2,
    padding: 10,
    backgroundColor: "white",
  },
  mainInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  nameText: {
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    color: "grey",
  },
  deleteButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
