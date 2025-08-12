// Reusable CookieCard component for displaying cookie information
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/globalStyles';

const CookieCard = ({ cookie, onPress, showAddButton = true, showStock = false }) => {
  const handlePress = () => {
    if (!cookie.inStock) {
      Alert.alert('Out of Stock', `Sorry, ${cookie.name} is currently out of stock.`);
      return;
    }
    if (onPress) {
      onPress(cookie);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        commonStyles.card, 
        !cookie.inStock && { opacity: 0.6 },
        { marginHorizontal: 16, marginVertical: 8 }
      ]}
      onPress={handlePress}
      disabled={!cookie.inStock && !showStock}
    >
      <View style={commonStyles.flexRowBetween}>
        <View style={{ flex: 1 }}>
          <View style={commonStyles.flexRow}>
            <Text style={[commonStyles.emoji, { marginRight: 12 }]}>
              {cookie.image}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
                {cookie.name}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                {cookie.description}
              </Text>
              
              {showStock && (
                <View style={commonStyles.flexRow}>
                  <View style={[
                    commonStyles.badge,
                    { 
                      backgroundColor: cookie.inStock ? colors.success : colors.error,
                      marginRight: 8 
                    }
                  ]}>
                    <Text style={commonStyles.badgeText}>
                      {cookie.inStock ? `${cookie.stockCount} left` : 'Out of Stock'}
                    </Text>
                  </View>
                  <View style={[commonStyles.badge, { backgroundColor: colors.info }]}>
                    <Text style={commonStyles.badgeText}>
                      {cookie.category}
                    </Text>
                  </View>
                </View>
              )}
              
              {!showStock && !cookie.inStock && (
                <View style={[commonStyles.badge, { backgroundColor: colors.error }]}>
                  <Text style={commonStyles.badgeText}>Out of Stock</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={commonStyles.price}>
            ${cookie.price.toFixed(2)}
          </Text>
          
          {showAddButton && cookie.inStock && (
            <TouchableOpacity 
              style={[commonStyles.button, { marginTop: 8, paddingVertical: 8, paddingHorizontal: 12 }]}
              onPress={handlePress}
            >
              <Text style={[commonStyles.buttonText, { fontSize: 14 }]}>
                Add
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CookieCard;