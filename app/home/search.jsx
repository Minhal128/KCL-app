import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../context/LanguageContext';
import movie_1 from '../../assets/images/movies/1.png';
import movie_2 from '../../assets/images/movies/2.png';

const CATEGORY_TABS = ['All', 'Actions', 'Adventures', 'TV series', 'Comedy', 'Drama', 'Sci-Fi'];

const RECENT_SEARCHES_KEY = 'recent_searches';

const TOP_SEARCHED_DATA = [
    { id: 't1', title: 'Inside Out 2', image: movie_1 },
    { id: 't2', title: 'THE MOVIE', subtitle: 'Garfield', image: movie_2 },
    { id: 't3', title: 'Joker', image: movie_1 },
    { id: 't4', title: 'Black Panther', image: movie_2 },
];

const SearchBar = ({ value, onChangeText, onSubmit, placeholder }) => (
    <View style={searchBarStyles.searchBarContainer}>
        <TextInput
            style={searchBarStyles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#B4C1D4"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            returnKeyType="search"
        />
        <TouchableOpacity onPress={onSubmit}>
            <Ionicons name="search" size={20} color="#B4C1D4" />
        </TouchableOpacity>
    </View>
);

const searchBarStyles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3F6D',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        marginRight: 10,
    },
});

const CategoryTabs = ({ selectedTab, setSelectedTab }) => (
    <View style={categoryStyles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={categoryStyles.tabsContainer}>
            {CATEGORY_TABS.map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        categoryStyles.tab,
                        selectedTab === tab ? categoryStyles.tabSelected : categoryStyles.tabUnselected,
                    ]}
                    onPress={() => setSelectedTab(tab)}
                >
                    <Text
                        style={[
                            categoryStyles.tabText,
                            selectedTab === tab ? categoryStyles.tabTextSelected : categoryStyles.tabTextUnselected,
                        ]}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const categoryStyles = StyleSheet.create({
    tabsWrapper: {
        marginBottom: 30,
    },
    tabsContainer: {
        paddingRight: 20,
    },
    tab: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    tabUnselected: {
        backgroundColor: '#1E3F6D',
    },
    tabSelected: {
        backgroundColor: '#08B451',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tabTextUnselected: {
        color: 'white',
    },
    tabTextSelected: {
        color: 'white',
    },
});

const RecentSearches = ({ data, onSearchSelect }) => (
    <View style={recentStyles.recentContainer}>
        <Text style={recentStyles.recentTitle}>Recent Search</Text>
        {data.length === 0 ? (
            <Text style={recentStyles.emptyText}>No recent searches</Text>
        ) : (
            data.map((item, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={recentStyles.recentItem}
                    onPress={() => onSearchSelect(item)}
                >
                    <Text style={recentStyles.recentItemText}>{item}</Text>
                    <Ionicons name="arrow-up-circle-outline" size={18} color="#B4C1D4" />
                </TouchableOpacity>
            ))
        )}
    </View>
);

const recentStyles = StyleSheet.create({
    recentContainer: {
        backgroundColor: '#1E3F6D',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 30,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    recentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#21477C',
    },
    recentItemText: {
        fontSize: 16,
        color: 'white',
    },
    emptyText: {
        fontSize: 14,
        color: '#B4C1D4',
        textAlign: 'center',
        paddingVertical: 10,
    },
});

const TopSearched = ({ data }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={topStyles.movieCard}>
            <Image source={item.image} style={topStyles.posterImage} resizeMode="cover" />
        </TouchableOpacity>
    );

    return (
        <View style={topStyles.sectionContainer}>
            <View style={topStyles.sectionHeader}>
                <Text style={topStyles.sectionTitle}>Top searched</Text>
                <TouchableOpacity>
                    <Text style={topStyles.seeMoreText}>See More</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
            />
        </View>
    );
};

const topStyles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    seeMoreText: {
        fontSize: 14,
        color: '#08B451',
    },
    movieCard: {
        width: 150,
        height: 220,
        borderRadius: 10,
        marginRight: 15,
        overflow: 'hidden',
    },
    posterImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

const Search = () => {
    const { t } = useLanguage();
    const [selectedTab, setSelectedTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    const loadRecentSearches = async () => {
        try {
            const searches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
            if (searches) {
                setRecentSearches(JSON.parse(searches));
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
        }
    };

    const saveRecentSearch = async (query) => {
        if (!query.trim()) return;
        
        try {
            const trimmedQuery = query.trim();
            let searches = [...recentSearches];
            
            // Remove if already exists
            searches = searches.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase());
            
            // Add to beginning
            searches.unshift(trimmedQuery);
            
            // Keep only last 10 searches
            searches = searches.slice(0, 10);
            
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
            setRecentSearches(searches);
        } catch (error) {
            console.error('Error saving recent search:', error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            saveRecentSearch(searchQuery);
            // Perform actual search here
            console.log('Searching for:', searchQuery);
        }
    };

    const handleRecentSearchSelect = (query) => {
        setSearchQuery(query);
        saveRecentSearch(query);
        // Perform actual search here
        console.log('Searching for:', query);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search movies</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SearchBar 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmit={handleSearch}
                    placeholder={t('searchMovies')}
                />
                <CategoryTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <RecentSearches 
                    data={recentSearches} 
                    onSearchSelect={handleRecentSearchSelect}
                />
                <TopSearched data={TOP_SEARCHED_DATA} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F294F',
        paddingTop: 70,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#1E3F6D',
        padding: 8,
        borderRadius: 50,
        marginRight: 20,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
});

export default Search;
