# 🌿 EcoTrack – Leave No Trace Tracker
EcoTrack is a mobile app designed for hikers and nature enthusiasts who want to explore responsibly and reduce their environmental footprint. The app empowers users to log eco-friendly actions during outdoor adventures and rewards them through gamified achievements and visual impact summaries.

---

## 📱 Key Features

- **Impact Logging**
  - Track actions like trash pickup and zero-waste camping
  - Geotag actions for trip summaries and map overlays
  - Works offline during hikes, with automatic cloud sync

- **Gamification & Badges**
  - Earn sustainability badges for completing eco-friendly behaviors
  - Level up as you log actions and build your EcoScore
  - Seasonal challenges with bonus rewards and community goals

- **Trip Summary & Impact Visualization**
  - See your progress: waste removed, CO₂ offset, and actions logged

- **Community & Collaboration**
  - Discover local eco-logs from fellow hikers
  - Participate in group cleanups and track team impact

- **Park Awareness & Education**
  - GPS-based tips aligned with local Leave No Trace guidelines
  - Alerts for fire bans, wildlife precautions, and trail updates

---

## ✅ Development Progress

### Completed Features
- ✅ **Onboarding Flow**
  - Interactive multi-step onboarding with eco-focused messaging
  - Smooth animations and progress indicators
  - Vector icon integration with MaterialIcons and Ionicons

- ✅ **Authentication System**
  - Firebase Auth integration with email/password
  - Secure sign-up and login with form validation
  - Persistent authentication state with AsyncStorage
  - Demo mode for testing without account creation

- ✅ **Core App Navigation & Dashboard**
  - Main dashboard with impact visualization and recent actions
  - 5-tab bottom navigation (Dashboard, Log Action, Trips, Profile, Settings)
  - Dynamic theme switching (Light/Dark mode) with context API
  - Customizable units system (Imperial/Metric weight units)

- ✅ **Impact Logging System**
  - Action logging screen with multiple eco-action types
  - Form validation and data persistence with AsyncStorage
  - Impact tracking with weight conversion (lbs ↔ kg)
  - Action type categories: Trash Pickup, Recycling, Zero Waste Camping, Education

- ✅ **Data Management & Statistics**
  - Comprehensive user statistics tracking (total actions, waste collected, CO₂ offset)
  - Real-time dashboard updates with progress visualization
  - Recent actions display with unit conversion
  - Achievement progress tracking with eco-score calculation

- ✅ **Settings & Personalization**
  - Complete settings screen with theme and unit preferences
  - Data management utilities (export and clear all data functionality)
  - User profile screen with impact summary and activity timeline
  - Modular settings components with proper state management

- ✅ **UI/UX Foundation**
  - Modular component architecture with reusable components
  - Comprehensive theme system with consistent design language
  - Material Design principles with custom eco-friendly styling
  - Responsive design with keyboard handling and accessibility features

### Technical Implementation
- **Authentication**: Firebase Web SDK with React Native persistence
- **State Management**: Context API for auth, theme, and units management
- **Data Storage**: AsyncStorage for offline-first data persistence
- **Form Handling**: Custom hooks for validation and form state management
- **Icons**: Expo Vector Icons (MaterialIcons, Ionicons)
- **Navigation**: Custom screen navigation with 5-tab bottom navigation
- **TypeScript**: Full type safety throughout the application
- **Utility Functions**: Modular data management and validation utilities

---

## 🎨 Design System & Material Design

EcoTrack follows Google's Material Design 3 principles, creating an intuitive and accessible user experience that feels familiar to users while maintaining the app's eco-friendly identity. The design system emphasizes clean layouts, consistent spacing, and thoughtful use of color to guide users through their outdoor adventures.

The Material Design implementation includes elevated cards for content grouping, floating action buttons for primary actions like logging eco-activities, and a comprehensive color palette that reflects nature themes. Typography follows Material Design's type scale with custom weights optimized for outdoor readability, ensuring important information remains visible even in challenging lighting conditions.

