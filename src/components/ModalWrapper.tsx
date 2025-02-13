import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
} from "react-native";
import { FontAwesome6 as FontAwesome } from "@expo/vector-icons";

interface ModalWrapperProps {
  visible: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export default function ModalWrapper({
  visible,
  closeModal,
  children,
}: ModalWrapperProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <FontAwesome name="x" color="black" size={20} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});
