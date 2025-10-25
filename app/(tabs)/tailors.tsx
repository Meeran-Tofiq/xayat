import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TailorCard from "@/src/components/TailorCard";
import TailorForm from "@/src/components/TailorForm";
import ModalWrapper from "@/src/components/ModalWrapper";
import { useTailorsStore } from "@/src/stores/useTailorsStore";

export default function TailorsScreen() {
  const { tailors, addTailor, refresh } = useTailorsStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addTailorButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addTailorButtonText}>Add Tailor</Text>
      </TouchableOpacity>

      <ScrollView>
        {tailors.map((tailor) => (
          <View key={tailor.id} style={{ marginBottom: 5 }}>
            <TailorCard tailor={tailor} updateFunction={refresh} />
          </View>
        ))}
      </ScrollView>

      <ModalWrapper
        visible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      >
        <TailorForm
          onSubmit={async (data) => {
            await addTailor(data);
            setIsModalVisible(false);
          }}
        />
      </ModalWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  addTailorButton: {
    backgroundColor: "#4552CB",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  addTailorButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
