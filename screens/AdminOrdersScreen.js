// Admin Orders Screen - View, update, and complete orders
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  RefreshControl,
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { getOrders, updateOrder } from '../utils/storage';
import { orderStatuses } from '../data/ordersData';
import OrderCard from '../components/OrderCard';

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const statusOptions = [
    { key: 'all', label: 'All Orders', count: 0 },
    { key: orderStatuses.PENDING, label: 'Pending', count: 0 },
    { key: orderStatuses.CONFIRMED, label: 'Confirmed', count: 0 },
    { key: orderStatuses.PREPARING, label: 'Preparing', count: 0 },
    { key: orderStatuses.READY, label: 'Ready', count: 0 },
    { key: orderStatuses.COMPLETED, label: 'Completed', count: 0 }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus, searchQuery]);

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders();
      // Sort orders by date (newest first), but prioritize active orders
      const sortedOrders = ordersData.sort((a, b) => {
        // First sort by status priority (active orders first)
        const statusPriority = {
          [orderStatuses.READY]: 1,
          [orderStatuses.PREPARING]: 2,
          [orderStatuses.CONFIRMED]: 3,
          [orderStatuses.PENDING]: 4,
          [orderStatuses.COMPLETED]: 5,
          [orderStatuses.CANCELLED]: 6
        };
        
        const aPriority = statusPriority[a.status] || 7;
        const bPriority = statusPriority[b.status] || 7;
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // Then sort by date (newest first)
        return new Date(b.orderDate) - new Date(a.orderDate);
      });
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery)
      );
    }

    setFilteredOrders(filtered);
    
    // Update status counts
    statusOptions.forEach(option => {
      if (option.key === 'all') {
        option.count = orders.length;
      } else {
        option.count = orders.filter(order => order.status === option.key).length;
      }
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      const updatedOrder = {
        ...order,
        status: newStatus,
        completedDate: newStatus === orderStatuses.COMPLETED ? new Date() : order.completedDate
      };

      await updateOrder(updatedOrder);
      await loadOrders(); // Reload to get fresh data
      
      const statusMessages = {
        [orderStatuses.CONFIRMED]: 'Order confirmed! Customer will be notified.',
        [orderStatuses.PREPARING]: 'Order is now being prepared.',
        [orderStatuses.READY]: 'Order is ready! Customer will be notified.',
        [orderStatuses.COMPLETED]: 'Order marked as completed!',
        [orderStatuses.CANCELLED]: 'Order has been cancelled.'
      };
      
      Alert.alert('Status Updated', statusMessages[newStatus] || 'Order status updated.');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const showStatusUpdateMenu = (order) => {
    const statusFlow = [
      orderStatuses.PENDING,
      orderStatuses.CONFIRMED,
      orderStatuses.PREPARING,
      orderStatuses.READY,
      orderStatuses.COMPLETED
    ];

    const currentIndex = statusFlow.indexOf(order.status);
    const availableStatuses = [];

    // Add next status in flow
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      availableStatuses.push({
        text: statusFlow[currentIndex + 1].charAt(0).toUpperCase() + statusFlow[currentIndex + 1].slice(1),
        onPress: () => handleStatusChange(order, statusFlow[currentIndex + 1])
      });
    }

    // Add option to mark as ready if not already
    if (order.status !== orderStatuses.READY && order.status !== orderStatuses.COMPLETED) {
      availableStatuses.push({
        text: 'Mark as Ready',
        onPress: () => handleStatusChange(order, orderStatuses.READY)
      });
    }

    // Add option to complete if ready
    if (order.status === orderStatuses.READY) {
      availableStatuses.push({
        text: 'Complete Order',
        onPress: () => handleStatusChange(order, orderStatuses.COMPLETED)
      });
    }

    // Add cancel option for active orders
    if (order.status !== orderStatuses.COMPLETED && order.status !== orderStatuses.CANCELLED) {
      availableStatuses.push({
        text: 'Cancel Order',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
              { text: 'No', style: 'cancel' },
              { text: 'Yes', onPress: () => handleStatusChange(order, orderStatuses.CANCELLED) }
            ]
          );
        }
      });
    }

    availableStatuses.push({ text: 'View Details', onPress: () => navigation.navigate('AdminOrderDetails', { order }) });
    availableStatuses.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      `Order #${order.id}`,
      `Current status: ${order.status.toUpperCase()}`,
      availableStatuses
    );
  };

  const renderOrderCard = ({ item }) => (
    <OrderCard
      order={item}
      onPress={() => showStatusUpdateMenu(item)}
      showCustomerInfo={true}
    />
  );

  const renderStatusFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        commonStyles.button,
        {
          marginRight: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: selectedStatus === item.key ? colors.primary : colors.white,
          borderWidth: 1,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => setSelectedStatus(item.key)}
    >
      <Text style={[
        commonStyles.buttonText,
        {
          fontSize: 12,
          color: selectedStatus === item.key ? colors.white : colors.primary
        }
      ]}>
        {item.label}
        {item.count > 0 && (
          <Text style={{ fontWeight: 'normal' }}> ({item.count})</Text>
        )}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Manage Orders 📋</Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <TextInput
          style={commonStyles.input}
          placeholder="Search orders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Status Filter */}
      <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
        <FlatList
          data={statusOptions}
          renderItem={renderStatusFilter}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Orders List */}
      <View style={{ flex: 1 }}>
        {filteredOrders.length > 0 ? (
          <>
            <Text style={[commonStyles.textSecondary, { 
              paddingHorizontal: 20, 
              marginBottom: 10,
              textAlign: 'center'
            }]}>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </Text>
            
            <FlatList
              data={filteredOrders}
              renderItem={renderOrderCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
            />
          </>
        ) : (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: 40
          }}>
            <Text style={[commonStyles.emoji, { fontSize: 48, marginBottom: 20 }]}>
              📋
            </Text>
            <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 10 }]}>
              {searchQuery.trim() || selectedStatus !== 'all' 
                ? 'No orders found' 
                : 'No orders yet'
              }
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              {searchQuery.trim() || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter settings'
                : 'Orders will appear here when customers place them'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingVertical: 15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[commonStyles.buttonSecondary, { flex: 1, marginRight: 8 }]}
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <Text style={[commonStyles.buttonSecondaryText, { fontSize: 14 }]}>
              📊 Dashboard
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[commonStyles.button, { flex: 1, marginLeft: 8 }]}
            onPress={onRefresh}
          >
            <Text style={[commonStyles.buttonText, { fontSize: 14 }]}>
              🔄 Refresh
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminOrdersScreen;