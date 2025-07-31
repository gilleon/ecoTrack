import React, { useState } from 'react';
import { View, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';

interface PhotoPickerProps {
  photos?: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photos = [],
  onPhotosChange,
  maxPhotos = 3,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  const photoList = photos || [];

  const requestPermissions = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const pickFromCamera = async () => {
    if (photoList.length >= maxPhotos) return;

    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera access is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPhotosChange([...photoList, result.assets[0].uri]);
    }
  };

  const pickFromLibrary = async () => {
    if (photoList.length >= maxPhotos) return;

    const hasPermission = await requestPermissions('library');
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Photo library access is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPhotosChange([...photoList, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photoList.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Photos ({photoList.length}/{maxPhotos})
      </Text>
      
      <View style={styles.photoGrid}>
        {photoList.map((uri, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri }} style={styles.photo} />
            <Pressable
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <MaterialIcons name="close" size={16} color="white" />
            </Pressable>
          </View>
        ))}
        
        {photoList.length < maxPhotos && (
          <>
            <Pressable style={styles.addButton} onPress={pickFromCamera}>
              <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
              <Text style={styles.addButtonText}>Camera</Text>
            </Pressable>
            
            <Pressable style={styles.addButton} onPress={pickFromLibrary}>
              <MaterialIcons name="photo-library" size={24} color={colors.primary} />
              <Text style={styles.addButtonText}>Gallery</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}10`,
  },
  addButtonText: {
    fontSize: 10,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
});