Interactive elements like buttons, inputs, and navigation components utilize Material Design's state system with proper focus indicators, ripple effects, and accessibility features. The design system maintains consistency across all screens while allowing for contextual adaptations, such as high-contrast modes for outdoor use and simplified interfaces for quick action logging during hikes.

The app now features a complete theme system with light and dark mode support, ensuring optimal visibility in various outdoor lighting conditions. The dynamic units system allows users to choose between Imperial (pounds) and Metric (kilograms) measurements, with automatic conversion throughout the application.

---

## 📐 App Wireframes

Below are the wireframes showcasing the user interface and flow of EcoTrack:

![Auth Screen Wireframe](./assets/wireframes/login.jpg)

*Authentication screens with onboarding flow*

![Home Screen Wireframe](./assets/wireframes/homescreen.jpg)

*Main dashboard with impact visualization and navigation*

![Impact Logging Wireframe](./assets/wireframes/log-screen.jpg)

*Action logging interface with form validation and type selection*

![Trip Summary Wireframe](/assets/wireframes/stat-screen.jpg)

*Profile screen with statistics and settings access*

---

## 🎯 Target Audience

EcoTrack is built for:
- Individual hikers and backpackers
- Eco-conscious camping groups
- Outdoor organizations and educators
- Park rangers and trail stewards

Whether you're venturing solo or leading a group, EcoTrack helps you turn outdoor impact into progress.

---

## 🚀 Development Roadmap

### Phase 1: Foundation (✅ Complete)
- ✅ Project setup and architecture
- ✅ Authentication system with Firebase
- ✅ Onboarding experience
- ✅ Core UI component library
- ✅ Theme system and responsive design

### Phase 2: Core Features (✅ Complete)
- ✅ Main dashboard with impact visualization
- ✅ 5-tab navigation system (Dashboard, Log, Trips, Profile, Settings)
- ✅ Impact logging interface with action type selection
- ✅ User statistics tracking and progress visualization
- ✅ Settings system with theme and units customization
- ✅ Data management with clear/export functionality

### Phase 3: Data & Advanced Features (🚧 In Progress)
- 🔜 Trip tracking and GPS integration
- 🔜 Badge system and achievement unlocking
- 🔜 Enhanced data visualization with charts
- 🔜 Offline data sync capabilities
- 🔜 Photo attachment for logged actions

### Phase 4: Social & Community (📋 Future)
- 🔜 User profiles and social features
- 🔜 Community eco-logs and sharing
- 🔜 Group cleanups and team tracking
- 🔜 Leaderboards and challenges

### Phase 5: Advanced Features (📋 Future)
- 🔜 Smart logging with image recognition
- 🔜 Park-specific tips and alerts
- 🔜 Ranger dashboard for park statistics
- 🔜 Activity syncing with fitness apps

---

## 📦 Tech Stack

- **Frontend**: Expo React Native with TypeScript
- **Authentication**: Firebase Auth with AsyncStorage persistence
- **Data Storage**: AsyncStorage for offline-first architecture
- **UI Framework**: Custom component library with Material Design principles
- **Icons**: Expo Vector Icons (MaterialIcons, Ionicons)
- **State Management**: React Context API for global state
- **Form Management**: Custom hooks with validation utilities
- **Navigation**: Custom tab-based navigation system
- **Theme System**: Dynamic light/dark mode switching
- **Units System**: Imperial/Metric conversion utilities
- **Backend**: Firebase (Authentication, planned: Firestore)
- **Planned Sensors**: GPS, camera, barometer
- **Development Tools**: VS Code, Expo CLI, Git

---

## 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/gilleon/ecoTrack.git
   cd ecoTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Firebase configuration values
   ```

4. **Start development server**
   ```bash
   npx expo start
   ```

### Environment Variables Required
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Current App Features
- **Dashboard**: Impact visualization with dynamic units and progress tracking
- **Action Logging**: Multiple eco-action types with form validation
- **Profile**: User statistics, activity timeline, and settings access
- **Settings**: Theme switching, units preference, and data management
- **Data Persistence**: Offline-first with AsyncStorage, automatic data sync

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file
