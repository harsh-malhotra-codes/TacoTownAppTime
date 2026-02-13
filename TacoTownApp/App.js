import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  RefreshControl, Alert, SafeAreaView, Platform, ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// --- CONFIGURATION ---
const API_URL = 'https://tacotownapp.onrender.com/api/orders';
const POLL_INTERVAL = 15000; // 15 seconds

// --- NOTIFICATION SETUP ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All'); // All, Pending, Accepted, Rejected, Delivered
  const previousOrderIds = useRef(new Set());

  // --- INITIALIZATION ---
  useEffect(() => {
    registerForPushNotificationsAsync();
    fetchOrders();

    // Auto-refresh interval
    const intervalId = setInterval(() => {
      fetchOrders(true); // true = background refresh (no loading spinner)
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // --- API FUNCTIONS ---
  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      
      if (json.success && json.data) {
        const newOrders = json.data;
        
        // Check for new orders to trigger notification
        checkForNewOrders(newOrders);
        
        setOrders(newOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (!isBackground) Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      if (!isBackground) setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Optimistic update (update UI immediately)
      setOrders(prev => prev.map(o => 
        o.order_id === orderId ? { ...o, status: newStatus } : o
      ));

      const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const json = await response.json();
      if (!json.success) throw new Error(json.message);
      
      fetchOrders(true); // Refresh to ensure sync
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
      fetchOrders(); // Revert on error
    }
  };

  const deleteOrder = async (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to remove this order permanently?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              // Optimistic remove
              setOrders(prev => prev.filter(o => o.order_id !== orderId));

              const response = await fetch(`${API_URL}/${orderId}`, {
                method: 'DELETE',
              });
              
              const json = await response.json();
              if (!json.success) throw new Error(json.message);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete order');
              fetchOrders();
            }
          }
        }
      ]
    );
  };

  // --- HELPER LOGIC ---
  const checkForNewOrders = (currentOrders) => {
    // If it's the first load, just populate the Set
    if (previousOrderIds.current.size === 0) {
      currentOrders.forEach(o => previousOrderIds.current.add(o.order_id));
      return;
    }

    // Check if any order in the new list is NOT in the previous set
    const newArrivals = currentOrders.filter(o => !previousOrderIds.current.has(o.order_id));
    
    if (newArrivals.length > 0) {
      sendNotification(newArrivals.length);
      // Update the set
      currentOrders.forEach(o => previousOrderIds.current.add(o.order_id));
    }
  };

  const sendNotification = async (count) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌮 New Order Received!",
        body: `You have ${count} new order(s) waiting.`,
        sound: true,
      },
      trigger: null, // Immediate
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getFilteredOrders = () => {
    if (filter === 'All') return orders;
    return orders.filter(o => o.status?.toLowerCase() === filter.toLowerCase());
  };

  // --- RENDER COMPONENTS ---
  const renderStatusBadge = (status) => {
    let color = '#757575'; // Default Gray
    let bg = '#EEEEEE';
    
    switch(status?.toLowerCase()) {
      case 'confirmed': // Pending
        color = '#F57C00'; // Orange/Yellow
        bg = '#FFF3E0';
        break;
      case 'accepted':
        color = '#388E3C'; // Green
        bg = '#E8F5E9';
        break;
      case 'rejected':
        color = '#D32F2F'; // Red
        bg = '#FFEBEE';
        break;
      case 'delivered':
        color = '#1976D2'; // Blue
        bg = '#E3F2FD';
        break;
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color: color }]}>
          {status?.toUpperCase() || 'UNKNOWN'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const status = item.status?.toLowerCase() || 'confirmed';
    const isPending = status === 'confirmed';
    const isAccepted = status === 'accepted';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.orderId}>#{item.order_id}</Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.divider} />

        <View style={styles.itemsContainer}>
          {item.order_items && item.order_items.map((food, index) => (
            <Text key={index} style={styles.itemText}>
              • {food.quantity}x {food.name}
            </Text>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.totalAmount}>₹{item.total_amount}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          {isPending && (
            <>
              <TouchableOpacity 
                style={[styles.btn, styles.btnReject]} 
                onPress={() => updateOrderStatus(item.order_id, 'rejected')}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.btnAccept]} 
                onPress={() => updateOrderStatus(item.order_id, 'accepted')}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
            </>
          )}

          {isAccepted && (
            <TouchableOpacity 
              style={[styles.btn, styles.btnDeliver]} 
              onPress={() => updateOrderStatus(item.order_id, 'delivered')}
            >
              <Text style={styles.btnText}>Mark Delivered</Text>
            </TouchableOpacity>
          )}

          {(!isPending && !isAccepted) && (
            <TouchableOpacity 
              style={[styles.btn, styles.btnDelete]} 
              onPress={() => deleteOrder(item.order_id)}
            >
              <Text style={[styles.btnText, {color: '#666'}]}>Delete Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Taco Town Orders</Text>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Confirmed', 'Accepted', 'Delivered', 'Rejected'].map((f) => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'Confirmed' ? 'Pending' : f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ORDER LIST */}
      <FlatList
        data={getFilteredOrders()}
        renderItem={renderItem}
        keyExtractor={item => item.order_id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#E65100',
  },
  listContent: {
    padding: 15,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderId: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAccept: {
    backgroundColor: '#4CAF50',
  },
  btnReject: {
    backgroundColor: '#EF5350',
  },
  btnDeliver: {
    backgroundColor: '#2196F3',
  },
  btnDelete: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});