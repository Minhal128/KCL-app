import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import BottomNavbar from "../../components/BottomNavbar";

import { router } from "expo-router";
import avatar from "../../assets/images/avatar/1.png";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { contentAPI, watchlistAPI } from "../../services/api";

const Home = () => {
  const { user, fetchUserProfile, loadingUser } = useUser();
  const [featuredContent, setFeaturedContent] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topSeries, setTopSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContent = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [featuredRes, moviesRes, seriesRes] = await Promise.all([
        contentAPI.getFeaturedContent(10),
        contentAPI.getAllContent({ type: 'movie', limit: 10 }),
        contentAPI.getAllContent({ type: 'series', limit: 10 }),
      ]);

      if (featuredRes.data.success) {
        setFeaturedContent(featuredRes.data.data);
      }

      if (moviesRes.data.success) {
        setTrendingMovies(moviesRes.data.data.content);
      }

      if (seriesRes.data.success) {
        setTopSeries(seriesRes.data.data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchContent();
  }, []);

  const handleAddToWatchlist = async (contentId) => {
    try {
      await watchlistAPI.addToWatchlist(contentId);
      console.log('Added to watchlist');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const renderSection = (title, data, bigItems) => {
    const getItemStyle = () => {
      if (title === "Featured Content")
        return { ...sectionStyles.recentlyPlayedCard, width: 160 };
      if (bigItems) return { ...sectionStyles.trendingMovieCard, width: 180 };
      return { ...sectionStyles.movieCard, width: 120 };
    };

    if (data.length === 0) return null;

    return (
      <View style={sectionStyles.sectionContainer}>
        <View style={sectionStyles.sectionHeader}>
          <Text style={sectionStyles.sectionTitle}>{title}</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/home/all_movies", params: { title } })
            }
          >
            <Text style={sectionStyles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ ...getItemStyle(item), marginRight: 15 }}
              onPress={() => router.push({ pathname: "/home/single", params: { id: item._id } })}
            >
              <Image
                source={{ uri: item.thumbnail || 'https://via.placeholder.com/300x450' }}
                style={sectionStyles.posterImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={sectionStyles.heartButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToWatchlist(item._id);
                }}
              >
                <Ionicons name="heart-outline" size={20} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#08B451" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={user?.avatar ? { uri: user.avatar } : avatar}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nameText}>{user?.name || 'Guest'}</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => router.push("/home/search")}
            style={styles.iconButton}
          >
            <Ionicons name="search-outline" size={24} color="#B4C1D4" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/home/notification")}
            style={styles.iconButton}
          >
            <Ionicons name="notifications-outline" size={24} color="#B4C1D4" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchContent(true)} />
        }
      >
        {renderSection("Featured Content", featuredContent)}
        {renderSection("Trending Movies", trendingMovies, true)}
        {renderSection("Top TV Series", topSeries)}
      </ScrollView>

      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#112F5A",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#08B451",
  },
  welcomeText: {
    fontSize: 14,
    color: "#B4C1D4",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
});

const sectionStyles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  seeMoreText: {
    fontSize: 14,
    color: "#08B451",
  },
  movieCard: {
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
  },
  trendingMovieCard: {
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
  },
  recentlyPlayedCard: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  posterImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
});

export default Home;
