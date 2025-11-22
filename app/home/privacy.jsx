import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const PrivacyPolicy = ({ navigation }) => {

    // Using a mock function for navigation back
    const goBack = () => {
        // In an expo-router setup, this would be: router.back()
        // In react-navigation, it would be: navigation.goBack()
        console.log('Navigating back from Privacy screen');
    };

    // The text content is transcribed directly from image_36a68e.png
    const POLICY_CONTENT = [
        {
            text: "Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.",
            style: styles.paragraph,
        },
        {
            text: "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.",
            style: styles.paragraph,
        },
        {
            text: "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.",
            style: styles.paragraph,
        },
        {
            text: "We don't share any personally identifying information publicly or with third-parties, except when required to by law.",
            style: styles.paragraph,
        },
    ];

    // Function to render text with highlighting/link capability for 'website'
    const renderContent = () => {
        // Find the index of the word "website" in the first paragraph
        const firstParagraph = POLICY_CONTENT[0].text;
        const parts = firstParagraph.split(/(website)/g);

        return (
            <>
                <Text style={styles.paragraph}>
                    {parts.map((part, index) => {
                        if (part === 'website') {
                            return (
                                <Text
                                    key={index}
                                    style={styles.websiteLink}
                                    onPress={() => Linking.openURL('https://yourwebsite.com')} // Placeholder URL
                                >
                                    website
                                </Text>
                            );
                        }
                        return <Text key={index}>{part}</Text>;
                    })}
                </Text>

                {/* Render the rest of the paragraphs */}
                {POLICY_CONTENT.slice(1).map((item, index) => (
                    <Text key={index + 1} style={item.style}>
                        {item.text}
                    </Text>
                ))}
            </>
        );
    };

    return (
        <View style={styles.container}>

            <Pressable onPress={() => router.back()} style={styles.header}>
                <View style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </View>
                <Text style={styles.headerTitle}>Privacy</Text>
            </Pressable>


            {/* Policy Text Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F294F', // Main screen background
    },
    // --- Header Styles ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        marginLeft: 30, // Counter-move the title to center it better
    },
    backButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#1E3F6D', // Dark blue circle background
    },
    // --- Content Styles ---
    scrollContent: {
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 40,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#B4C1D4', // Grayish color for body text
        marginBottom: 20,
        // The first paragraph is slightly bold/darker in the image, but applying
        // the same color to all for consistency in code.
    },
    websiteLink: {
        color: '#08B451', // Green color for the link, matching the design accent
        fontWeight: 'bold',
        textDecorationLine: 'none',
    }
});

export default PrivacyPolicy;