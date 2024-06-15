import React, {useState, useRef} from 'react';
import {useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  PermissionsAndroid,
  View,
  Platform,
  Alert,
  Image
} from 'react-native';
import {Loading, Button} from '../../src/components';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';

import MapView, {Marker, Polyline} from 'react-native-maps';
import {getRoute} from '../actions/deliveryRoute';
import RNFetchBlob from 'rn-fetch-blob';
import {useTranslation} from 'react-i18next';

const RouteDelivery = (props) => {
  const [t] = useTranslation('screens');
  const romId = props.navigation.getParam('romId', '');
  const [loading, setLoading] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [routeArray, setRouteArray] = useState([]);
  const [origin, setOrigin] = useState([]); //usar com directions
  const [destination, setDestination] = useState([]); //usar com directions
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCJDbdp8hP1zm9ozzR0fvUJVdpxGna0i04';
  //const currentTravel = useSelector(({currentTrip}) => currentTrip.content);// Usar caso precise usar apenas a viagem com inicio

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }

  async function loadInitialPosition() {
    await Geolocation.getCurrentPosition(
      (position) => {
        const {coords} = position;
        const {latitude, longitude} = coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }

  useEffect(() => {
    setLoading(true);
    requestPermissions();
    loadInitialPosition();
    getRoutes();
  }, []);

  const handleRoute = () => {
    if (!origin.latitude && !origin.longitude) {
      return
    }
    setCurrentRegion({
      latitude: origin.latitude,
      longitude: origin.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const getRoutesLink = async () => {
    return await getRoute(romId).then((data) => {
      if (data.length == 0 || data[0][""]) {
        return []
      }
      return data[0].routes_route_json;
    });
  };

  const getRoutes = async () => {
    let link = await getRoutesLink();
    console.log(link, 'here')
    if (
      link.length == 0 
    ) {
      Alert.alert('Atención', 'No hay rutas')
      setLoading(false)
      return
    }
    let result = await RNFetchBlob.config({
      trusty: true,
    })
      .fetch('GET', link)
      .then((resp) => {
        return JSON.parse(resp.data);
      })
      .catch((error) => {});
    if (typeof(result?.routes) !== 'undefined') {
      const dataArr = []
      result.routes[0].legs.map((r) => {
        r.shape.map((item) => {
          dataArr.push(item)
        })
      })
      const routesFormated = dataArr.map((item) => {
        let lat = item.search(',');
        let lng = item.indexOf('-');
        let newValue = `{"latitude": ${item.slice(
          0,
          lat,
        )}, "longitude": ${item.slice(lng, -1)}}`;
        let json = JSON.parse(newValue);
        return json;
      });
      let cloneBarData = JSON.parse(JSON.stringify(routesFormated));
      const origen = routesFormated[0];
      const finish = routesFormated[routesFormated.length - 1];
      setOrigin(origen);
      setDestination(finish);
      setWaypoints(cloneBarData)
    }    
    setLoading(false);
  };

  // function chunkArray(myArray, chunk_size) {
  //   var results = [];

  //   while (myArray.length) {
  //     results.push(myArray.splice(0, chunk_size));
  //   }

  //   return results;
  // }

  function chunkArray(myArray, chunk_size) {
    var results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return linkChunked(results);
  }

  function linkChunked(chunckedArray) {
    let data = [];

    chunckedArray.forEach((element, key) => {
      if (key > 0) {
        let value = element;

        value.unshift(
          chunckedArray[key - 1][chunckedArray[key - 1].length - 1],
        );
        data.push(value);
      } else {
        data.push(element);
      }
    });

    return data;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loading show={loading} />
      <MapView
        showsUserLocation={true}
        style={styles.map}
        region={currentRegion}>
            <Polyline
              coordinates={waypoints}
              strokeColor="#ec6036"
              strokeWidth={10}
            />
            {
              origin.latitude &&
              <Marker coordinate={{latitude: origin.latitude, longitude: origin.longitude}}>
                {/* <Image source={require('../imgs/start.png')} style={{height: 35, width:35 }} /> */}
                <Image source={require('../imgs/start.png')} style={{height: 25, width: 25}} />
              </Marker>
            }
            {
              destination.latitude &&
              <Marker coordinate={{latitude: destination.latitude, longitude: destination.longitude}}>
                <Image source={require('../imgs/finish.png')} style={{height: 25, width: 25}} />
              </Marker>
            }
      </MapView>
      <View style={styles.areaButtons}>
        <Button
          title="route"
          buttonStyle={styles.buttonMyRoute}
          onPress={() => handleRoute()}
        />
        <Button
          title="my-location"
          buttonStyle={styles.buttonMyRoute}
          onPress={() => loadInitialPosition()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  areaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    zIndex: 999,
  },
  buttonMyRoute: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '40%',
    borderRadius: 50,
    marginVertical: 15,
  },
});
export default RouteDelivery;
