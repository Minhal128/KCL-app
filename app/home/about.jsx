import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import image1 from '../../assets/images/home/grid.png'; // Example path
import { router } from 'expo-router';
const AboutUs = () => {
    const ABOUT_TEXT = "Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.";
    const renderContentWithLink = (text) => {
        const parts = text.split(/(website)/g);
        return (
            <Text>
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
                    return <Text key={index} style={styles.paragraphText}>{part}</Text>;
                })}
            </Text>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Pressable onPress={() => router.back()} style={styles.header}>
                <View style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </View>
                <Text style={styles.headerTitle}>About us</Text>
            </Pressable>


            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Top Text Block */}
                <View style={styles.textBlock}>
                    {renderContentWithLink(ABOUT_TEXT)}
                </View>

                {/* Image Grid */}
                <View style={styles.imageGrid}>
                    <Image source={image1} style={styles.gridImageSmall} />
                </View>

                {/* Bottom Text Block (reusing the same text as in the design) */}
                <View style={styles.textBlock}>
                    {renderContentWithLink(ABOUT_TEXT)}
                </View>

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
    // --- Scroll Content and Text Blocks ---
    scrollContent: {
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 40,
    },
    textBlock: {
        backgroundColor: '#1E3F6D',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    paragraphText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#B4C1D4', // Grayish color for body text
    },
    websiteLink: {
        color: '#08B451', // Green color for the link
        fontWeight: 'bold',
        textDecorationLine: 'none',
    },
    // --- Image Grid Styles ---
    imageGrid: {
        marginBottom: 20,
        borderRadius: 15, // Apply border radius to the overall grid container
        overflow: 'hidden', // Ensures images respect the border radius
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10, // Space between top row and large image
    },
    gridImageSmall: {
        width: '100%', // Slightly less than 50% to account for gap
        borderRadius: 10, // Apply to individual images as well
        resizeMode: 'cover',
    },
    gridImageLarge: {
        width: '100%',
        height: 200, // Fixed height for large image
        borderRadius: 10, // Apply to individual image
        resizeMode: 'cover',
    },
});

export default AboutUs;