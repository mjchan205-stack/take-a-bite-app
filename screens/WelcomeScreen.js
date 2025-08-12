// Welcome Screen - App intro with business branding
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { businessInfo } from '../data/cookiesData';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={commonStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <View style={{
          backgroundColor: colors.primary,
          paddingVertical: 40,
          paddingHorizontal: 20,
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 48,
            marginBottom: 10
          }}>
            🍪
          </Text>
          <Text style={[commonStyles.title, { 
            color: colors.white, 
            fontSize: 32, 
            marginBottom: 8 
          }]}>
            {businessInfo.name}
          </Text>
          <Text style={[commonStyles.text, { 
            color: colors.white, 
            fontSize: 18,
            fontStyle: 'italic'
          }]}>
            {businessInfo.tagline}
          </Text>
        </View>

        {/* Content Section */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 30 }}>
          {/* Welcome Message */}
          <Text style={[commonStyles.title, { textAlign: 'center', marginBottom: 20 }]}>
            Welcome to our Cookie Paradise! 🎉
          </Text>
          
          <Text style={[commonStyles.text, { 
            textAlign: 'center', 
            marginBottom: 30,
            lineHeight: 24
          }]}>
            Indulge in our freshly baked cookies made with love and the finest ingredients. 
            From classic chocolate chip to gourmet red velvet, we have something for every sweet tooth!
          </Text>

          {/* Features Section */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 15 }]}>
              What We Offer ✨
            </Text>
            
            <View style={{ marginBottom: 12 }}>
              <Text style={commonStyles.text}>🍪 8+ Cookie Varieties</Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={commonStyles.text}>📱 Easy Online Ordering</Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={commonStyles.text}>📦 Pickup & Delivery Options</Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={commonStyles.text}>⏱️ Fresh Daily - Made to Order</Text>
            </View>
            <View>
              <Text style={commonStyles.text}>📍 Track Your Order Status</Text>
            </View>
          </View>

          {/* Business Hours */}
          <View style={[commonStyles.card, { marginBottom: 30 }]}>
            <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 15 }]}>
              Hours & Contact 📞
            </Text>
            
            <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
              <Text style={{ fontWeight: '600' }}>Weekdays:</Text> {businessInfo.hours.weekdays}
            </Text>
            <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
              <Text style={{ fontWeight: '600' }}>Weekends:</Text> {businessInfo.hours.weekends}
            </Text>
            
            <View style={[commonStyles.divider, { marginVertical: 15 }]} />
            
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 4 }]}>
              📞 {businessInfo.phone}
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 4 }]}>
              ✉️ {businessInfo.email}
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              📍 {businessInfo.address}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity 
              style={[commonStyles.button, { marginBottom: 15 }]}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={commonStyles.buttonText}>
                🍪 Browse Our Menu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[commonStyles.buttonSecondary, { marginBottom: 15 }]}
              onPress={() => navigation.navigate('OrderTracking')}
            >
              <Text style={commonStyles.buttonSecondaryText}>
                📱 Track Your Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[commonStyles.button, { 
                backgroundColor: colors.secondary,
                marginBottom: 10 
              }]}
              onPress={() => navigation.navigate('AdminTabs')}
            >
              <Text style={commonStyles.buttonText}>
                👨‍💼 Business Owner Login
              </Text>
            </TouchableOpacity>
            
            <Text style={[commonStyles.textSecondary, { 
              fontSize: 12, 
              textAlign: 'center',
              fontStyle: 'italic'
            }]}>
              Access admin dashboard and manage orders
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;