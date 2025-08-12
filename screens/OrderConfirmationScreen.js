// Order Confirmation Screen - Show order summary and estimated ready time
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';

const OrderConfirmationScreen = ({ navigation, route }) => {
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

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={[commonStyles.header, { backgroundColor: colors.success }]}>
        <Text style={commonStyles.headerTitle}>Order Confirmed! 🎉</Text>
      </View>

      <ScrollView style={commonStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Success Message */}
        <View style={[commonStyles.card, { 
          marginTop: 20, 
          backgroundColor: colors.success,
          alignItems: 'center'
        }]}>
          <Text style={{ fontSize: 48, marginBottom: 10 }}>✅</Text>
          <Text style={[commonStyles.title, { 
            color: colors.white, 
            textAlign: 'center',
            marginBottom: 8
          }]}>
            Order Placed Successfully!
          </Text>
          <Text style={[commonStyles.text, { 
            color: colors.white, 
            textAlign: 'center',
            fontSize: 16
          }]}>
            Thank you for choosing Take a Bite! 🍪
          </Text>
        </View>

        {/* Order Details */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15, textAlign: 'center' }]}>
            Order Details
          </Text>
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={[commonStyles.label, { marginBottom: 0 }]}>Order #:</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>{order.id}</Text>
          </View>
          
          <View style={[commonStyles.divider, { marginVertical: 12 }]} />
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={commonStyles.text}>Customer:</Text>
            <Text style={commonStyles.text}>{order.customerName}</Text>
          </View>
          
          <View style={[{ marginVertical: 8 }, commonStyles.flexRowBetween]}>
            <Text style={commonStyles.text}>Phone:</Text>
            <Text style={commonStyles.text}>{order.customerPhone}</Text>
          </View>
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={commonStyles.text}>Email:</Text>
            <Text style={[commonStyles.text, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
              {order.customerEmail}
            </Text>
          </View>
          
          <View style={[commonStyles.divider, { marginVertical: 12 }]} />
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={commonStyles.text}>Order Type:</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {order.orderType === 'pickup' ? '📦 Pickup' : '🚚 Delivery'}
            </Text>
          </View>
          
          {order.deliveryAddress && (
            <View style={{ marginTop: 8 }}>
              <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
                <Text style={{ fontWeight: '600' }}>Delivery Address:</Text>
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 14, marginTop: 4 }]}>
                {order.deliveryAddress}
              </Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Items Ordered ({getTotalItems()} cookies)
          </Text>
          
          {order.items.map((item, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <View style={commonStyles.flexRowBetween}>
                <Text style={[commonStyles.text, { flex: 1 }]}>
                  {item.cookieName}
                </Text>
                <Text style={commonStyles.text}>
                  {item.quantity}x
                </Text>
              </View>
              <View style={commonStyles.flexRowBetween}>
                <Text style={commonStyles.textSecondary}>
                  ${item.price.toFixed(2)} each
                </Text>
                <Text style={[commonStyles.price, { fontSize: 16 }]}>
                  ${(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
              {index < order.items.length - 1 && (
                <View style={[commonStyles.divider, { marginVertical: 8 }]} />
              )}
            </View>
          ))}
          
          <View style={[commonStyles.divider, { marginVertical: 15 }]} />
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={[commonStyles.subtitle, { marginBottom: 0 }]}>
              Total Amount:
            </Text>
            <Text style={[commonStyles.price, { fontSize: 20 }]}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Timing Information */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Timing Information ⏰
          </Text>
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={commonStyles.text}>Order Placed:</Text>
            <Text style={commonStyles.text}>
              {formatDate(order.orderDate)}
            </Text>
          </View>
          
          <View style={[{ marginTop: 12 }, commonStyles.flexRowBetween]}>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              Estimated Ready:
            </Text>
            <Text style={[commonStyles.text, { 
              fontWeight: '600', 
              color: colors.success 
            }]}>
              {formatDate(order.estimatedReady)}
            </Text>
          </View>
          
          <View style={{ 
            marginTop: 15, 
            padding: 12, 
            backgroundColor: colors.accent, 
            borderRadius: 8 
          }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              💡 You will receive updates about your order status. 
              {order.orderType === 'pickup' 
                ? ' Please arrive at the estimated ready time for pickup.'
                : ' Our delivery team will contact you when your order is ready for delivery.'
              }
            </Text>
          </View>
        </View>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <View style={commonStyles.card}>
            <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
              Special Instructions 📝
            </Text>
            <Text style={[commonStyles.text, { fontStyle: 'italic' }]}>
              "{order.specialInstructions}"
            </Text>
          </View>
        )}

        {/* Contact Information */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Need Help? 📞
          </Text>
          
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
            If you have any questions about your order, please contact us:
          </Text>
          
          <Text style={[commonStyles.text, { textAlign: 'center', fontWeight: '600' }]}>
            📞 (555) 123-BITE
          </Text>
          <Text style={[commonStyles.text, { textAlign: 'center', fontWeight: '600' }]}>
            ✉️ orders@takeabite.com
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <TouchableOpacity
            style={[commonStyles.button, { marginBottom: 15 }]}
            onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
          >
            <Text style={commonStyles.buttonText}>
              📱 Track This Order
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

export default OrderConfirmationScreen;