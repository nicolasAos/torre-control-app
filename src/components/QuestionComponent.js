import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const QuestionComponent = ({
  item,
  index,
  onSelectCamera,
  onSelectDetails,
  onChangeSwitch,
  deletePhoto,
}) => {
  return (
    <View style={styles.questionContainer}>
      <View style={styles.questionItem}>
        <View style={{flex: 0.55}}>
          <Text style={styles.questionText}>{item.question}</Text>
        </View>
        <View style={{flex: 0.45, flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 6.5,
                color: !item.value ? '#ff3362' : '#14d267',
              }}>
              {!item.value ? 'No cumple' : 'Cumple'}
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={item.value ? global.COLOR_MAIN : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                onChangeSwitch(index);
              }}
              value={item.value}
            />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                onSelectCamera();
              }}>
              <FontAwesome5 name="camera" size={23} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity onPress={onSelectDetails}>
              <FontAwesome5 name="clipboard-list" size={23} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {item.photo.length !== 0 && (
        <ScrollView horizontal={true}>
          {item.photo.map((photo, i) => {
            return (
              <View style={styles.imageContainer}>
                <ImageBackground
                  source={{uri: photo.uri}}
                  style={{width: '100%', height: '100%'}}>
                  <View
                    style={{width: '100%', padding: 5, alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => {
                        deletePhoto(index, i);
                      }}>
                      <View style={styles.iconContainer}>
                        <FontAwesome5
                          name="trash-alt"
                          size={12}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            );
          })}
        </ScrollView>
      )}
      {item.comments !== '' && (
        <Text style={{marginVertical: 5}}>{item.comments}</Text>
      )}
    </View>
  );
};

export default QuestionComponent;

const styles = StyleSheet.create({
  questionContainer: {
    width: '100%',
    padding: 10,
  },
  questionItem: {
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  questionText: {
    fontWeight: 'normal',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginEnd: 3,
  },
  iconContainer: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: '#D9544F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
