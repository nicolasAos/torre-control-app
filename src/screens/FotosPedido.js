import React, {useState} from 'react';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

const FotosPedido = ({navigation}) => {
  const [imagesCarousel, setImagesCarousel] = useState(
    JSON.parse(navigation.state.params.datosCompletos.evidencia),
  );

  return (
    <>
      <View style={styles.container}>
        <SwiperFlatList
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={2}
          showPagination
          data={imagesCarousel}
          renderItem={({item, index}) => (
            <View style={[styles.child]}>
              <Image
                style={{width, height: height / 2}}
                source={{uri: item.url}}
              />

              {/* <Text>{item.titulo}</Text> */}
            </View>
          )}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 9,
          backgroundColor: '#1f2b52',
          alignItems: 'center',
        }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{width: 15, height: 25}}
              source={require('../imgs/back-white.png')}
            />
          </TouchableOpacity>
        </View>
        {/* <View>
          <TouchableOpacity onPress={() => console.log('Eliminar')}>
            <Image
              style={{width: 35, height: 35}}
              source={require('../imgs/close-white.png')}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {height: height * 0.82, backgroundColor: '#F1F1F1'},
  child: {width, justifyContent: 'center'},
  text: {textAlign: 'center'},
});

export default FotosPedido;
