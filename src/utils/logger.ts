import {AsyncStorage} from '.';
let LOGS: any = [];
/**
 * Logs a debug message
 * @param message
 */
function log(message: string) {
  saveLogs(message);
  if (__DEV__) {
    const tempMessage = message.toLocaleLowerCase();
    if (tempMessage.includes('unmount')) {
      console.log(`[*_*] ⏪ ${message}`);
    } else if (tempMessage.includes('mount')) {
      console.log(`[*_*] ⏩ ${message}`);
    } else if (tempMessage.includes('api')) {
      console.log(`[*_*] 🌐 API: ${message.replace('API', '')}`);
    } else if (tempMessage.includes('realm')) {
      console.log(`[*_*] 📥 Realm: ${message.replace('Realm', '')}`);
    } else if (tempMessage.includes('offline')) {
      console.log(`[*_*] 🔁: ${message.replace('offline', '')}`);
    } else {
      console.log(`[*_*]: ${message}`);
    }
  }
}

/**
 * Save logs locally
 * @param message
 */
async function saveLogs(message: string) {
  LOGS.push({date: new Date().valueOf(), log: message});
  if (LOGS.length > 10) {
    let localLogs = LOGS;
    LOGS = [];
    try {
      const catchedLogs = await AsyncStorage.getData('appLogs');
      if (catchedLogs.length > 5000) {
        AsyncStorage.storeData('appLogs', [...localLogs]);
      } else {
        AsyncStorage.storeData('appLogs', [...catchedLogs, ...localLogs,]);
      }
    } catch (error) {}
  }
}

/**
 * Record an Error
 * @param error
 */
function recordError(error: any, tag?: string) {
  if (__DEV__) {
    console.log(`[*_*]: ${error}`);
    console.log(`[*_*]: ${tag ? `tag [${tag}]` : ''}`);
  }
}

export default {
  log,
  recordError,
};
