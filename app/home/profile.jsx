import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavbar from "../../components/BottomNavbar";
import avatar from "../../assets/images/avatar/1.png";
import LogoutModal from "../../components/LogoutModal.jsx";
import { router } from "expo-router";
import VideoQualityModal from "../../components/VideoQualityModal.jsx";
import { useUser } from "../../context/UserContext.js";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../../context/LanguageContext";

const PROFILE_MENU_TOP = [
  {
    icon: "person-outline",
    labelKey: "editProfile",
    key: "edit",
    url: "/home/edit",
  },
  {
    icon: "notifications-outline",
    labelKey: "notifications",
    key: "notifications",
    url: "/home/notification",
  },
  {
    icon: "settings-outline",
    labelKey: "settings",
    key: "settings",
    url: "/home/settings",
  },
  { icon: "videocam-outline", labelKey: "videoQuality", key: "video" },
];

const PROFILE_MENU_BOTTOM = [
  {
    icon: "lock-closed-outline",
    labelKey: "privacy",
    key: "privacy",
    url: "/home/privacy",
  },
  {
    icon: "help-circle-outline",
    labelKey: "help",
    key: "help",
    url: "/home/help",
  },
  {
    icon: "information-circle-outline",
    labelKey: "about",
    key: "about",
    url: "/home/about",
  },
  {
    icon: "language-outline",
    labelKey: "language",
    key: "languages",
    url: "/home/language",
  },
];

const MenuItem = ({ icon, labelKey, onPress, t }) => (
  <TouchableOpacity style={menuStyles.menuItem} onPress={onPress}>
    <View style={menuStyles.iconLabelContainer}>
      <Ionicons
        name={icon}
        size={20}
        color="#B4C1D4"
        style={menuStyles.menuIcon}
      />
      <Text style={menuStyles.menuLabel}>{t(labelKey)}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#B4C1D4" />
  </TouchableOpacity>
);

const menuStyles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1E3F6D",
    paddingHorizontal: 20,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
});

const Profile = () => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const { t } = useLanguage();

  const { user, logout } = useUser();
  const { signOut: clerkSignOut, isSignedIn } = useAuth();

  const handleLogout = async () => {
    setLogoutVisible(false);
    
    try {
      console.log("🚪 Starting logout process...");
      
      // Check if using Clerk authentication
      const authMethod = await AsyncStorage.getItem("auth_method");
      const isClerkAuth = authMethod?.startsWith("clerk_");
      
      if (isClerkAuth && isSignedIn) {
        console.log("🔐 Signing out of Clerk...");
        await clerkSignOut();
        console.log("✅ Clerk sign out complete");
      }
      
      // Clear app storage and context
      await logout();
      console.log("✅ Logout complete");
      
      router.replace("login");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Still navigate to login even if there's an error
      router.replace("login");
    }
  };

  const handleMenuPress = (key, url) => {
    if (key === "video") setVideoModalVisible(true);
    else {
      router.push(url);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={user?.avatar ? { uri: user.avatar } : avatar}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.name}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/home/subscription")}
          style={styles.upgradeButton}
        >
          <LinearGradient
            colors={["#18B451", "#08B451"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <View style={styles.upgradeTextContainer}>
              <Text style={styles.proText}>PRO</Text>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSubtitle}>
                Enjoy watching tv series and movies without restrictions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.menuSection}>
          {PROFILE_MENU_TOP.map((item) => (
            <MenuItem
              key={item.key}
              icon={item.icon}
              labelKey={item.labelKey}
              t={t}
              onPress={() => handleMenuPress(item.key, item.url)}
            />
          ))}
        </View>

        <View style={styles.menuSection}>
          {PROFILE_MENU_BOTTOM.map((item) => (
            <MenuItem
              key={item.key}
              icon={item.icon}
              labelKey={item.labelKey}
              t={t}
              onPress={() => handleMenuPress(item.key, item.url)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutVisible(true)}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#FF3B30"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <LogoutModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
      <VideoQualityModal
        visible={videoModalVisible}
        onCancel={() => setVideoModalVisible(false)}
      />
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F294F" },
  scrollContent: { paddingTop: 60, paddingBottom: 100 },
  profileHeader: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  userName: { fontSize: 24, fontWeight: "bold", color: "white" },
  upgradeButton: { paddingHorizontal: 20, marginBottom: 30 },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 15,
  },
  upgradeTextContainer: { flex: 1 },
  proText: {
    backgroundColor: "#FF3B30",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  upgradeSubtitle: { fontSize: 12, color: "white", opacity: 0.9 },
  menuSection: {
    backgroundColor: "#112F5A",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },
});

export default Profile;
