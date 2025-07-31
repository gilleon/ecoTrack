import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useUnits } from '../../contexts/UnitsContext';
import { EcoActionData } from '../../types';

interface ActionDetailModalProps {
  visible: boolean;
  action: EcoActionData | null;
  onClose: () => void;
}

export const ActionDetailModal: React.FC<ActionDetailModalProps> = ({
  visible,
  action,
  onClose,
}) => {
  const { colors } = useTheme();
  const { weightUnit } = useUnits();
  const styles = createStyles(colors);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!action) return null;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'trash_pickup': return 'delete';
      case 'recycling': return 'recycling';
      case 'zero_waste_camping': return 'nature';
      case 'education': return 'school';
      default: return 'eco';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'trash_pickup': return '#FF6B6B';
      case 'recycling': return '#4ECDC4';
      case 'zero_waste_camping': return '#45B7D1';
      case 'education': return '#96CEB4';
      default: return colors.primary;
    }
  };

  const actionColor = getActionColor(action.type);

  const openPhotoModal = (photo: string) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${actionColor}20` },
                ]}
              >
                <MaterialIcons
                  name={getActionIcon(action.type) as any}
                  size={32}
                  color={actionColor}
                />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.actionTitle}>
                  {action.type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
                <Text style={styles.actionDate}>
                  {formatDate(action.timestamp)}
                </Text>
              </View>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{action.description}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialIcons
                  name="trending-up"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.statValue}>{action.impact}</Text>
                <Text style={styles.statLabel}>{action.impactUnit}</Text>
              </View>
              <View style={styles.statCard}>
                <MaterialIcons name="eco" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>
                  {action.co2Offset.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>kg CO₂ offset</Text>
              </View>
            </View>

            {action.location && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.locationRow}>
                  <MaterialIcons
                    name="location-on"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.locationText}>{action.location}</Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Impact Details</Text>
              <View style={styles.impactDetails}>
                <View style={styles.impactRow}>
                  <Text style={styles.impactLabel}>Environmental Impact</Text>
                  <Text style={styles.impactValue}>
                    {action.impact} {action.impactUnit}
                  </Text>
                </View>
                <View style={styles.impactRow}>
                  <Text style={styles.impactLabel}>CO₂ Offset</Text>
                  <Text style={styles.impactValue}>
                    {action.co2Offset.toFixed(2)} kg
                  </Text>
                </View>
              </View>
            </View>

            {action.photos && action.photos.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Photos ({action.photos.length})
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.photosContainer}>
                    {action.photos.map((photo, index) => (
                      <Pressable
                        key={index}
                        style={styles.photoWrapper}
                        onPress={() => openPhotoModal(photo)}
                      >
                        <Image source={{ uri: photo }} style={styles.photo} />
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: 12,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerText: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    actionDate: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    closeButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    description: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    statsGrid: {
      flexDirection: "row",
      gap: 16,
      marginVertical: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: "center",
    },
    locationRow: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    locationText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
      flex: 1,
    },
    photosContainer: {
      flexDirection: "row",
      gap: 12,
    },
    photoWrapper: {
      alignItems: "center",
    },
    photo: {
      width: 120,
      height: 120,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    impactDetails: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
    },
    impactRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    impactLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    impactValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    bottomSpacing: {
      height: 20,
    },
    photoModalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    photoModalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    photoModalContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    photoModalHeader: {
      position: "absolute",
      top: 60,
      right: 20,
      zIndex: 1,
    },
    photoModalClose: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 20,
      padding: 8,
    },
    fullPhoto: {
      width: "90%",
      height: "80%",
    },
  });