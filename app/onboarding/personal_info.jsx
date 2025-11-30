import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../../services/api";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const PersonalInfo = () => {
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("US");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { email, token } = useLocalSearchParams();

  const onSelectCountry = (country) => {
    setCountry(country);
    setCountryCode(country.cca2);
    setShowCountryPicker(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    const formatted = currentDate.toLocaleDateString();
    setFormattedDate(formatted);
  };

  const handleContinue = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      setShowErrorModal(true);
      return;
    }
    if (!country) {
      setErrorMessage("Please select your country.");
      setShowErrorModal(true);
      return;
    }
    if (!formattedDate) {
      setErrorMessage("Please select your date of birth.");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    console.log(email, token, name, country.name, new Date(formattedDate));
    try {
      const res = await authAPI.onboarding({
        email,
        token,
        name,
        username: "",
        country: country.name,
        dateOfBirth: date,
      });

      if (res.data.success) {
        // Store the access token from onboarding response
        const accessToken = res.data.access_token;
        if (accessToken) {
          await AsyncStorage.setItem("access_token", accessToken);
        }
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.log("Onboarding Error:", err?.response?.data || err.message);
      setErrorMessage(err?.response?.data?.message || "Something went wrong. Try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Let&apos;s know more about you</Text>
        </View>

        <Text style={styles.inputLabel}>What&apos;s your name?</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor="#B4C1D4"
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={styles.inputLabel}>Where are you located?</Text>
        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.dropdownText}>
            {country ? country.name : "Choose your country"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#B4C1D4" />
        </TouchableOpacity>

        {showCountryPicker && (
          <CountryPicker
            countryCode={countryCode}
            withFilter={true}
            withFlag={true}
            withCountryNameButton={false}
            withAlphaFilter={true}
            withCallingCode={true}
            onSelect={onSelectCountry}
            visible={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
          />
        )}

        <Text style={styles.inputLabel}>How old are you?</Text>
        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dropdownText}>
            {formattedDate || "Select your date of birth"}
          </Text>
          <FontAwesome5 name="calendar-alt" size={20} color="#B4C1D4" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}

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
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <SuccessModal
          visible={showSuccessModal}
          title="Success"
          message="Profile created successfully!"
          buttonText="OK"
          onClose={() => {
            setShowSuccessModal(false);
            router.push("onboarding/password");
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
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F294F",
    paddingHorizontal: 30,
    paddingTop: 130,
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
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#B4C1D4",
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3F6D",
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 55,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  dropdownText: {
    flex: 1,
    color: "#B4C1D4",
    fontSize: 16,
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 60,
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
});

export default PersonalInfo;
