import axios from 'axios';
// import { GOOGLE_MAPS_KEY } from "@env";
const GEOCODING_API_KEY = 'AIzaSyCculBHxwbJ_nLgZfGEEVP4hh7aoTcF6Ss';

class GeoCoding {
  constructor() {}

  normalGeoCoding(adress) {
    return new Promise((resolve, reject) => {
      const formattedAdress = adress
        .replace(/[^\w\s]/gi, '')
        .replace(/\s/g, '+');
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAdress}&key=${GEOCODING_API_KEY}`,
        )
        .then((response) => {
          if (response.data.status == 'OK') {
            resolve(response.data.results[0].geometry.location);
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}

export default new GeoCoding();
