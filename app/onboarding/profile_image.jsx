import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { userAPI } from "../../services/api";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

import avatar_1 from "../../assets/images/avatar/1.png";
import avatar_2 from "../../assets/images/avatar/2.png";
import avatar_3 from "../../assets/images/avatar/3.png";
import avatar_4 from "../../assets/images/avatar/4.png";
import avatar_5 from "../../assets/images/avatar/5.png";

const avatarOptions = [
  { id: 1, source: avatar_1 },
  { id: 2, source: avatar_2 },
  { id: 3, source: avatar_3 },
  { id: 4, source: avatar_4 },
  { id: 5, source: avatar_5 },
];

const ProfileImage = () => {
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setSelectedAvatarId(null);
    }
  };

  const handleAvatarSelect = (id) => {
    setSelectedAvatarId(id === selectedAvatarId ? null : id);
    setSelectedImage(null);
  };

  const handleSkip = () => {
    router.push("/onboarding/interest");
  };

  const handleContinue = async () => {
    if (!selectedImage && !selectedAvatarId) {
      setErrorMessage("Please select or upload an image first.");
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      if (selectedImage) {
        // User uploaded an image from gallery
        const fileName = selectedImage.split("/").pop();
        const type = fileName.endsWith(".png")
          ? "image/png"
          : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
          ? "image/jpeg"
          : "image/*";

        formData.append("avatar", {
          uri: selectedImage,
          name: fileName,
          type,
        });
      } else if (selectedAvatarId) {
        // User selected a predefined avatar
        const selected = avatarOptions.find((a) => a.id === selectedAvatarId);
        
        // Load the asset properly using expo-asset
        const asset = Asset.fromModule(selected.source);
        await asset.downloadAsync();
        
        // Get the local URI of the downloaded asset
        const localUri = asset.localUri;
        
        if (!localUri) {
          throw new Error("Failed to load avatar asset");
        }

        formData.append("avatar", {
          uri: localUri,
          name: `avatar_${selectedAvatarId}.png`,
          type: "image/png",
        });
      }

      const response = await userAPI.updateAvatar(formData);

      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || error.message || "Something went wrong");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>Upload a profile picture</Text>
        <Text style={styles.subtitle}>
          Upload a clear and visible photo of yourself
        </Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
        ) : (
          <Ionicons name="image" size={48} color="white" />
        )}
      </TouchableOpacity>

      <Text style={styles.dividerText}>Or Select an avatar</Text>

      <View style={styles.avatarGrid}>
        {avatarOptions.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            onPress={() => handleAvatarSelect(avatar.id)}
            style={[
              styles.avatarWrapper,
              selectedAvatarId === avatar.id && styles.avatarSelected,
            ]}
          >
            <Image source={avatar.source} style={styles.avatarImage} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={loading}
        style={styles.continueButton}
      >
        <LinearGradient
          colors={["#18B451", "#08B451"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientButton}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <SuccessModal
        visible={showSuccessModal}
        title="Success"
        message="Profile image updated successfully!"
        buttonText="OK"
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/onboarding/interest");
        }}
      />

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        buttonText="OK"
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F294F",
    paddingHorizontal: 30,
    paddingTop: 130,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 30,
    backgroundColor: "#1E3F6D",
    padding: 8,
    borderRadius: 50,
    zIndex: 10,
  },
  headerTextContainer: {
    width: "100%",
    marginBottom: 40,
    paddingLeft: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#B4C1D4",
    textAlign: "center",
  },
  uploadButton: {
    width: 140,
    height: 140,
    backgroundColor: "#1E3F6D",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  dividerText: {
    color: "#B4C1D4",
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
  },
  avatarGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 50,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarSelected: {
    borderColor: "#08B451",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#18B451",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  skipButton: {
    marginTop: 20,
    alignItems: "center",
  },
  skipText: {
    color: "#B4C1D4",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default ProfileImage;
