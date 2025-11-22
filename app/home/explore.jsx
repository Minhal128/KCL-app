import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNavbar from '../../components/BottomNavbar';

import explore_1 from '../../assets/images/explore/1.png';
import explore_2 from '../../assets/images/explore/2.png';
import explore_3 from '../../assets/images/explore/3.png';
import explore_4 from '../../assets/images/explore/4.png';

const CATEGORY_TABS = ['All', 'Actions', 'Adventures', 'TV series', 'Comedy', 'Drama', 'Sci-Fi'];

const EXPLORE_GRID_DATA = [
    { id: 'e1', title: 'Stranger Things', image: explore_1 },
    { id: 'e2', title: 'The Flash', image: explore_2 },
    { id: 'e3', title: 'Money Heist', image: explore_3 },
    { id: 'e4', title: 'Doctor Who', image: explore_4 },
    { id: 'e5', title: 'The Flash', image: explore_2 },
    { id: 'e6', title: 'Stranger Things', image: explore_1 },
];

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

const ExploreGrid = ({ data }) => {
    const handlePress = (id) => {
        router.push({
            pathname: '/home/single',
            params: { id },
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={gridStyles.gridItem} onPress={() => handlePress(item.id)}>
            <Image source={item.image} style={gridStyles.posterImage} resizeMode="cover" />
            <Text style={gridStyles.itemTitle} numberOfLines={1}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
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
    gridItem: { width: '48%', borderRadius: 10, overflow: 'hidden' },
    posterImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 8 },
    itemTitle: { fontSize: 16, fontWeight: '500', color: 'white', marginLeft: 5 },
});

const Explore = () => {
    const [selectedTab, setSelectedTab] = useState('All');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Find movies, TV series and more..</Text>
                <SearchBar />
                <CategoryTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <ExploreGrid data={EXPLORE_GRID_DATA} />
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
