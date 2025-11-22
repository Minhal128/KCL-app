import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';

const NotificationItem = ({ notification, onPress, onMarkAsRead }) => {
    const getIconName = (type) => {
        switch (type) {
            case 'content': return 'tv';
            case 'payment': return 'wallet';
            case 'subscription': return 'card';
            case 'system': return 'settings';
            default: return 'notifications';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <TouchableOpacity 
            style={[styles.itemContainer, !notification.isRead && styles.unreadItem]}
            onPress={() => {
                if (!notification.isRead) {
                    onMarkAsRead(notification._id);
                }
                onPress(notification);
            }}
        >
            <View style={styles.iconBackground}>
                <Ionicons name={getIconName(notification.type)} size={20} color="#4A88E1" />
            </View>
            <View style={styles.textWrapper}>
                <Text style={styles.itemTitle}>{notification.title}</Text>
                <Text style={styles.itemDetails}>{notification.message}</Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.itemTime}>{formatTime(notification.createdAt)}</Text>
                {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
        </TouchableOpacity>
    );
};

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await notificationAPI.getUserNotifications({ page: 1, limit: 50 });
            
            if (response.data.success) {
                setNotifications(response.data.data.notifications);
                setUnreadCount(response.data.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationPress = (notification) => {
        console.log('Notification pressed:', notification);
        // Navigate based on notification type/data if needed
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A88E1" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {unreadCount > 0 && (
                <View style={styles.unreadBanner}>
                    <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
                </View>
            )}

            <ScrollView 
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchNotifications(true)} />
                }
            >
                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={60} color="#B4C1D4" />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                ) : (
                    notifications.map(item => (
                        <NotificationItem
                            key={item._id}
                            notification={item}
                            onPress={handleNotificationPress}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))
                )}
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3F6D',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#21477C',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textWrapper: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2,
    },
    itemDetails: {
        fontSize: 13,
        color: '#B4C1D4',
    },
    itemTime: {
        fontSize: 12,
        color: '#B4C1D4',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    unreadItem: {
        borderLeftWidth: 3,
        borderLeftColor: '#4A88E1',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A88E1',
        marginTop: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markAllButton: {
        marginLeft: 'auto',
    },
    markAllText: {
        color: '#4A88E1',
        fontSize: 14,
        fontWeight: '600',
    },
    unreadBanner: {
        backgroundColor: '#1E3F6D',
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    unreadText: {
        color: '#4A88E1',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        color: '#B4C1D4',
        fontSize: 16,
        marginTop: 15,
    },
});

export default Notification;
