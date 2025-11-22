import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supportAPI } from '../../services/api';

const TicketItem = ({ ticket, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#FF9800';
      case 'in_progress':
        return '#2196F3';
      case 'resolved':
        return '#4CAF50';
      case 'closed':
        return '#9E9E9E';
      default:
        return '#B4C1D4';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical':
        return 'construct';
      case 'billing':
        return 'wallet';
      case 'content':
        return 'film';
      case 'account':
        return 'person';
      case 'subscription':
        return 'card';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.ticketItem} onPress={() => onPress(ticket)}>
      <View style={styles.ticketIconBackground}>
        <Ionicons name={getCategoryIcon(ticket.category)} size={20} color="#4A88E1" />
      </View>
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketSubject} numberOfLines={1}>
          {ticket.subject}
        </Text>
        <Text style={styles.ticketNumber}>#{ticket.ticketNumber}</Text>
        <Text style={styles.ticketDate}>{formatDate(ticket.createdAt)}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
        <Text style={styles.statusText}>
          {ticket.status.replace('_', ' ').toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SupportScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('medium');

  const categories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing' },
    { value: 'content', label: 'Content' },
    { value: 'account', label: 'Account' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const [ticketsRes, statsRes] = await Promise.all([
        supportAPI.getUserTickets({ page: 1, limit: 20 }),
        supportAPI.getTicketStats(),
      ]);

      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.data.tickets);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      Alert.alert('Error', 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const response = await supportAPI.createTicket({
        subject,
        description,
        category,
        priority,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Support ticket created successfully');
        setShowCreateModal(false);
        setSubject('');
        setDescription('');
        setCategory('other');
        setPriority('medium');
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      Alert.alert('Error', 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const handleTicketPress = (ticket) => {
    // Navigate to ticket details screen
    console.log('Ticket details:', ticket);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
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
        <Text style={styles.headerTitle}>Support</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Card */}
        {stats && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Open</Text>
              <Text style={styles.statValue}>{stats.open}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>In Progress</Text>
              <Text style={styles.statValue}>{stats.inProgress}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Resolved</Text>
              <Text style={styles.statValue}>{stats.resolved}</Text>
            </View>
          </View>
        )}

        {/* Tickets List */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Your Tickets</Text>
          {tickets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="#B4C1D4" />
              <Text style={styles.emptyText}>No support tickets yet</Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Text style={styles.createFirstButtonText}>Create Your First Ticket</Text>
              </TouchableOpacity>
            </View>
          ) : (
            tickets.map((ticket) => (
              <TicketItem key={ticket._id} ticket={ticket} onPress={handleTicketPress} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Create Ticket Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Support Ticket</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="Brief description of your issue"
                placeholderTextColor="#B4C1D4"
                value={subject}
                onChangeText={setSubject}
              />

              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detailed description of your issue"
                placeholderTextColor="#B4C1D4"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.optionsContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.optionButton,
                      category === cat.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        category === cat.value && styles.optionButtonTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.optionsContainer}>
                {priorities.map((pri) => (
                  <TouchableOpacity
                    key={pri.value}
                    style={[
                      styles.optionButton,
                      priority === pri.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setPriority(pri.value)}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        priority === pri.value && styles.optionButtonTextActive,
                      ]}
                    >
                      {pri.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateTicket}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Ticket</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#1E3F6D',
    padding: 8,
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginLeft: 20,
  },
  createButton: {
    backgroundColor: '#4A88E1',
    padding: 8,
    borderRadius: 50,
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
  ticketsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  ticketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3F6D',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  ticketIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#21477C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  ticketNumber: {
    fontSize: 12,
    color: '#B4C1D4',
    marginBottom: 2,
  },
  ticketDate: {
    fontSize: 11,
    color: '#B4C1D4',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
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
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: '#4A88E1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createFirstButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F294F',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3F6D',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalForm: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#1E3F6D',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#1E3F6D',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3F6D',
  },
  optionButtonActive: {
    backgroundColor: '#4A88E1',
    borderColor: '#4A88E1',
  },
  optionButtonText: {
    color: '#B4C1D4',
    fontSize: 12,
    fontWeight: '600',
  },
  optionButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#4A88E1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SupportScreen;
