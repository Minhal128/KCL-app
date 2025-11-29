import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguage } from "../../context/LanguageContext";

const SETTINGS_OPTIONS = [
  {
    icon: "person-outline",
    labelKey: "editProfile",
    key: "account",
    url: "/home/edit",
  },
  {
    icon: "notifications-outline",
    labelKey: "notifications",
    key: "notifications",
    url: "/home/notification",
  },
  {
    icon: "videocam-outline",
    labelKey: "videoQuality",
    key: "video",
    descriptionKey: "videoQuality",
  },
  {
    icon: "language-outline",
    labelKey: "language",
    key: "language",
    url: "/home/language",
  },
  {
    icon: "lock-closed-outline",
    labelKey: "privacy",
    key: "privacy",
    url: "/home/privacy",
  },
];

const SettingItem = ({ icon, labelKey, descriptionKey, onPress, t }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.iconLabelContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={22} color="#08B451" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingLabel}>{t(labelKey)}</Text>
        {descriptionKey && (
          <Text style={styles.settingDescription}>{t(descriptionKey)}</Text>
        )}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#B4C1D4" />
  </TouchableOpacity>
);

const Settings = () => {
  const { t } = useLanguage();

  const handleSettingPress = (key, url) => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          {SETTINGS_OPTIONS.map((item) => (
            <SettingItem
              key={item.key}
              icon={item.icon}
              labelKey={item.labelKey}
              descriptionKey={item.descriptionKey}
              t={t}
              onPress={() => handleSettingPress(item.key, item.url)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support')}</Text>
          <SettingItem
            icon="help-circle-outline"
            labelKey="help"
            t={t}
            onPress={() => router.push("/home/help")}
          />
          <SettingItem
            icon="information-circle-outline"
            labelKey="about"
            t={t}
            onPress={() => router.push("/home/about")}
          />
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F294F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#1E3F6D",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B4C1D4",
    marginBottom: 15,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#112F5A",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#1E3F6D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    color: "#B4C1D4",
    marginTop: 2,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#B4C1D4",
  },
});

export default Settings;
