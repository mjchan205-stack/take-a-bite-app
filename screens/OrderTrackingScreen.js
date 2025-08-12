// Order Tracking Screen - Let customers check their order status
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { getOrders } from '../utils/storage';
import OrderCard from '../components/OrderCard';

const OrderTrackingScreen = ({ navigation, route }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Get order ID from navigation params if tracking specific order
  const trackingOrderId = route.params?.orderId;

  useEffect(() => {
    loadOrders();
    
    // If tracking specific order, set it as search query
    if (trackingOrderId) {
      setSearchQuery(trackingOrderId);
    }
  }, [trackingOrderId]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery]);

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders();
      // Sort orders by date (newest first)
      const sortedOrders = ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
    );
    
    setFilteredOrders(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending':
        return 'Your order has been received and is being processed.';
      case 'confirmed':
        return 'Your order has been confirmed and will be prepared soon.';
      case 'preparing':
        return 'Our bakers are currently preparing your delicious cookies!';
      case 'ready':
        return 'Your order is ready! Please come pick it up or expect delivery soon.';
      case 'completed':
        return 'Your order has been completed. Thank you for choosing Take a Bite!';
      case 'cancelled':
        return 'This order has been cancelled. Please contact us if you have questions.';
      default:
        return 'Order status unknown.';
    }
  };

  const getStatusProgress = (status) => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  const renderOrderCard = ({ item }) => (
    <OrderCard
      order={item}
      onPress={handleOrderPress}
      showCustomerInfo={false}
    />
  );

  const renderOrderStatus = (order) => {
    const progress = getStatusProgress(order.status);
    
    return (
      <View style={[commonStyles.card, { marginBottom: 20 }]}>
        <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 15 }]}>
          Order #{order.id} Status
        </Text>
        
        {/* Status Progress Bar */}
        <View style={{
          backgroundColor: colors.border,
          height: 8,
          borderRadius: 4,
          marginBottom: 15
        }}>
          <View style={{
            backgroundColor: order.status === 'cancelled' ? colors.error : colors.success,
            height: 8,
            borderRadius: 4,
            width: `${progress}%`
          }} />
        </View>
        
        {/* Current Status */}
        <View style={{
          backgroundColor: colors.accent,
          padding: 15,
          borderRadius: 8,
          marginBottom: 15
        }}>
          <Text style={[commonStyles.text, { 
            textAlign: 'center', 
            fontWeight: '600',
            marginBottom: 8
          }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
            {order.status === 'preparing' && ' 👨‍🍳'}
            {order.status === 'ready' && ' ✅'}
            {order.status === 'completed' && ' 🎉'}
          </Text>
          
          <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
            {getStatusDescription(order.status)}
          </Text>
        </View>
        
        {/* Estimated Time */}
        {order.estimatedReady && order.status !== 'completed' && order.status !== 'cancelled' && (
          <Text style={[commonStyles.text, { textAlign: 'center' }]}>
            <Text style={{ fontWeight: '600' }}>Estimated Ready:</Text> {' '}
            {order.estimatedReady.toLocaleDateString()} at {' '}
            {order.estimatedReady.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
        
        {order.completedDate && (
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 14 }]}>
            Completed: {order.completedDate.toLocaleDateString()} at {' '}
            {order.completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Track Orders 📱</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <TextInput
          style={commonStyles.input}
          placeholder="Search by order ID, name, or phone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {filteredOrders.length > 0 ? (
          <>
            {/* If tracking specific order, show detailed status */}
            {trackingOrderId && filteredOrders.length === 1 && (
              renderOrderStatus(filteredOrders[0])
            )}
            
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
              🔍
            </Text>
            
            {searchQuery.trim() ? (
              <>
                <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 10 }]}>
                  No orders found
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 20 }]}>
                  No orders match your search criteria. Please check the order ID or try a different search term.
                </Text>
              </>
            ) : (
              <>
                <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 10 }]}>
                  No orders yet
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 20 }]}>
                  When you place orders, they will appear here for tracking.
                </Text>
              </>
            )}
            
            <TouchableOpacity
              style={commonStyles.button}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={commonStyles.buttonText}>
                🍪 Order Some Cookies
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Help Section */}
      {!trackingOrderId && (
        <View style={{ 
          paddingHorizontal: 20, 
          paddingVertical: 15,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border
        }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 10 }]}>
            💡 Tip: Your order ID was provided when you placed your order
          </Text>
          <TouchableOpacity
            style={[commonStyles.buttonSecondary, { paddingVertical: 8 }]}
            onPress={() => Alert.alert(
              'Need Help?',
              'If you need assistance with your order, please call us at (555) 123-BITE or email orders@takeabite.com'
            )}
          >
            <Text style={[commonStyles.buttonSecondaryText, { fontSize: 14 }]}>
              📞 Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderTrackingScreen;