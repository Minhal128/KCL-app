import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Platform, Linking, Text } from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

const Play = () => {
  const { id, vimeoId, url, directUrl } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const lockLandscape = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockLandscape();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const handleVideoLoad = async () => {
    setIsLoading(false);
    if (videoRef.current) {
      try {
        await videoRef.current.playAsync(); // start playback
      } catch (error) {
        console.log('Error playing video:', error);
      }
    }
  };

  // If direct video URL is available, play in app
  if (directUrl) {
    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#08B451" />
          </View>
        )}

        <Video
          ref={videoRef}
          source={{ uri: directUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          onLoadStart={() => setIsLoading(true)}
          onLoad={handleVideoLoad}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // Use Vimeo player if vimeoId or url is provided
  if (vimeoId || url) {
    const vimeoUrl = url || `https://vimeo.com/${vimeoId}`;
    
    const openVimeoVideo = async () => {
      try {
        await WebBrowser.openBrowserAsync(vimeoUrl);
        navigation.goBack();
      } catch (error) {
        console.error('Error opening video:', error);
      }
    };

    // Auto-open on mount
    useEffect(() => {
      openVimeoVideo();
    }, []);
    
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#08B451" />
          <Text style={styles.loadingText}>Opening video player...</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={openVimeoVideo}
          >
            <Text style={styles.retryButtonText}>Open Video</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // Fallback to regular video player for non-Vimeo content
  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#08B451" />
        </View>
      )}

      <Video
        ref={videoRef}
        source={{
          uri: 'https://videos.pexels.com/video-files/7299607/7299607-uhd_1440_2732_25fps.mp4',
        }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onLoadStart={() => setIsLoading(true)}
        onLoad={handleVideoLoad} // ✅ triggers when metadata is loaded
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    zIndex: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  retryButton: {
    marginTop: 30,
    backgroundColor: '#08B451',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 50,
  },
});

export default Play;
