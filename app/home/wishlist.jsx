import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavbar from '../../components/BottomNavbar';
import { watchlistAPI } from '../../services/api';

const CATEGORY_TABS = ['All', 'Movies', 'Series', 'Episodes'];

const SearchBar = () => (
    <View style={searchBarStyles.searchBarContainer}>
        <TextInput
            style={searchBarStyles.searchInput}
            placeholder="Search movies, series"
            placeholderTextColor="#B4C1D4"
        />
        <Ionicons name="search" size={20} color="#B4C1D4" />
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
    tabsWrapper: { marginBottom: 20 },
    tabsContainer: { paddingRight: 20 },
    tab: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    tabUnselected: { backgroundColor: '#1E3F6D' },
    tabSelected: { backgroundColor: '#08B451' },
    tabText: { fontSize: 14, fontWeight: '500' },
    tabTextUnselected: { color: 'white' },
    tabTextSelected: { color: 'white' },
});

const ExploreGrid = ({ data, onRemove, loading }) => {
    const handlePress = (id) => {
        router.push({
            pathname: '/home/single',
            params: { id },
        });
    };

    const renderItem = ({ item }) => (
        <View style={gridStyles.gridItem}>
            <TouchableOpacity onPress={() => handlePress(item._id)}>
                <Image 
                    source={{ uri: item.thumbnail || 'https://via.placeholder.com/300x450' }} 
                    style={gridStyles.posterImage} 
                    resizeMode="cover" 
                />
                <Text style={gridStyles.itemTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={gridStyles.removeButton}
                onPress={() => onRemove(item._id)}
            >
                <Ionicons name="close-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={gridStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A88E1" />
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={gridStyles.emptyContainer}>
                <Ionicons name="bookmark-outline" size={60} color="#B4C1D4" />
                <Text style={gridStyles.emptyText}>Your watchlist is empty</Text>
                <Text style={gridStyles.emptySubtext}>Add movies and series to watch later</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={gridStyles.row}
            contentContainerStyle={gridStyles.gridContainer}
        />
    );
};

const gridStyles = StyleSheet.create({
    gridContainer: { paddingBottom: 20 },
    row: { justifyContent: 'space-between', marginBottom: 20 },
    gridItem: { 
        width: '48%', 
        borderRadius: 10, 
        overflow: 'hidden',
        position: 'relative'
    },
    posterImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 8 },
    itemTitle: { 
        fontSize: 14, 
        fontWeight: '500', 
        color: 'white', 
        marginLeft: 5,
        marginBottom: 5
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
    },
    loadingContainer: {
        paddingVertical: 100,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: '#B4C1D4',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    emptySubtext: {
        color: '#B4C1D4',
        fontSize: 14,
        marginTop: 5,
    },
});

const Explore = () => {
    const [selectedTab, setSelectedTab] = useState('All');
    const [watchlist, setWatchlist] = useState([]);
    const [filteredWatchlist, setFilteredWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchWatchlist = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await watchlistAPI.getWatchlist();
            
            if (response.data.success) {
                setWatchlist(response.data.wishlist);
                setFilteredWatchlist(response.data.wishlist);
            }
        } catch (error) {
            // Silently handle 401 errors for Clerk OAuth users
            if (error?.response?.status === 401) {
                console.log('📡 Watchlist not available (Clerk auth)');
                // Set empty watchlist for Clerk users
                setWatchlist([]);
                setFilteredWatchlist([]);
            } else {
                console.error('Error fetching watchlist:', error);
                Alert.alert('Error', `Failed to load watchlist: ${error.response?.status || error.message}`);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        // Log the backend URI for debugging
        import('../../constants/config').then(config => {
            console.log('Backend URI:', config.BACKEND_URI);
        });
        fetchWatchlist();
    }, []);

    useEffect(() => {
        filterWatchlist();
    }, [selectedTab, searchQuery, watchlist]);

    const filterWatchlist = () => {
        let filtered = watchlist;

        // Filter by type
        if (selectedTab !== 'All') {
            const typeMap = {
                'Movies': 'movie',
                'Series': 'series',
                'Episodes': 'episode'
            };
            filtered = filtered.filter(item => item.type === typeMap[selectedTab]);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredWatchlist(filtered);
    };

    const handleRemoveFromWatchlist = async (contentId) => {
        try {
            await watchlistAPI.removeFromWatchlist(contentId);
            setWatchlist(prev => prev.filter(item => item._id !== contentId));
            Alert.alert('Success', 'Removed from watchlist');
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            Alert.alert('Error', 'Failed to remove from watchlist');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchWatchlist(true)} />
                }
            >
                <Text style={styles.title}>Your queue of must-watch moments....</Text>
                <View style={searchBarStyles.searchBarContainer}>
                    <TextInput
                        style={searchBarStyles.searchInput}
                        placeholder="Search watchlist"
                        placeholderTextColor="#B4C1D4"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Ionicons name="search" size={20} color="#B4C1D4" />
                </View>
                <CategoryTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <ExploreGrid 
                    data={filteredWatchlist} 
                    onRemove={handleRemoveFromWatchlist}
                    loading={loading}
                />
            </ScrollView>
            <BottomNavbar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F294F', paddingTop: 70 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    title: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 20, paddingRight: 50 },
});

export default Explore;
