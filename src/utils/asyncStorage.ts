import AsyncStorage from '@react-native-community/async-storage';
import {Logger} from '.';

const TAG = 'utils/asyncStorage';
/**
 * Store data in local storage
 * @param key
 * @param value
 */
const storeData = async (key: string, value: any) => {
  try {
    Logger.log(`store ${key} in async storage`);
    const jsonValue = JSON.stringify(value, getCircularReplacer());
    await AsyncStorage.setItem(`@${key}`, jsonValue);
  } catch (e) {
    Logger.recordError(e, TAG);
  }
};

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

/**
 * Get data from local storage
 * @param key
 * @returns
 */
const getData = async (key: string) => {
  try {
    Logger.log(`get ${key} in async storage`);
    const jsonValue = await AsyncStorage.getItem(`@${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Logger.recordError(e, TAG);
  }
};

export default {
  storeData,
  getData,
};
