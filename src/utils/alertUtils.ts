import { Alert } from 'react-native';

export const showAlert = (title: string, message: string, buttons?: any[]) => {
  Alert.alert(title, message, buttons || [{ text: 'OK' }]);
};

export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel', onPress: onCancel },
    { text: 'OK', onPress: onConfirm }
  ]);
};

export const showSuccessAlert = (
  title: string,
  message: string,
  actions?: { text: string; onPress: () => void }[]
) => {
  const buttons = actions || [{ text: 'OK', onPress: () => {} }];
  Alert.alert(title, message, buttons);
};