// Order Form Screen - Allow customers to create orders
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { getCookies, addOrder } from '../utils/storage';
import { orderStatuses } from '../data/ordersData';

const OrderFormScreen = ({ navigation, route }) => {
  const [cookies, setCookies] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [orderType, setOrderType] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [errors, setErrors] = useState({});

  // Get selected cookie from navigation params if any
  const selectedCookie = route.params?.selectedCookie;

  useEffect(() => {
    loadCookies();
    
    // If a cookie was selected from menu, add it to order items
    if (selectedCookie) {
      setOrderItems([{
        cookieId: selectedCookie.id,
        cookieName: selectedCookie.name,
        price: selectedCookie.price,
        quantity: 1
      }]);
    }
  }, [selectedCookie]);

  const loadCookies = async () => {
    try {
      const cookiesData = await getCookies();
      setCookies(cookiesData.filter(cookie => cookie.inStock));
    } catch (error) {
      console.error('Error loading cookies:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate customer info
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(customerInfo.phone) && customerInfo.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate delivery address if needed
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    // Validate order items
    if (orderItems.length === 0) {
      newErrors.items = 'Please select at least one cookie';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCookieToOrder = (cookie) => {
    const existingItemIndex = orderItems.findIndex(item => item.cookieId === cookie.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if cookie already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add new cookie to order
      const newItem = {
        cookieId: cookie.id,
        cookieName: cookie.name,
        price: cookie.price,
        quantity: 1
      };
      setOrderItems([...orderItems, newItem]);
    }
  };

  const updateCookieQuantity = (cookieId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setOrderItems(orderItems.filter(item => item.cookieId !== cookieId));
    } else {
      // Update quantity
      const updatedItems = orderItems.map(item =>
        item.cookieId === cookieId ? { ...item, quantity: newQuantity } : item
      );
      setOrderItems(updatedItems);
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors above and try again.');
      return;
    }

    try {
      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        items: orderItems,
        totalAmount: calculateTotal(),
        orderType: orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        specialInstructions: specialInstructions,
        status: orderStatuses.PENDING
      };

      const newOrder = await addOrder(orderData);
      
      Alert.alert(
        'Order Placed! 🎉',
        `Your order #${newOrder.id} has been submitted successfully. You will receive a confirmation shortly.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OrderConfirmation', { order: newOrder })
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert('Error', 'Failed to submit order. Please try again.');
    }
  };

  const formatPhone = (text) => {
    // Auto-format phone number as user types
    const digits = text.replace(/\D/g, '');
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={commonStyles.header}>
          <Text style={commonStyles.headerTitle}>Create Order 📝</Text>
        </View>

        <ScrollView style={commonStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Customer Information */}
          <View style={[commonStyles.card, { marginTop: 20 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
              Customer Information
            </Text>
            
            <Text style={commonStyles.label}>Name *</Text>
            <TextInput
              style={[commonStyles.input, errors.name && { borderColor: colors.error }]}
              placeholder="Your full name"
              value={customerInfo.name}
              onChangeText={(text) => setCustomerInfo({...customerInfo, name: text})}
              placeholderTextColor={colors.textSecondary}
            />
            {errors.name && <Text style={commonStyles.errorText}>{errors.name}</Text>}
            
            <Text style={commonStyles.label}>Phone *</Text>
            <TextInput
              style={[commonStyles.input, errors.phone && { borderColor: colors.error }]}
              placeholder="(555) 123-4567"
              value={customerInfo.phone}
              onChangeText={(text) => setCustomerInfo({...customerInfo, phone: formatPhone(text)})}
              keyboardType="phone-pad"
              maxLength={14}
              placeholderTextColor={colors.textSecondary}
            />
            {errors.phone && <Text style={commonStyles.errorText}>{errors.phone}</Text>}
            
            <Text style={commonStyles.label}>Email *</Text>
            <TextInput
              style={[commonStyles.input, errors.email && { borderColor: colors.error }]}
              placeholder="your@email.com"
              value={customerInfo.email}
              onChangeText={(text) => setCustomerInfo({...customerInfo, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.email && <Text style={commonStyles.errorText}>{errors.email}</Text>}
          </View>

          {/* Order Type */}
          <View style={commonStyles.card}>
            <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
              Order Type
            </Text>
            
            <View style={commonStyles.flexRow}>
              <TouchableOpacity
                style={[
                  commonStyles.button,
                  {
                    flex: 1,
                    marginRight: 10,
                    backgroundColor: orderType === 'pickup' ? colors.primary : colors.white,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }
                ]}
                onPress={() => setOrderType('pickup')}
              >
                <Text style={[
                  commonStyles.buttonText,
                  { color: orderType === 'pickup' ? colors.white : colors.primary }
                ]}>
                  📦 Pickup (15 min)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  commonStyles.button,
                  {
                    flex: 1,
                    marginLeft: 10,
                    backgroundColor: orderType === 'delivery' ? colors.primary : colors.white,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }
                ]}
                onPress={() => setOrderType('delivery')}
              >
                <Text style={[
                  commonStyles.buttonText,
                  { color: orderType === 'delivery' ? colors.white : colors.primary }
                ]}>
                  🚚 Delivery (30 min)
                </Text>
              </TouchableOpacity>
            </View>

            {orderType === 'delivery' && (
              <>
                <Text style={[commonStyles.label, { marginTop: 15 }]}>Delivery Address *</Text>
                <TextInput
                  style={[commonStyles.input, errors.deliveryAddress && { borderColor: colors.error }]}
                  placeholder="123 Main Street, City, State, ZIP"
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                  numberOfLines={2}
                  placeholderTextColor={colors.textSecondary}
                />
                {errors.deliveryAddress && <Text style={commonStyles.errorText}>{errors.deliveryAddress}</Text>}
              </>
            )}
          </View>

          {/* Cookie Selection */}
          <View style={commonStyles.card}>
            <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
              Select Cookies
            </Text>
            
            {cookies.map((cookie) => (
              <View key={cookie.id} style={{ marginBottom: 15 }}>
                <View style={commonStyles.flexRowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={commonStyles.text}>
                      {cookie.image} {cookie.name}
                    </Text>
                    <Text style={[commonStyles.price, { fontSize: 16 }]}>
                      ${cookie.price.toFixed(2)} each
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[commonStyles.button, { paddingVertical: 8, paddingHorizontal: 12 }]}
                    onPress={() => addCookieToOrder(cookie)}
                  >
                    <Text style={[commonStyles.buttonText, { fontSize: 14 }]}>Add</Text>
                  </TouchableOpacity>
                </View>
                <View style={[commonStyles.divider, { marginVertical: 10 }]} />
              </View>
            ))}
            
            {errors.items && <Text style={commonStyles.errorText}>{errors.items}</Text>}
          </View>

          {/* Order Summary */}
          {orderItems.length > 0 && (
            <View style={commonStyles.card}>
              <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
                Order Summary
              </Text>
              
              {orderItems.map((item) => (
                <View key={item.cookieId} style={{ marginBottom: 10 }}>
                  <View style={commonStyles.flexRowBetween}>
                    <Text style={commonStyles.text}>
                      {item.cookieName}
                    </Text>
                    <View style={commonStyles.flexRow}>
                      <TouchableOpacity
                        style={[commonStyles.buttonSecondary, { 
                          paddingVertical: 4, 
                          paddingHorizontal: 8,
                          marginRight: 8,
                          minWidth: 30
                        }]}
                        onPress={() => updateCookieQuantity(item.cookieId, item.quantity - 1)}
                      >
                        <Text style={[commonStyles.buttonSecondaryText, { fontSize: 14 }]}>-</Text>
                      </TouchableOpacity>
                      
                      <Text style={[commonStyles.text, { minWidth: 30, textAlign: 'center' }]}>
                        {item.quantity}
                      </Text>
                      
                      <TouchableOpacity
                        style={[commonStyles.buttonSecondary, { 
                          paddingVertical: 4, 
                          paddingHorizontal: 8,
                          marginLeft: 8,
                          minWidth: 30
                        }]}
                        onPress={() => updateCookieQuantity(item.cookieId, item.quantity + 1)}
                      >
                        <Text style={[commonStyles.buttonSecondaryText, { fontSize: 14 }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={[commonStyles.divider, { marginVertical: 15 }]} />
              
              <View style={commonStyles.flexRowBetween}>
                <Text style={[commonStyles.subtitle, { marginBottom: 0 }]}>Total:</Text>
                <Text style={[commonStyles.price, { fontSize: 20 }]}>
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Special Instructions */}
          <View style={commonStyles.card}>
            <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
              Special Instructions (Optional)
            </Text>
            
            <TextInput
              style={[commonStyles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Any special requests or notes..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Submit Button */}
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <TouchableOpacity
              style={[
                commonStyles.button,
                { 
                  paddingVertical: 15,
                  backgroundColor: orderItems.length === 0 ? colors.textSecondary : colors.primary
                }
              ]}
              onPress={handleSubmitOrder}
              disabled={orderItems.length === 0}
            >
              <Text style={[commonStyles.buttonText, { fontSize: 18 }]}>
                Place Order - ${calculateTotal().toFixed(2)} 🛒
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OrderFormScreen;