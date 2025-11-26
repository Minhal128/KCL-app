import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileAPI } from "../services/api";

const { height } = Dimensions.get("window");

const QUALITY_OPTIONS = [
  { label: "Low quality", value: "low" },
  { label: "Medium quality", value: "medium" },
  { label: "High quality", value: "high" },
  { label: "4K", value: "4k" },
];

const QualityOption = ({ label, isSelected, onPress }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Text style={styles.optionLabel}>{label}</Text>
    <Ionicons
      name={isSelected ? "radio-button-on" : "radio-button-off"}
      size={24}
      color={isSelected ? "#08B451" : "#B4C1D4"}
    />
  </TouchableOpacity>
);

const VideoQualityModal = ({ visible, onCancel }) => {
  const [selectedQuality, setSelectedQuality] = useState("low");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadQuality = async () => {
      try {
        const savedQuality = await AsyncStorage.getItem("userVideoQuality");
        if (savedQuality) setSelectedQuality(savedQuality);
      } catch (err) {
        console.warn("Failed to load video quality from storage:", err);
      }
    };
    if (visible) {
      loadQuality();
    }
  }, [visible]);

  const handleQualityChange = async (value) => {
    setSelectedQuality(value);
    setLoading(true);

    try {
      const response = await profileAPI.editVideoQuality({ videoQuality: value });

      if (response.status === 200) {
        // Store locally too
        await AsyncStorage.setItem("userVideoQuality", value);
        Alert.alert(
          "✅ Updated",
          `Video quality set to ${value.toUpperCase()}`
        );
        onCancel();
      } else {
        Alert.alert("⚠️ Error", "Could not update video quality");
      }
    } catch (error) {
      console.error(
        "Video quality update failed:",
        error?.response?.data || error.message
      );
      Alert.alert("❌ Failed", "Unable to update video quality. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.handle} />
          <Text style={styles.modalTitle}>Video quality</Text>
          <View style={styles.optionsContainer}>
            {QUALITY_OPTIONS.map((option) => (
              <QualityOption
                key={option.value}
                label={option.label}
                isSelected={selectedQuality === option.value}
                onPress={() => !loading && handleQualityChange(option.value)}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "#112F5A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: "center",
    maxHeight: height * 0.6,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#355380",
    borderRadius: 5,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
  },
  optionsContainer: { width: "100%" },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#0F294F",
  },
  optionLabel: { fontSize: 16, color: "white" },
});

export default VideoQualityModal;
