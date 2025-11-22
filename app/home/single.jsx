
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import cover from '../../assets/images/single_movie/cover.png';
import related_movie_1 from '../../assets/images/explore/1.png';
import related_movie_2 from '../../assets/images/explore/2.png';
import related_movie_3 from '../../assets/images/explore/3.png';
import related_movie_4 from '../../assets/images/explore/4.png';
import avatar_1 from '../../assets/images/avatar/1.png';
import avatar_2 from '../../assets/images/avatar/2.png';
import avatar_3 from '../../assets/images/avatar/3.png';
import { router, useLocalSearchParams } from 'expo-router';
import DownloadModal from '../../components/DownlaodModal';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { contentAPI, watchlistAPI } from '../../services/api';

const MOVIE_DATA = {
  title: 'Star Wars: The Last Jedi',
  duration: '152 minutes',
  rating: 4.6,
  ratingCount: '1.2M',
  releaseDate: 'December. 20 2025',
  genres: ['Action', 'Adventure', 'Sci-fi'],
  synopsis: "Rey (Daisy Ridley) finally manages to find the legendary Jedi knight, Luke Skywalker (Mark Hamill) on an island with a magical aura. The heroes of The Force Awakens including Leia, Finn Read more...",
  introduction: "Over the summer, the Weasleys invite Harry Potter to attend the Quidditch World Cup final, played between Bulgaria and Ireland. The match ends in a victory for the Irish, but the campsite is attacked by Voldemort's former followers called the Death.",
};

const RELATED_MOVIES = [
  { id: 'r1', title: 'Star Wars: The Rise of Skywalker (2019)', image: related_movie_1 },
  { id: 'r2', title: 'Star Wars: The Force Awakens (2015)', image: related_movie_2 },
  { id: 'r3', title: 'Rogue One: A Star Wars Story (2016)', image: related_movie_3 },
  { id: 'r4', title: 'Solo: A Star Wars Story (2018)', image: related_movie_4 },
];

const COMMENTS_DATA = [
  { id: 'c1', name: 'Mikal Newell', comment: 'I so much love the movie, top notch', likes: '414', dislikes: '15', rating: 4.6, avatar: avatar_1 },
  { id: 'c2', name: 'Michael', comment: 'I so much love the movie, top notch', likes: '414', dislikes: '15', rating: 4.6, avatar: avatar_2 },
  { id: 'c3', name: 'Nicholas', comment: 'I so much love the movie, top notch', likes: '414', dislikes: '15', rating: 4.6, avatar: avatar_3 },
];

const CommentItem = ({ comment }) => (
  <View style={commentStyles.commentContainer}>
    <Image source={comment.avatar} style={commentStyles.avatar} />
    <View style={commentStyles.commentContent}>
      <Text style={commentStyles.nameText}>{comment.name}</Text>
      <Text style={commentStyles.commentText}>{comment.comment}</Text>
      <View style={commentStyles.actionsRow}>
        <View style={commentStyles.actionItem}>
          <FontAwesome name="thumbs-up" size={14} color="#B4C1D4" />
          <Text style={commentStyles.actionText}>{comment.likes}</Text>
        </View>
        <View style={commentStyles.actionItem}>
          <FontAwesome name="thumbs-down" size={14} color="#B4C1D4" />
          <Text style={commentStyles.actionText}>{comment.dislikes}</Text>
        </View>
        <View style={commentStyles.ratingItem}>
          <FontAwesome name="star" size={14} color="#08B451" />
          <Text style={commentStyles.ratingValue}>{comment.rating}</Text>
        </View>
      </View>
    </View>
  </View>
);

