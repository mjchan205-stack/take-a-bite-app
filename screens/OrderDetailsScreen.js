// Order Details Screen - Detailed view of a specific order
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { orderStatuses } from '../data/ordersData';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { order } = route.params || {};

  if (!order) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={commonStyles.text}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTotalItems = () => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case orderStatuses.PENDING:
        return colors.warning;
      case orderStatuses.CONFIRMED:
        return colors.info;
      case orderStatuses.PREPARING:
        return '#FF9800';
      case orderStatuses.READY:
        return colors.success;
      case orderStatuses.COMPLETED:
        return '#4CAF50';
      case orderStatuses.CANCELLED:
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const handleCallBusiness = () => {
    Linking.openURL('tel:(555)123-2483'); // (555) 123-BITE
  };

  const handleEmailBusiness = () => {
    Linking.openURL('mailto:orders@takeabite.com');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView style={commonStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Order Status */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={[commonStyles.title, { marginBottom: 10 }]}>
              Order #{order.id}
            </Text>
            
            <View style={[
              commonStyles.badge,
              { 
                backgroundColor: getStatusColor(order.status),
                paddingVertical: 8,
                paddingHorizontal: 16
              }
            ]}>
              <Text style={[commonStyles.badgeText, { fontSize: 16 }]}>
                {order.status.toUpperCase()}
              </Text>
            </View>
            
            {order.status === orderStatuses.READY && (
              <Text style={[commonStyles.text, { 
                textAlign: 'center', 
                marginTop: 10,
                color: colors.success,
                fontWeight: '600'
              }]}>
                🎉 Your cookies are ready!
              </Text>
            )}
          </View>
        </View>

        {/* Customer Information */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Customer Information
          </Text>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {order.customerName}
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity onPress={handleCallBusiness}>
              <Text style={[commonStyles.text, { color: colors.info }]}>
                📞 {order.customerPhone}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity onPress={handleEmailBusiness}>
              <Text style={[commonStyles.text, { color: colors.info }]} numberOfLines={1}>
                ✉️ {order.customerEmail}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Type & Delivery Info */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Order Type
          </Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
              {order.orderType === 'pickup' ? '📦 Pickup' : '🚚 Delivery'}
            </Text>
            
            {order.orderType === 'pickup' ? (
              <Text style={commonStyles.textSecondary}>
                Please come to our store to pick up your order
              </Text>
            ) : (
              <Text style={commonStyles.textSecondary}>
                We will deliver your order to the address below
              </Text>
            )}
          </View>
          
          {order.deliveryAddress && (
            <>
              <Text style={[commonStyles.label, { marginBottom: 8 }]}>
                Delivery Address:
              </Text>
              <Text style={[commonStyles.text, { 
                backgroundColor: colors.accent,
                padding: 12,
                borderRadius: 8
              }]}>
                📍 {order.deliveryAddress}
              </Text>
            </>
          )}
        </View>

        {/* Order Items */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Order Items ({getTotalItems()} cookies)
          </Text>
          
          {order.items.map((item, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <View style={commonStyles.flexRowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                    {item.cookieName}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    ${item.price.toFixed(2)} each × {item.quantity}
                  </Text>
                </View>
                <Text style={[commonStyles.price, { fontSize: 18 }]}>
                  ${(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
              
              {index < order.items.length - 1 && (
                <View style={[commonStyles.divider, { marginVertical: 10 }]} />
              )}
            </View>
          ))}
          
          <View style={[commonStyles.divider, { marginVertical: 15 }]} />
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 0 }]}>
              Total Amount:
            </Text>
            <Text style={[commonStyles.price, { fontSize: 22 }]}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Timing Information */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Timing Information ⏰
          </Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              Order Placed:
            </Text>
            <Text style={commonStyles.text}>
              {formatDate(order.orderDate)}
            </Text>
          </View>
          
          {order.estimatedReady && (
            <View style={{ marginBottom: 12 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
                Estimated Ready:
              </Text>
              <Text style={[commonStyles.text, { 
                color: order.status === orderStatuses.READY ? colors.success : colors.text,
                fontWeight: order.status === orderStatuses.READY ? '600' : 'normal'
              }]}>
                {formatDate(order.estimatedReady)}
              </Text>
            </View>
          )}
          
          {order.completedDate && (
            <View>
              <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
                Completed:
              </Text>
              <Text style={[commonStyles.text, { color: colors.success }]}>
                {formatDate(order.completedDate)} ✅
              </Text>
            </View>
          )}
        </View>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <View style={commonStyles.card}>
            <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
              Special Instructions 📝
            </Text>
            <View style={{
              backgroundColor: colors.accent,
              padding: 12,
              borderRadius: 8
            }}>
              <Text style={[commonStyles.text, { fontStyle: 'italic' }]}>
                "{order.specialInstructions}"
              </Text>
            </View>
          </View>
        )}

        {/* Status Timeline */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Order Timeline 📋
          </Text>
          
          <View style={{ marginLeft: 10 }}>
            <View style={commonStyles.flexRow}>
              <Text style={[commonStyles.text, { marginRight: 10 }]}>
                {order.status === orderStatuses.PENDING || 
                 order.status === orderStatuses.CONFIRMED || 
                 order.status === orderStatuses.PREPARING ||
                 order.status === orderStatuses.READY ||
                 order.status === orderStatuses.COMPLETED ? '✅' : '⏳'}
              </Text>
              <Text style={commonStyles.text}>Order Received</Text>
            </View>
            
            <View style={[commonStyles.flexRow, { marginTop: 8 }]}>
              <Text style={[commonStyles.text, { marginRight: 10 }]}>
                {order.status === orderStatuses.CONFIRMED || 
                 order.status === orderStatuses.PREPARING ||
                 order.status === orderStatuses.READY ||
                 order.status === orderStatuses.COMPLETED ? '✅' : '⏳'}
              </Text>
              <Text style={commonStyles.text}>Order Confirmed</Text>
            </View>
            
            <View style={[commonStyles.flexRow, { marginTop: 8 }]}>
              <Text style={[commonStyles.text, { marginRight: 10 }]}>
                {order.status === orderStatuses.PREPARING ||
                 order.status === orderStatuses.READY ||
                 order.status === orderStatuses.COMPLETED ? '✅' : '⏳'}
              </Text>
              <Text style={commonStyles.text}>Preparing Cookies</Text>
            </View>
            
            <View style={[commonStyles.flexRow, { marginTop: 8 }]}>
              <Text style={[commonStyles.text, { marginRight: 10 }]}>
                {order.status === orderStatuses.READY ||
                 order.status === orderStatuses.COMPLETED ? '✅' : '⏳'}
              </Text>
              <Text style={commonStyles.text}>Ready for {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</Text>
            </View>
            
            <View style={[commonStyles.flexRow, { marginTop: 8 }]}>
              <Text style={[commonStyles.text, { marginRight: 10 }]}>
                {order.status === orderStatuses.COMPLETED ? '✅' : '⏳'}
              </Text>
              <Text style={commonStyles.text}>Order Completed</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          {order.status !== orderStatuses.COMPLETED && order.status !== orderStatuses.CANCELLED && (
            <TouchableOpacity
              style={[commonStyles.button, { marginBottom: 15 }]}
              onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
            >
              <Text style={commonStyles.buttonText}>
                📱 Track Order Status
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[commonStyles.buttonSecondary, { marginBottom: 15 }]}
            onPress={handleCallBusiness}
          >
            <Text style={commonStyles.buttonSecondaryText}>
              📞 Call Business
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.buttonSecondary}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={commonStyles.buttonSecondaryText}>
              🏠 Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;