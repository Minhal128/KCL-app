import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { paymentAPI } from '../../services/api';

const TransactionItem = ({ transaction, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#B4C1D4';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'google_pay':
        return 'logo-google';
      case 'apple_pay':
        return 'logo-apple';
      case 'card':
        return 'card';
      default:
        return 'wallet';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.transactionItem} onPress={() => onPress(transaction)}>
      <View style={styles.iconBackground}>
        <Ionicons name={getPaymentIcon(transaction.paymentMethod)} size={20} color="#4A88E1" />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {transaction.description || `${transaction.plan} Plan`}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          ${transaction.amount.toFixed(2)}
        </Text>
        <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const fetchTransactions = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [transactionsRes, statsRes] = await Promise.all([
        paymentAPI.getTransactions({ page: pageNum, limit: 20 }),
        paymentAPI.getTransactionStats(),
      ]);

      if (transactionsRes.data.success) {
        if (refresh || pageNum === 1) {
          setTransactions(transactionsRes.data.data.transactions);
        } else {
          setTransactions((prev) => [...prev, ...transactionsRes.data.data.transactions]);
        }
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setPage(1);
    fetchTransactions(1, true);
  };

  const handleTransactionPress = (transaction) => {
    // Navigate to transaction details screen
    console.log('Transaction details:', transaction);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
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
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Card */}
        {stats && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={styles.statValue}>${stats.totalSpent.toFixed(2)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Successful</Text>
              <Text style={styles.statValue}>{stats.successfulTransactions}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{stats.totalTransactions}</Text>
            </View>
          </View>
        )}

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>All Transactions</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#B4C1D4" />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onPress={handleTransactionPress}
              />
            ))
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1E3F6D',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#B4C1D4',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2A5080',
  },
  transactionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3F6D',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
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
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#B4C1D4',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#B4C1D4',
    marginTop: 15,
  },
});

export default TransactionsScreen;
