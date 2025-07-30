import React from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { SettingsMenuItem } from '../settings/SettingsMenuItem';
import { SettingsSection } from '../settings/SettingsSection';

interface ProfileActionsProps {
  onLogout?: () => Promise<void>;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({ onLogout }) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You can always sign back in later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert(
        'Logout Failed',
        'There was an error logging out. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <>
      <SettingsSection title="Account">
        {/* <SettingsMenuItem
          icon="person"
          title="Edit Profile"
          subtitle="Update your information"
          onPress={() => console.log('Edit profile')}
        />
        <SettingsMenuItem
          icon="privacy-tip"
          title="Privacy"
          subtitle="Control your data and privacy"
          onPress={() => console.log('Privacy')}
        /> */}
        <SettingsMenuItem
          icon="logout"
          title="Logout"
          subtitle="Sign out of your account"
          onPress={handleLogout}
        />
      </SettingsSection>

      <SettingsSection title="App">
        <SettingsMenuItem
          icon="settings"
          title="Settings"
          subtitle="App preferences and configuration"
          onPress={handleOpenSettings}
        />
        {/* <SettingsMenuItem
          icon="help"
          title="Help & Support"
          subtitle="Get help with using EcoTrack"
          onPress={() => console.log('Help')}
        />
        <SettingsMenuItem
          icon="star"
          title="Rate App"
          subtitle="Share your feedback on the app store"
          onPress={() => console.log('Rate app')}
        /> */}
      </SettingsSection>
    </>
  );
};