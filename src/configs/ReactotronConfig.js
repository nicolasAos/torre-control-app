import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';


  const tron = Reactotron.configure({
    name: 'React Native AGV GO',
  })
    .use(reactotronRedux())
    .configure()
    .useReactNative()
    .setAsyncStorageHandler(AsyncStorage)
    .connect();

  console.tron = tron;

  tron.clear();


export default Reactotron;
