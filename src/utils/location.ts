import {Alert} from 'react-native';
import Geolocation, {GeoCoordinates} from 'react-native-geolocation-service';
//import Geolocation from '@react-native-community/geolocation';
import {Mixpanel} from '../analitycs';
import {Logger} from '.';

interface Coords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

const config = {
  /**
   * Is a boolean representing if to use GPS or not. If set to true,
   * a GPS position will be requested. If set to false,
   * a WIFI location will be requested.
   */
  enableHighAccuracy: true,
  /**
    Is a positive value representing the maximum length of time 
    (in milliseconds) the device is allowed to take in order to return a position. 
   */
  timeout: 20000,
  /**
   Is a positive value indicating the maximum age in milliseconds 
   of a possible cached position that is acceptable to return.  
  */
  maximumAge: 60000,
  /**
   * Minimum displacement in meters
   */
  distanceFilter: 50,
  /**
   * Whether to ask to enable location in Android (android only)
   */
  showLocationDialog: true,
  /**
   * Force request location even after denying improve accuracy dialog (android only)
   */
  forceRequestLocation: true,
};

/**
 * Get current device location
 * @returns
 */
async function getCurrentPosition(
  showAlert = true,
): Promise<GeoCoordinates | undefined> {
  return new Promise((resolve, _) => {
    Geolocation.getCurrentPosition(
      (info) => {
        Mixpanel.log('Location Requested Successfully', info.coords);
        Logger.log(
          `getCurrentPosition: ${info.coords.latitude}, ${info.coords.longitude}`,
        );
        resolve(info.coords);
      },
      (error) => {
        Mixpanel.log('Location Requested Failed', {
          error: JSON.stringify(error),
        });
        if (showAlert) {
          Alert.alert('Error', 'Ubicación no disponible');
        }
        resolve(undefined);
      },
      config,
    );
  });
}

/**
 * Calculate the distance between 2 points
 * @param pointA
 * @param pointB
 * @returns
 */
function haversine(pointA: any, pointB: any) {
  const R = 6371e3;

  const φ1 = (pointA.latitude * Math.PI) / 180;
  const φ2 = (pointB.latitude * Math.PI) / 180;
  const Δφ = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const Δλ = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  const meters = parseFloat(d.toFixed(2));
  return meters;
  //https://www.movable-type.co.uk/scripts/latlong.html
}

export default {getCurrentPosition, haversine};
