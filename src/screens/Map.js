import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const origin = {latitude: -22.8548049, longitude: -47.0498923};

const deliveryLocations = [
  {latitude: -23.1347, longitude: -48.4145},
  {latitude: -23.09858, longitude: -48.92616},
  {latitude: -22.98542, longitude: -49.86603},
  {latitude: -22.64671, longitude: -50.43853},
];

const initialLocation = {
  latitude: -22.8548049,
  longitude: -47.0498923,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
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
});

const position = async () => {
  let currentPosition = {latitude: '', longitude: ''};

  initialLocation.latitude = currentPosition.latitude;
  initialLocation.longitude = currentPosition.longitude;

  origin.latitude = currentPosition.latitude;
  origin.longitude = currentPosition.longitude;
};

export default (props) => {
  useEffect(() => {
    position();
  });

  return (
    <View style={styles.container}>
      <MapView
        showsMyLocationButton={true}
        style={styles.map}
        initialRegion={initialLocation}>
        <MapView.Marker coordinate={origin} />
        <MapView.Marker coordinate={deliveryLocations[0]} />
        <MapView.Marker coordinate={deliveryLocations[1]} />
        <MapView.Marker coordinate={deliveryLocations[2]} />
        <MapView.Marker coordinate={deliveryLocations[3]} />
        <MapViewDirections
          origin={origin}
          destination={deliveryLocations[3]}
          waypoints={[deliveryLocations[1], deliveryLocations[2]]}
          splitWaypoints={true}
          strokeWidth={3}
          strokeColor="red"
          apikey="AIzaSyADupKtLro5yYzbivFN5Qr22CDEolkm5E8"
        />
      </MapView>
    </View>
  );
};
