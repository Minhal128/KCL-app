import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';
import center_img from '../assets/images/auth/center_img.png';
import step_1_bg from '../assets/images/auth/step_1_bg.png';

const Onboarding = () => {
    return (
        <KeyboardAvoidingScrollView contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} extraScrollHeight={350} keyboardShouldPersistTaps="handled">
            <ImageBackground style={styles.background} source={step_1_bg} resizeMode="cover">
                <View style={styles.topContainer}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                        </View>
                        <TouchableOpacity style={styles.skipButton}>
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.centerImageContainer}>
                        <Image source={center_img} style={styles.centerImage} />
                    </View>
                </View>

                <View style={styles.overlay} />

                <View style={styles.contentContainer}>
                    <Text style={styles.titleText}>Discover Movies That Inspire and Excite</Text>
                    <Text style={styles.subtitleText}>
                        From gripping dramas to laugh-out-loud comedies, find content that speaks to every mood.
                    </Text>

                    <TouchableOpacity onPress={()=>router.push("/login")} style={styles.buttonMargin}>
                        <LinearGradient colors={['#18B451', '#08B451']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.greenButton}>
                            <Text style={styles.greenButtonText}>Continue with email</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>router.push("/register")} style={styles.darkButton}>
                        <Text style={styles.darkButtonText}>Create an account</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#0F294F',
    },
    topContainer: {
        paddingHorizontal: 20,
        paddingTop: 70,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressBar: {
        width: 100,
        height: 15,
        borderRadius: 100,
        backgroundColor: '#21477C',
    },
    progressFill: {
        backgroundColor: '#0766EE',
        width: '50%',
        height: '100%',
        borderRadius: 100,
    },
    skipButton: {
        backgroundColor: '#21477C',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 100,
        opacity: 0.9,
    },
    skipButtonText: {
        color: 'white',
        fontSize: 16,
        
    },
    centerImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    centerImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(15, 41, 79, 0.7)',
        width: '100%',
        height: '45%',
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 50,
        zIndex: 10,
    },
    titleText: {
        color: 'white',
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitleText: {
        color: '#B4C1D4',
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 35,
    },
    buttonMargin: {
        width: '100%',
        marginBottom: 15,
    },
    greenButton: {
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#18B451',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
    },
    greenButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    darkButton: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderRadius: 30,
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#21477C',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkButtonText: {
        color: 'white',
        fontSize: 16,
        
    },
});

export default Onboarding;
