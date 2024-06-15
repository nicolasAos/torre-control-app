import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducers from './reducers';
import thunk from 'redux-thunk';
import Reactotron from './configs/ReactotronConfig';
import storage from 'redux-persist/lib/storage';

import {composeWithDevTools} from 'redux-devtools-extension';

const persistConfig = {
  timeout: 10000,
  key: 'root',
  storage,
  whitelist: [
    'login',
    'loginHomolog',
    'isTravel',
    'location',
    'cnh',
    'freightPreferences',
    'freightWish',
    'fuelTypes',
    'vehicleTypes',
    'cnhTypes',
    'truckBodyTypes',
    'truckBodies',
    'vehicles',
    'regions',
    'statusMonitoring',
    'statusReasonMonitoring',
    'trackerTypes',
    'occurrenceTypes',
    'occurrenceTypesGo',
    'responsibleFreight',
    'ownersVehicles',
    'deviceId',
    'pushPreventiveMonitoring',
    'journeyOfOperatorType',
    'journeyOfOperator',
    'etaCalculation',
    'currentTrip',
    'sacReportTypes',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);
let store: any;
if (__DEV__) {
  store = createStore(
    persistedReducer,
    {},
    composeWithDevTools(applyMiddleware(thunk), Reactotron.createEnhancer()),
  );
} else {
  store = createStore(
    persistedReducer,
    {},
    composeWithDevTools(applyMiddleware(thunk)),
  );
}

const persistor = persistStore(store);

export {store, persistor};
