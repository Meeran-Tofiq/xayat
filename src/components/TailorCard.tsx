import React, { useState } from "react";
import { tailorsTable } from "@/db/schema";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDatabase } from "@/src/context/DatabaseProvider";
import ModalWrapper from "@/src/components/ModalWrapper";
import { eq } from "drizzle-orm";

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

  async function deleteTailor() {
    await db.delete(tailorsTable).where(eq(tailorsTable.id, tailor.id));
    setIsModalVisible(false);
    updateFunction();
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.cardContainer}>
          <View style={styles.mainInfoContainer}>
            <Text style={styles.text}>{tailor.name}</Text>
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
        <TouchableOpacity onPress={deleteTailor}>
          <Text>Delete</Text>
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
  },
  text: {
    fontSize: 20,
  },
});
