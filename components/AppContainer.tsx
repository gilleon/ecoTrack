import React from 'react';
import { StatusBar } from 'expo-status-bar';

interface AppContainerProps {
  children: React.ReactNode;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
}

export const AppContainer: React.FC<AppContainerProps> = ({
  children,
  statusBarStyle = 'auto'
}) => {
  return (
    <>
      {children}
      <StatusBar style={statusBarStyle} />
    </>
  );
};