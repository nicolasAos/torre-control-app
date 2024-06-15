import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native'
import MapView , { Polyline, Marker } from 'react-native-maps';
import { Button, Loading } from '../components';
const {width} = Dimensions.get('window');
import {useTranslation} from 'react-i18next';
import Geolocation from '@react-native-community/geolocation';
import { NavigationEvents } from 'react-navigation';
import MapViewDirections from 'react-native-maps-directions';
import { getCurrentPosition } from '../actions/driver';
// import Tts from 'react-native-tts';
import { GOOGLE_MAPS_KEY } from "@env";

const MapFullScreen = ({ navigation}) => {
  // Tts.setDefaultLanguage('es-US');
  const [t] = useTranslation('mapScreen');
  const [latLng, setLatLng] = useState({
    lat: 3.4281825914425164,
    lng: -76.52307333229875, 
    latitudeDelta: 0.05,
    longitudeDelta: 0.5
  })

  useEffect(() => {
    getLocations();
    const timer = setInterval(() => {
      getLocations();
    }, 300000);
               // clearing interval
    return () => clearInterval(timer);
  }, []);

  const [latLgnTruck, setLatLngTruck] = useState({
    lat: 0,
    lng: 0,
    name: ""
  });

  const [watchRoute, setWatchRoute] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const mapRef = useRef()

  const getLocations = async() => { 
    Geolocation.getCurrentPosition( info => {
        setLatLng({
          lat: info.coords.latitude,
          lng: info.coords.longitude,
          latitudeDelta: 0.05,
        }) 
      }
    )

    let ltln = {
      lat: 0,
      lng: 0
    }
    console.log(navigation.state.params)
    if (!navigation.state.params.pedido) {
      const getTruckLocation = await getCurrentPosition(navigation.state.params.truckId)
      ltln = {
        lat: getTruckLocation.lat,
        lng: getTruckLocation.lng,
      }
    } else {
      ltln = {
        lat: navigation.state.params.lat,
        lng: navigation.state.params.lng
      }
    }
    console.log(ltln) 
    setLatLngTruck({
      lat: ltln.lat,
      lng: ltln.lng,
      name: !navigation.state.params.pedido ? navigation.state.params.truckId : navigation.state.params.pedidoId
    })

    setLoading(false)
    mapRef.current.fitToSuppliedMarkers("here")
  }

  return (
    <View
      style={styles.container}
    > 
      <Loading show={loading} />
      <NavigationEvents
        onWillFocus={() => setLoading(true)} 
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: latLng.lat,
          longitude: latLng.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={{
          latitude: latLng.lat,
          longitude: latLng.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
      {
        watchRoute &&
          <>
            {/* <Polyline
              coordinates={[{ latitude:latLng.lat, longitude: latLng.lng }, { latitude: latLgnTruck.lat, 
              longitude: latLgnTruck.lng }]}
            /> */}
            <MapViewDirections
              origin={{latitude : latLng.lat, longitude: latLng.lng}}
              destination={{latitude: latLgnTruck.lat, longitude: latLgnTruck.lng }}
              strokeWidth={4}
              strokeColor="#111111"
              apikey={GOOGLE_MAPS_KEY}
            />
          </>
      }
      <MapView.Circle
        center = {{
          latitude: latLng.lat,
          longitude: latLng.lng
        }}
        radius = { 400 }
        strokeWidth = { 1 }
        strokeColor = { '#48C774' }
        fillColor = { 'rgba(72,199,116,0.5)'  }
      />
      <Marker
        identifier={"here"}
        coordinate={{
        latitude: latLng.lat,
        longitude: latLng.lng
        }}
        title={"me"}
      />
      <Marker
        coordinate={{
        latitude: latLgnTruck.lat,
        longitude: latLgnTruck.lng,
        }}
        title={latLgnTruck.name}
      />
      </MapView>
      <View
        style={styles.buttonsContainer}
      >
        <View style={styles.buttonIndividualContainer}>
          <Button
            onPress={() => {
              if (watchRoute) {
                setWatchRoute(false)
              } else {
                setWatchRoute(true)
              }
            }}
            title={t('buttonLeft')}
            titleStyle={{
              alignSelf: 'center',
              fontSize: 14,
              color: 'white',
              fontWeight: 'bold',
            }}
            buttonStyle={styles.buttonTravel}
          />
        </View>
        <View style={styles.buttonIndividualContainer}>
          <Button
            onPress={() =>{
              mapRef.current.animateToRegion({
                latitude: latLng.lat,
                longitude: latLng.lng,
                latitudeDelta: 0.0009,
                longitudeDelta: 0.0009
              })
            }}
            title={t('buttonRigth')}
            titleStyle={{
              alignSelf: 'center',
              fontSize: 14,
              color: 'white',
              fontWeight: 'bold',
            }}
            buttonStyle={styles.buttonTravel}
          />
        </View>   
      </View>
    </View>
  )
}

export default MapFullScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTravel: {
    backgroundColor: global.COLOR_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: width / 2.2,
    borderRadius: 50,
    marginVertical: 15,
  },
  buttonIndividualContainer: {
    flex : 1,
    alignItems: 'center',
  }
})
