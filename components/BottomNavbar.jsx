import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BottomNavbar = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();

  const tabs = [
    { link: "home/index", name: 'Home', icon: <MaterialCommunityIcons name="home-variant" size={24} color="#73A1E2" />, activeIcon: <MaterialCommunityIcons name="home-variant" size={24} color="#18B451" /> },
    { link: "home/wishlist", name: 'Wish list', icon: <FontAwesome6 name="clipboard-list" size={24} color="#73A1E2" />, activeIcon: <FontAwesome6 name="clipboard-list" size={24} color="#18B451" /> },
    { link: "home/explore", name: 'Explore', icon: <MaterialCommunityIcons name="movie-roll" size={24} color="#73A1E2" />, activeIcon: <MaterialCommunityIcons name="movie-roll" size={24} color="#18B451" /> },
    { link: "home/profile", name: 'Profile', icon: <FontAwesome name="user" size={24} color="#73A1E2" />, activeIcon: <FontAwesome name="user" size={24} color="#18B451" /> },
  ];

  return (
    <View style={[styles.navContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => router.push(tab?.link === "home/index" ? "home" : tab?.link)}
          >
            {route?.name?.includes(tab?.link) ? tab.activeIcon : tab.icon}
            <Text style={{ color: "#18B451" }}>{route?.name?.includes(tab?.link) ? tab.name : ""}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#112f5a',
    borderTopWidth: 1,
    // borderTopColor: '#2A2A2A',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingHorizontal: 0
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
});

export default BottomNavbar;
