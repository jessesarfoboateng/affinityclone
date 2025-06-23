import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTempData = async <T>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving temp data for key "${key}":`, error);
  }
};

export const getTempData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting temp data for key "${key}":`, error);
    return null;
  }
};

export const clearTempData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing temp data for key "${key}":`, error);
  }
};
