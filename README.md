# Take a Bite - Cookie Business Mobile App 🍪

A complete React Native mobile app for a cookie business, built with Expo. This app provides both customer-facing features for ordering cookies and business owner features for managing orders and inventory.

## Features ✨

### Customer Features
- **Welcome Screen** - App introduction with business branding and information
- **Cookie Menu** - Browse available cookies with search and category filtering
- **Order Form** - Create orders with customer information, cookie selection, and delivery options
- **Order Confirmation** - View order summary with estimated ready time
- **Order Tracking** - Track order status with detailed progress updates

### Business Owner Features
- **Admin Dashboard** - Overview of daily orders, sales metrics, and business performance
- **Order Management** - View, update, and complete customer orders with status tracking
- **Inventory Management** - Manage cookie stock levels, prices, and availability
- **Settings** - Update business information, hours, and app preferences

### Technical Features
- **React Navigation** - Smooth navigation between screens with tab and stack navigators
- **AsyncStorage** - Local data persistence for orders, inventory, and settings
- **Form Validation** - Comprehensive validation for order forms and admin inputs
- **Professional UI** - Clean, mobile-responsive design with cookie business branding
- **Sample Data** - Pre-populated with sample cookies and orders for immediate testing

## Screenshots 📱

*Screenshots will be available after running the app*

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install with `npm install -g @expo/cli`
- **Expo Go app** on your mobile device for testing

### For iOS Testing
- iOS device with Expo Go app from App Store

### For Android Testing
- Android device with Expo Go app from Google Play Store

## Installation & Setup 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/mjchan205-stack/take-a-bite-app.git
cd take-a-bite-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

This will start the Expo development server and show a QR code.

### 4. Run on Your Device
- **iOS**: Open Camera app and scan the QR code, then tap the notification to open in Expo Go
- **Android**: Open Expo Go app and scan the QR code
- **Web**: Press `w` in the terminal to open in web browser (limited functionality)

## Usage Guide 🎯

### For Customers
1. **Start on Welcome Screen** - Learn about the business and available features
2. **Browse Menu** - View available cookies, search, and filter by category
3. **Place Order** - Fill out order form with your information and cookie selections
4. **Track Order** - Use order ID to track status and estimated ready time

### For Business Owners
1. **Access Admin** - Tap "Business Owner Login" from the welcome screen
2. **Dashboard** - View today's sales, pending orders, and business metrics
3. **Manage Orders** - Update order statuses, view details, and track progress
4. **Inventory** - Update stock levels, prices, and cookie availability
5. **Settings** - Modify business hours, contact info, and app preferences

## App Structure 📁

```
take-a-bite-app/
├── components/          # Reusable UI components
│   ├── CookieCard.js   # Cookie display component
│   └── OrderCard.js    # Order display component
├── data/               # Sample data files
│   ├── cookiesData.js  # Cookie menu data
│   └── ordersData.js   # Sample orders data
├── screens/            # App screens
│   ├── WelcomeScreen.js
│   ├── MenuScreen.js
│   ├── OrderFormScreen.js
│   ├── OrderConfirmationScreen.js
│   ├── OrderTrackingScreen.js
│   ├── OrderDetailsScreen.js
│   ├── AdminDashboardScreen.js
│   ├── AdminOrdersScreen.js
│   ├── InventoryScreen.js
│   └── SettingsScreen.js
├── styles/             # Styling and themes
│   └── globalStyles.js # Global styles and colors
├── utils/              # Utility functions
│   └── storage.js      # AsyncStorage management
├── App.js              # Main app component
└── package.json        # Dependencies and scripts
```

## Available Scripts 📝

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## Key Technologies 🛠️

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tools
- **React Navigation** - Navigation library for React Native
- **AsyncStorage** - Local data persistence
- **React Native Safe Area Context** - Safe area handling
- **React Native Screens** - Native screen management

## Data Management 💾

The app uses AsyncStorage for local data persistence:
- **Cookies Data** - Menu items with prices and stock levels
- **Orders Data** - Customer orders with status tracking
- **Settings** - Business information and app preferences

All data is stored locally on the device and includes sample data for immediate testing.

## Customization 🎨

### Colors & Branding
Edit `styles/globalStyles.js` to customize the app's color scheme and branding.

### Sample Data
Modify `data/cookiesData.js` and `data/ordersData.js` to change the sample cookies and orders.

### Business Information
Update business details in `data/cookiesData.js` or through the Settings screen in the app.

## Learning Resources 📚

This app demonstrates many key mobile development concepts:

- **Navigation** - Tab navigators and stack navigators
- **Form Handling** - Input validation and state management
- **Data Persistence** - AsyncStorage for local data
- **Component Architecture** - Reusable components and clean code structure
- **Mobile UI/UX** - Professional mobile interface design
- **State Management** - React hooks and state handling

## Common Issues & Solutions 🔧

### Metro bundler issues
```bash
npx expo start --clear
```

### iOS simulator not opening
Make sure you have Xcode installed and an iOS simulator available.

### Android device not connecting
Ensure both your computer and device are on the same WiFi network.

### Dependencies issues
```bash
rm -rf node_modules
npm install
```

## Future Enhancements 🚀

Potential features for future development:
- Push notifications for order updates
- Payment integration (Stripe, PayPal)
- User authentication and accounts
- Real-time order tracking with maps
- Customer reviews and ratings
- Analytics dashboard with charts
- Multi-location support
- Custom cookie builder

## Contributing 🤝

This is an educational project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support 💬

If you have questions or need help:
- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Navigation docs](https://reactnavigation.org/)
- Look at [React Native documentation](https://reactnative.dev/)

## License 📄

This project is open source and available under the MIT License.

## Acknowledgments 🙏

- Built with [Expo](https://expo.dev/)
- Uses [React Navigation](https://reactnavigation.org/) for navigation
- Styled with custom React Native StyleSheet
- Icons are emoji for universal compatibility

---

**Take a Bite** - Making cookie ordering sweet and simple! 🍪✨