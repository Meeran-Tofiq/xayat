import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import ModalWrapper from "@/src/components/ModalWrapper";

export type FormComponentProps<T> = {
  initialValues?: T | undefined;
  onSubmit: (data: Partial<T>) => Promise<void>;
  onCancel?: () => void;
};

type EditableCardProps<T> = {
  item: T;
  renderContent: (item: T) => React.ReactNode; // presentation UI
  FormComponent: React.ComponentType<FormComponentProps<T>>;
  onUpdate: (data: Partial<T>) => Promise<void>; // called with form values
  onDelete: () => Promise<void>;
  refreshList: () => Promise<void>;
};

export default function EditableCard<T extends Record<string, any>>({
  item,
  renderContent,
  FormComponent,
  onUpdate,
  onDelete,
  refreshList,
}: EditableCardProps<T>) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function handleSubmit(data: Partial<T>) {
    try {
      await onUpdate(data);
      await refreshList();
      setIsModalVisible(false);
    } catch (err) {
      console.error("EditableCard update error:", err);
      // allow FormComponent to show errors as desired
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await onDelete();
              await refreshList();
              setIsModalVisible(false);
            } catch (err) {
              console.error("Delete failed:", err);
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
        {renderContent(item)}
      </TouchableOpacity>

      <ModalWrapper
        visible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <FormComponent
            initialValues={item}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
          />
          <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ModalWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: { padding: 8 },
  deleteButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: { color: "white", fontWeight: "700" },
});
