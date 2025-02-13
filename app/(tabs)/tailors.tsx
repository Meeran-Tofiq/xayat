import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDatabase } from "@/src/context/DatabaseProvider";
import { tailorsTable } from "@/db/schema";
import TailorCard from "@/src/components/TailorCard";
import TailorForm, { TailorFormInputs } from "@/src/components/TailorForm";
import ModalWrapper from "@/src/components/ModalWrapper";

export default function TailorsScreen() {
  const { db } = useDatabase();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tailors, setTailors] = useState<(typeof tailorsTable.$inferSelect)[]>(
    [],
  );

  async function addTailor(data: TailorFormInputs) {
    setIsModalVisible(false);
    await db.insert(tailorsTable).values(data);
    await updateListOfTailors();
  }

  async function updateListOfTailors() {
    const results = await db.select().from(tailorsTable);
    setTailors(results);
  }

  useEffect(() => {
    updateListOfTailors();
  }, [db]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {tailors.map((tailor) => (
          <View key={tailor.id} style={{ marginBottom: 5 }}>
            <TailorCard tailor={tailor} key={tailor.id} />
          </View>
        ))}
        <TouchableOpacity
          style={styles.addTailorButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addTailorButtonText}>Add Tailor</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalWrapper
        visible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      >
        <TailorForm onSubmit={addTailor} />
      </ModalWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  addTailorButton: {
    backgroundColor: "#4552CB",
    padding: 10,
    borderRadius: 10,
  },
  addTailorButtonText: {
    textAlign: "center",
    color: "white",
  },
});