const SingleMovie = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Ratings');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedContent, setRelatedContent] = useState([]);

  useEffect(() => {
    fetchContentDetails();
  }, [id]);

  const fetchContentDetails = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getContentById(id);
      
      if (response.data.success) {
        setContent(response.data.data);
        
        // Fetch related content based on genre
        if (response.data.data.genre && response.data.data.genre.length > 0) {
          const relatedRes = await contentAPI.getContentByGenre(response.data.data.genre[0], 10);
          if (relatedRes.data.success) {
            // Filter out current content
            const filtered = relatedRes.data.data.filter(item => item._id !== id);
            setRelatedContent(filtered.slice(0, 4));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      ToastAndroid.show('Failed to load content', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  const renderRelatedMovie = ({ item }) => (
    <TouchableOpacity 
      style={relatedStyles.relatedCard}
      onPress={() => {
        router.push({ pathname: '/home/single', params: { id: item._id } });
      }}
    >
      <Image 
        source={{ uri: item.thumbnail || 'https://via.placeholder.com/300x450' }} 
        style={relatedStyles.relatedImage} 
        resizeMode="cover" 
      />
      <Text style={relatedStyles.relatedMovieTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderInfoTab = () => (
    <View style={infoStyles.tabContent}>
      <View style={infoStyles.section}>
        <Text style={infoStyles.sectionTitle}>Description</Text>
        <Text style={infoStyles.sectionText}>{content?.description || 'No description available.'}</Text>
      </View>
      {content?.tags && content.tags.length > 0 && (
        <View style={infoStyles.section}>
          <Text style={infoStyles.sectionTitle}>Tags</Text>
          <Text style={infoStyles.sectionText}>{content.tags.join(', ')}</Text>
        </View>
      )}
    </View>
  );

  const renderRatingsTab = () => (
    <View style={ratingsStyles.tabContent}>
      <View style={ratingsStyles.overallRatingHeader}>
        <Text style={ratingsStyles.overallRating}>4.6</Text>
        <View style={ratingsStyles.starContainer}>
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={18}
              color={i < 4 ? '#08B451' : '#1E3F6D'}
              style={{ marginHorizontal: 1 }}
            />
          ))}
        </View>
      </View>
      {COMMENTS_DATA.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      <TouchableOpacity style={ratingsStyles.seeMoreButton}>
        <Text style={ratingsStyles.seeMoreText}>See more</Text>
      </TouchableOpacity>
    </View>
  );

  const startRealDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const uri = 'https://videos.pexels.com/video-files/7299607/7299607-uhd_1440_2732_25fps.mp4';
      const fileName = `movie_${Date.now()}.mp4`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      // Request permission first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        ToastAndroid.show('Permission denied to save video', ToastAndroid.SHORT);
        setIsDownloading(false);
        return;
      }

      // Start simple download (no resumable)
      const download = await FileSystem.downloadAsync(uri, fileUri);
      console.log('Downloaded to temp:', download.uri);

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(download.uri);
      const albumName = Platform.OS === 'android' ? 'Download' : 'Movies';
      await MediaLibrary.createAlbumAsync(albumName, asset, false);

      ToastAndroid.show('Download complete! Saved to gallery', ToastAndroid.SHORT);
      console.log('Saved to:', albumName);
    } catch (error) {
      console.error('Download failed:', error);
      ToastAndroid.show('❌ Download failed!', ToastAndroid.SHORT);
    } finally {
      setIsDownloading(false);
    }
  };

  const startMockDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setDownloadProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
          ToastAndroid.show('Download complete! Saved to gallery', ToastAndroid.SHORT);

        }, 1000); // Keep modal visible for a second after completion
      }
    }, 300); // Increment every 300ms
  };

  const handleDownloadClick = () => {
    if (!isDownloading) {
      // startRealDownload();
      startMockDownload()
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#08B451" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading content...</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 18 }}>Content not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#08B451', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: content.thumbnail || 'https://via.placeholder.com/800x450' }} 
          style={styles.coverImage} 
          resizeMode="cover" 
        />
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsCard}>
          <Text style={styles.movieTitle}>{content.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#08B451" />
              <Text style={styles.metaText}>{formatDuration(content.duration)}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="star" size={16} color="#08B451" />
              <Text style={styles.metaText}>4.6 (1.2M)</Text>
            </View>
            <View style={styles.actionIconGroup}>
              <TouchableOpacity onPress={handleDownloadClick}><Ionicons name="download" size={20} color="#fff" style={{ marginRight: 10 }} /></TouchableOpacity>
              <TouchableOpacity><MaterialCommunityIcons name="share-variant" size={20} color="#fff" style={{ marginRight: 10 }} /></TouchableOpacity>
              <TouchableOpacity><Ionicons name="heart-outline" size={20} color="#fff" /></TouchableOpacity>
            </View>
          </View>
          <View style={styles.releaseDateRow}>
            <Text style={styles.releaseDateLabel}>Release Date</Text>
            <Text style={styles.releaseDateValue}>{formatDate(content.releaseDate)}</Text>
          </View>
          <View style={styles.genreRow}>
            <Text style={styles.genreLabel}>Genre</Text>
            {content.genre && content.genre.length > 0 ? (
              content.genre.map(genre => (
                <View key={genre} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.genreText}>N/A</Text>
            )}
          </View>
          <TouchableOpacity 
            onPress={() => router.push({ pathname: '/home/play', params: { id: content._id, vimeoId: content.vimeoId, url: content.vimeoPlaybackUrl, directUrl: content.directVideoUrl } })} 
            style={styles.playButton}
          >
            <LinearGradient
              colors={['#18B451', '#08B451']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientButton}
            >
              <FontAwesome name="play-circle" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.playButtonText}>Play</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trailerButton}>
            <Text style={styles.trailerButtonText}>Watch Trailer</Text>
          </TouchableOpacity>
          <View style={styles.tabsContainer}>
            <TouchableOpacity onPress={() => setActiveTab('Info')} style={[styles.tab, activeTab === 'Info' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'Info' && styles.activeTabText]}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('Ratings')} style={[styles.tab, activeTab === 'Ratings' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'Ratings' && styles.activeTabText]}>Ratings (20K)</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContentArea}>
            {activeTab === 'Info' ? renderInfoTab() : renderRatingsTab()}
          </View>
          {relatedContent.length > 0 && (
            <View style={relatedStyles.relatedSection}>
              <Text style={relatedStyles.relatedTitle}>Related {content.type === 'movie' ? 'Movies' : 'Content'}</Text>
              <FlatList
                data={relatedContent}
                renderItem={renderRelatedMovie}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={relatedStyles.relatedList}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <DownloadModal
        isVisible={isDownloading}
        progress={downloadProgress}
        hideModal={() => setIsDownloading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F294F' },
  scrollContent: { paddingBottom: 40 },
  coverImage: { width: '100%', height: 450 },
  headerOverlay: { position: 'absolute', top: 60, left: 20, right: 20 },
  backButton: { backgroundColor: '#1E3F6D', padding: 8, borderRadius: 50, width: 44, alignItems: 'center' },
  detailsCard: { backgroundColor: '#0F294F', marginTop: -130, paddingTop: 20 },
  movieTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', paddingHorizontal: 20, marginBottom: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  metaText: { fontSize: 14, color: 'white', marginLeft: 5, fontWeight: '500' },
  actionIconGroup: { flexDirection: 'row', position: 'absolute', right: 20 },
  releaseDateRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  releaseDateLabel: { fontSize: 14, color: '#B4C1D4', marginRight: 10 },
  releaseDateValue: { fontSize: 14, color: 'white', fontWeight: '500' },
  genreRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  genreLabel: { fontSize: 14, color: '#B4C1D4', marginRight: 15 },
  genreTag: { backgroundColor: '#1E3F6D', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8 },
  genreText: { color: 'white', fontSize: 12 },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, justifyContent: 'space-between' },
  playButton: { flex: 1, marginHorizontal: 20, borderRadius: 30, overflow: 'hidden' },
  gradientButton: { flexDirection: 'row', paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  playButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  trailerButton: { flex: 1, marginTop: 10, marginBottom: 30, marginHorizontal: 20, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E3F6D', borderRadius: 30, borderWidth: 1, borderColor: '#1E3F6D' },
  trailerButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1E3F6D', paddingHorizontal: 20, marginBottom: 20 },
  tab: { paddingBottom: 10, marginRight: 30 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#08B451' },
  tabText: { fontSize: 16, color: '#B4C1D4', fontWeight: '500' },
  activeTabText: { color: 'white' },
});

const infoStyles = StyleSheet.create({
  tabContent: { paddingHorizontal: 20 },
  section: { backgroundColor: '#1E3F6D', borderRadius: 15, padding: 15, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#B4C1D4', lineHeight: 20 },
});

const ratingsStyles = StyleSheet.create({
  tabContent: {},
  overallRatingHeader: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  overallRating: { fontSize: 30, fontWeight: 'bold', color: 'white', marginRight: 10 },
  starContainer: { flexDirection: 'row' },
  seeMoreButton: { alignSelf: 'flex-start', paddingHorizontal: 20, marginBottom: 10, marginTop: 5 },
  seeMoreText: { color: '#08B451', fontSize: 16, fontWeight: 'bold' },
});

const relatedStyles = StyleSheet.create({
  relatedSection: { marginTop: 20, paddingHorizontal: 20 },
  relatedTitle: { fontSize: 18, fontWeight: 'semibold', color: 'white', marginBottom: 15 },
  relatedList: { paddingRight: 20 },
  relatedCard: { width: 120, marginRight: 15 },
  relatedImage: { width: '100%', height: 170, borderRadius: 10, marginBottom: 8 },
  relatedMovieTitle: { fontSize: 13, color: 'white' },
});
const commentStyles = StyleSheet.create({
  commentContainer: { flexDirection: 'row', marginBottom: 20, paddingHorizontal: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  commentContent: { flex: 1 },
  nameText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 2 },
  commentText: { fontSize: 14, color: '#B4C1D4', marginBottom: 8 },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  actionText: { fontSize: 14, color: '#B4C1D4', marginLeft: 5 },
  ratingItem: { flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 0 },
  ratingValue: { fontSize: 14, color: 'white', marginLeft: 5, fontWeight: 'bold' },
});

export default SingleMovie;
