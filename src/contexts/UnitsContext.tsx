import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeightUnit = 'lb' | 'kg';
export type CarbonUnit = 'kg' | 'lb';

interface UnitsContextType {
  weightUnit: WeightUnit;
  carbonUnit: CarbonUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  setCarbonUnit: (unit: CarbonUnit) => void;
  convertWeight: (value: number, fromUnit: WeightUnit, toUnit: WeightUnit) => number;
  convertCarbon: (value: number, fromUnit: CarbonUnit, toUnit: CarbonUnit) => number;
  formatWeight: (value: number) => string;
  formatCarbon: (value: number) => string;
}

const UnitsContext = createContext<UnitsContextType>({
  weightUnit: 'lb',
  carbonUnit: 'kg',
  setWeightUnit: () => {},
  setCarbonUnit: () => {},
  convertWeight: (value) => value,
  convertCarbon: (value) => value,
  formatWeight: (value) => `${value} lb`,
  formatCarbon: (value) => `${value} kg CO₂`,
});

export const useUnits = () => {
  const context = useContext(UnitsContext);
  return context;
};

export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('lb');
  const [carbonUnit, setCarbonUnitState] = useState<CarbonUnit>('kg');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const [savedWeightUnit, savedCarbonUnit] = await Promise.all([
        AsyncStorage.getItem('weightUnit'),
        AsyncStorage.getItem('carbonUnit'),
      ]);
      
      if (savedWeightUnit && (savedWeightUnit === 'lb' || savedWeightUnit === 'kg')) {
        setWeightUnitState(savedWeightUnit);
      }
      
      if (savedCarbonUnit && (savedCarbonUnit === 'lb' || savedCarbonUnit === 'kg')) {
        setCarbonUnitState(savedCarbonUnit);
      }
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const setWeightUnit = async (unit: WeightUnit) => {
    try {
      await AsyncStorage.setItem('weightUnit', unit);
      setWeightUnitState(unit);
    } catch (error) {
      console.error('Error saving weight unit:', error);
    }
  };

  const setCarbonUnit = async (unit: CarbonUnit) => {
    try {
      await AsyncStorage.setItem('carbonUnit', unit);
      setCarbonUnitState(unit);
    } catch (error) {
      console.error('Error saving carbon unit:', error);
    }
  };

  const convertWeight = (value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'lb' && toUnit === 'kg') {
      return value * 0.453592;
    }
    if (fromUnit === 'kg' && toUnit === 'lb') {
      return value * 2.20462;
    }
    
    return value;
  };

  const convertCarbon = (value: number, fromUnit: CarbonUnit, toUnit: CarbonUnit): number => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'kg' && toUnit === 'lb') {
      return value * 2.20462;
    }
    if (fromUnit === 'lb' && toUnit === 'kg') {
      return value * 0.453592;
    }
    
    return value;
  };

  const formatWeight = (value: number): string => {
    return `${value.toFixed(1)} ${weightUnit}`;
  };

  const formatCarbon = (value: number): string => {
    return `${value.toFixed(1)} ${carbonUnit} CO₂`;
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <UnitsContext.Provider value={{
      weightUnit,
      carbonUnit,
      setWeightUnit,
      setCarbonUnit,
      convertWeight,
      convertCarbon,
      formatWeight,
      formatCarbon,
    }}>
      {children}
    </UnitsContext.Provider>
  );
};