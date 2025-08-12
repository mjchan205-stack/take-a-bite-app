// Reusable OrderCard component for displaying order information
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/globalStyles';
import { orderStatuses } from '../data/ordersData';

const OrderCard = ({ order, onPress, showCustomerInfo = true }) => {
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

  const formatDate = (date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTotalItems = () => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <TouchableOpacity 
      style={[commonStyles.card, { marginHorizontal: 16, marginVertical: 8 }]}
      onPress={() => onPress && onPress(order)}
    >
      <View style={commonStyles.flexRowBetween}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
            Order #{order.id}
          </Text>
          
          {showCustomerInfo && (
            <View style={{ marginBottom: 8 }}>
              <Text style={commonStyles.text}>
                {order.customerName}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {order.customerPhone}
              </Text>
            </View>
          )}
          
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
            {getTotalItems()} items • ${order.totalAmount.toFixed(2)}
          </Text>
          
          <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
            {order.orderType === 'pickup' ? '📦 Pickup' : '🚚 Delivery'}
          </Text>
          
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            Ordered: {formatDate(order.orderDate)}
          </Text>
          
          {order.estimatedReady && (
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              Ready: {formatDate(order.estimatedReady)}
            </Text>
          )}
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <View style={[
            commonStyles.badge,
            { backgroundColor: getStatusColor(order.status) }
          ]}>
            <Text style={commonStyles.badgeText}>
              {order.status.toUpperCase()}
            </Text>
          </View>
          
          {order.specialInstructions && (
            <Text style={[commonStyles.textSecondary, { 
              fontSize: 12, 
              marginTop: 8, 
              fontStyle: 'italic',
              textAlign: 'right',
              maxWidth: 120
            }]}>
              📝 {order.specialInstructions}
            </Text>
          )}
        </View>
      </View>
      
      {/* Order items summary */}
      <View style={[commonStyles.divider, { marginVertical: 12 }]} />
      <View>
        {order.items.map((item, index) => (
          <Text key={index} style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            {item.quantity}x {item.cookieName} - ${(item.quantity * item.price).toFixed(2)}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;