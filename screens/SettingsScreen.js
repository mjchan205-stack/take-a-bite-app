// Settings Screen - Update menu items, prices, and business info
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/globalStyles';
import { businessInfo } from '../data/cookiesData';
import { clearAllData } from '../utils/storage';

const SettingsScreen = ({ navigation }) => {
  const [businessSettings, setBusinessSettings] = useState({
    name: businessInfo.name,
    tagline: businessInfo.tagline,
    phone: businessInfo.phone,
    email: businessInfo.email,
    address: businessInfo.address,
    weekdayHours: businessInfo.hours.weekdays,
    weekendHours: businessInfo.hours.weekends,
    deliveryTime: businessInfo.deliveryTime,
    pickupTime: businessInfo.pickupTime
  });

  const [appSettings, setAppSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    autoConfirmOrders: false,
    showStockCount: true
  });

  const handleSaveBusinessInfo = () => {
    // In a real app, this would save to AsyncStorage or API
    Alert.alert(
      'Settings Saved',
      'Business information has been updated successfully!',
      [{ text: 'OK' }]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all orders, reset inventory, and restore sample data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert(
                'Data Reset Complete',
                'All data has been reset to defaults. Please restart the app.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Welcome')
                  }
                ]
              );
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data');
            }
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature would export your orders and inventory data to a file for backup purposes.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* Header */}
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Settings ⚙️</Text>
      </View>

      <ScrollView style={commonStyles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Business Information */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Business Information 🏪
          </Text>
          
          <Text style={commonStyles.label}>Business Name</Text>
          <TextInput
            style={commonStyles.input}
            value={businessSettings.name}
            onChangeText={(text) => setBusinessSettings({...businessSettings, name: text})}
            placeholder="Enter business name"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={commonStyles.label}>Tagline</Text>
          <TextInput
            style={commonStyles.input}
            value={businessSettings.tagline}
            onChangeText={(text) => setBusinessSettings({...businessSettings, tagline: text})}
            placeholder="Enter tagline"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={commonStyles.label}>Phone</Text>
          <TextInput
            style={commonStyles.input}
            value={businessSettings.phone}
            onChangeText={(text) => setBusinessSettings({...businessSettings, phone: text})}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={commonStyles.label}>Email</Text>
          <TextInput
            style={commonStyles.input}
            value={businessSettings.email}
            onChangeText={(text) => setBusinessSettings({...businessSettings, email: text})}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={commonStyles.label}>Address</Text>
          <TextInput
            style={[commonStyles.input, { height: 60, textAlignVertical: 'top' }]}
            value={businessSettings.address}
            onChangeText={(text) => setBusinessSettings({...businessSettings, address: text})}
            placeholder="Enter business address"
            multiline
            numberOfLines={2}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Hours & Timing */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Hours & Timing ⏰
          </Text>
          
          <Text style={commonStyles.label}>Weekday Hours</Text>
          <TextInput
            style={commonStyles.input}
            value={businessSettings.weekdayHours}
            onChangeText={(text) => setBusinessSettings({...businessSettings, weekdayHours: text})}
            placeholder="e.g., 7:00 AM - 8:00 PM"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={commonStyles.label}>Weekend Hours</Text>
          <TextInput
            style={commonStyles.input}
            value={businessSettings.weekendHours}
            onChangeText={(text) => setBusinessSettings({...businessSettings, weekendHours: text})}
            placeholder="e.g., 8:00 AM - 9:00 PM"
            placeholderTextColor={colors.textSecondary}
          />
          
          <View style={commonStyles.flexRowBetween}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={commonStyles.label}>Pickup Time (minutes)</Text>
              <TextInput
                style={commonStyles.input}
                value={businessSettings.pickupTime.toString()}
                onChangeText={(text) => setBusinessSettings({
                  ...businessSettings, 
                  pickupTime: parseInt(text) || 15
                })}
                placeholder="15"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={commonStyles.label}>Delivery Time (minutes)</Text>
              <TextInput
                style={commonStyles.input}
                value={businessSettings.deliveryTime.toString()}
                onChangeText={(text) => setBusinessSettings({
                  ...businessSettings, 
                  deliveryTime: parseInt(text) || 30
                })}
                placeholder="30"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={[commonStyles.button, { marginTop: 10 }]}
            onPress={handleSaveBusinessInfo}
          >
            <Text style={commonStyles.buttonText}>
              💾 Save Business Info
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            App Settings 📱
          </Text>
          
          <View style={[commonStyles.flexRowBetween, { marginBottom: 15 }]}>
            <Text style={commonStyles.text}>Push Notifications</Text>
            <Switch
              value={appSettings.pushNotifications}
              onValueChange={(value) => setAppSettings({...appSettings, pushNotifications: value})}
              thumbColor={appSettings.pushNotifications ? colors.primary : colors.textSecondary}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
          
          <View style={[commonStyles.flexRowBetween, { marginBottom: 15 }]}>
            <Text style={commonStyles.text}>Email Notifications</Text>
            <Switch
              value={appSettings.emailNotifications}
              onValueChange={(value) => setAppSettings({...appSettings, emailNotifications: value})}
              thumbColor={appSettings.emailNotifications ? colors.primary : colors.textSecondary}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
          
          <View style={[commonStyles.flexRowBetween, { marginBottom: 15 }]}>
            <Text style={commonStyles.text}>Auto-confirm Orders</Text>
            <Switch
              value={appSettings.autoConfirmOrders}
              onValueChange={(value) => setAppSettings({...appSettings, autoConfirmOrders: value})}
              thumbColor={appSettings.autoConfirmOrders ? colors.primary : colors.textSecondary}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
          
          <View style={commonStyles.flexRowBetween}>
            <Text style={commonStyles.text}>Show Stock Count to Customers</Text>
            <Switch
              value={appSettings.showStockCount}
              onValueChange={(value) => setAppSettings({...appSettings, showStockCount: value})}
              thumbColor={appSettings.showStockCount ? colors.primary : colors.textSecondary}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            Data Management 💾
          </Text>
          
          <TouchableOpacity
            style={[commonStyles.button, { marginBottom: 12 }]}
            onPress={handleExportData}
          >
            <Text style={commonStyles.buttonText}>
              📤 Export Data
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[commonStyles.buttonSecondary, { 
              marginBottom: 12,
              borderColor: colors.error 
            }]}
            onPress={handleResetData}
          >
            <Text style={[commonStyles.buttonSecondaryText, { color: colors.error }]}>
              🔄 Reset All Data
            </Text>
          </TouchableOpacity>
          
          <View style={{
            backgroundColor: colors.accent,
            padding: 12,
            borderRadius: 8
          }}>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              ⚠️ Reset will delete all orders and reset inventory to defaults. 
              Export your data first if you want to keep a backup.
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 15 }]}>
            App Information ℹ️
          </Text>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={commonStyles.text}>App Version: 1.0.0</Text>
          </View>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={commonStyles.text}>Built with React Native & Expo</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={commonStyles.text}>For educational purposes</Text>
          </View>
          
          <TouchableOpacity
            style={commonStyles.buttonSecondary}
            onPress={() => Alert.alert(
              'About Take a Bite',
              'This is a sample cookie business mobile app built with React Native and Expo. It demonstrates common mobile app features like navigation, forms, data persistence, and more.\n\nPerfect for learning mobile development!',
              [{ text: 'Got it!' }]
            )}
          >
            <Text style={commonStyles.buttonSecondaryText}>
              ℹ️ About This App
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <TouchableOpacity
            style={commonStyles.button}
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <Text style={commonStyles.buttonText}>
              📊 Back to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;