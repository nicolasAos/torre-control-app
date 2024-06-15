import React, {useEffect, useState} from 'react';
import Routes from '../routes';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from '../store';
//
import {syncData} from '../actions/sync';
// utils
import {Logger, Offline} from '../utils';
// analitycs
import {Mixpanel} from '../analitycs';
// hooks
import NetInfo from '@react-native-community/netinfo';

let timeout = false;

export const ConnectionContext = React.createContext(true);

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    Logger.log(`add NetInfo listener`);

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (timeout) {
        return;
      }
      timeout = true;
      setTimeout(() => {
        timeout = false;
      }, 2000);
      Logger.log(
        `CONNECTION changed, is connected ${state.isConnected}, is internet reachable ${state.isInternetReachable}`,
      );
      if (state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }

      Offline.flushEvents();
    });

    return () => {
      unsubscribe();
      Logger.log(`remove NetInfo listener`);
    };
  }, []);

  useEffect(() => {
    Logger.log('mount App');
    configApp();
    return () => {
      Logger.log('unmount App');
    };
  }, []);

  async function configApp() {
    await Mixpanel.init();
    Mixpanel.log('App Open');
  }

  /**
   * Sync local data with backend
   */
  async function onSyncData() {
    Logger.log('on sync data');
    try {
      // check connection
      await syncData();
      Logger.log('on sync data sucessful');
    } catch (error) {
      Logger.log('on sync data failed');
      Logger.recordError(error);
    }
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectionContext.Provider value={isConnected}>
          <Routes />
        </ConnectionContext.Provider>
      </PersistGate>
    </Provider>
  );
}
