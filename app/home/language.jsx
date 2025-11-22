import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { BACKEND_URI } from "../../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Spanish", value: "es" },
  { label: "Russia", value: "ru" },
  { label: "Espanyol", value: "esp" },
  { label: "Japanese", value: "jp" },
];

const LanguageItem = ({ label, value, isSelected, onPress }) => (
  <TouchableOpacity style={styles.languageItem} onPress={() => onPress(value)}>
    <Text style={styles.languageLabel}>{label}</Text>
    <Ionicons
      name={isSelected ? "radio-button-on" : "radio-button-off"}
      size={24}
      color={isSelected ? "#08B451" : "#B4C1D4"}
    />
  </TouchableOpacity>
);

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("userLanguage");
        if (savedLanguage) setSelectedLanguage(savedLanguage);
      } catch (err) {
        console.warn("Failed to load language from storage:", err);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageSelect = async (value) => {
    setSelectedLanguage(value);
    setLoading(true);

    try {
      const response = await axios.put(
        `${BACKEND_URI}/user/language`,
        { language: value }, // ✅ use value directly
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("userLanguage", value);
        Alert.alert("✅ Updated", `Language set to ${value.toUpperCase()}`);
      } else {
        Alert.alert("⚠️ Error", "Could not update language.");
      }
    } catch (error) {
      console.error(
        "Language update failed:",
        error?.response?.data || error.message
      );
      Alert.alert("❌ Failed", "Unable to update language. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.header}>
        <View style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </View>
        <Text style={styles.headerTitle}>Language</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {LANGUAGES.map((item) => (
          <LanguageItem
            key={item.value}
            label={item.label}
            value={item.value}
            isSelected={selectedLanguage === item.value}
            onPress={handleLanguageSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F294F", // Main screen background
  },
  // --- Header Styles ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#1E3F6D", // Dark blue circle background
  },
  // --- List Styles ---
  scrollContent: {
    paddingHorizontal: 30,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    // Using a slightly lighter dark blue for the separator
    borderBottomColor: "#1E3F6D",
  },
  languageLabel: {
    fontSize: 16,
    color: "white",
  },
});

export default Language;
