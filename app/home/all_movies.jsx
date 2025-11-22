import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

// --- Movie Data ---
import top_1 from '../../assets/images/top/1.png'; 
import top_2 from '../../assets/images/top/2.png'; 
import top_3 from '../../assets/images/top/3.png'; 

const MOVIES_DATA = [
  {
    id: 'm1',
    title: 'Love After Lockup',
    image: top_1,
    productionYear: 2023,
    duration: '2 hours',
    rating: 4.1,
    ratingCount: '2,548',
    tag: null,
  },
  {
    id: 'm2',
    title: 'Double Cross',
    image: top_2,
    productionYear: 2021,
    duration: '2 hours',
    rating: 4.1,
    ratingCount: '2,548',
    tag: 'NEW SERIES',
  },
  {
    id: 'm3',
    title: 'Monogamy',
    image: top_3,
    productionYear: 2024,
    duration: '2 hours',
    rating: 4.1,
    ratingCount: '2,548',
    tag: 'BRAND NEW',
  },
  {
    id: 'm4',
    title: 'Double Cross 2',
    image: top_2,
    productionYear: 2022,
    duration: '2 hours',
    rating: 4.1,
    ratingCount: '2,548',
    tag: null,
  },
];

// --- Single Movie Card Component ---
const MovieCard = ({ movie }) => (
  <TouchableOpacity style={cardStyles.cardContainer}>
    <Image source={movie.image} style={cardStyles.cardImage} resizeMode="cover" />
    {/* <View style={cardStyles.overlay}>
      {movie.tag && (
        <View style={cardStyles.tagContainer}>
          <Text style={cardStyles.tagText}>{movie.tag}</Text>
        </View>
      )}
      <TouchableOpacity style={cardStyles.heartButton}>
        <FontAwesome name="heart-o" size={18} color="white" />
      </TouchableOpacity>

      <View style={cardStyles.infoContainer}>
        <Text style={cardStyles.title}>{movie.title}</Text>

        <View style={cardStyles.metaRow}>
          <Text style={cardStyles.metaText}>{movie.productionYear}</Text>
          <Text style={cardStyles.metaText}>{movie.duration}</Text>
        </View>

        <View style={cardStyles.ratingRow}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={cardStyles.ratingText}>{movie.rating} ({movie.ratingCount})</Text>
        </View>
      </View>
      <TouchableOpacity style={cardStyles.playButton}>
        <Ionicons name="play-circle" size={40} color="#08B451" />
      </TouchableOpacity>
    </View> */}
  </TouchableOpacity>
);

const cardStyles = StyleSheet.create({
  cardContainer: {
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  infoContainer: {
    paddingRight: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#B4C1D4',
    marginRight: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  playButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  heartButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
  },
  tagContainer: {
    position: 'absolute',
    top: 15,
    left: 0,
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// --- Main Screen ---
const AllMovies = () => {
  const { title } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title || 'All Movies'}</Text>

        <TouchableOpacity onPress={() => router.push('/home/search')} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Movie List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MOVIES_DATA.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F294F',
    paddingTop: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1E3F6D',
    padding: 8,
    borderRadius: 50,
  },
  headerTitle: {
    flex: 1,
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  searchButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default AllMovies;
