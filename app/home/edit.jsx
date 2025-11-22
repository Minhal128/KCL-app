import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { userAPI } from "../../services/api";
import { useUser } from "../../context/UserContext";

const EditProfile = () => {
  const { user, setUser } = useUser();

  const [fullName, setFullName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.country || "");
  const [avatarUri, setAvatarUri] = useState(user?.avatar || null);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo access to upload avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phoneNumber", mobile);
      formData.append("country", location);

      if (avatarUri) {
        const fileName = avatarUri.split("/").pop();
        const type = fileName.endsWith(".png")
          ? "image/png"
          : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
          ? "image/jpeg"
          : "image/*";

        formData.append("avatar", {
          uri: avatarUri,
          name: fileName,
          type,
        });
      }

      const res = await userAPI.updateProfile(formData);

      if (res.data?.success) {
        const updatedUser = res.data?.user || {
          ...user,
          fullName,
          username,
          email,
          phoneNumber: mobile,
          country: location,
          avatar: avatarUri || user.avatar,
        };
        setUser(updatedUser);

        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", res.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", "Something went wrong while updating your profile");
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#08B451" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                avatarUri
                  ? { uri: avatarUri }
                  : require("../../assets/images/avatar/1.png")
              }
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{fullName}</Text>

        {/* --- Form Fields --- */}
        {[
          { label: "Full Name", value: fullName, setter: setFullName },
          { label: "Username", value: username, setter: setUsername },
          {
            label: "Email Address",
            value: email,
            setter: setEmail,
            type: "email-address",
          },
          {
            label: "Mobile Number",
            value: mobile,
            setter: setMobile,
            type: "phone-pad",
          },
          { label: "Location", value: location, setter: setLocation },
        ].map((field, index) => (
          <View key={index}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={field.value}
                onChangeText={field.setter}
                keyboardType={field.type || "default"}
                placeholder={field.label}
                placeholderTextColor="#B4C1D4"
              />
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <LinearGradient
            colors={["#18B451", "#08B451"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Save</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F294F" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  backButton: { padding: 8, borderRadius: 50, backgroundColor: "#1E3F6D" },
  helpButton: { padding: 8 },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 40 },
  profilePictureContainer: { alignSelf: "center", marginBottom: 10 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#1E3F6D",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1E3F6D",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0F294F",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 30,
  },
  label: { fontSize: 14, color: "#B4C1D4", marginBottom: 8, marginTop: 15 },
  inputContainer: {
    backgroundColor: "#1E3F6D",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 5,
  },
  textInput: { color: "white", fontSize: 16, fontWeight: "500", padding: 0 },
  saveButton: {
    width: "100%",
    borderRadius: 15,
    marginTop: 40,
    overflow: "hidden",
    shadowColor: "#08B451",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
});

export default EditProfile;
