import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CustomSelect = ({
  menus,
  menuSelect,
  currentValue,
  withCustom,
  onPressCustom,
}) => {
  const [render, setRender] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const setValue = (i) => {
    menuSelect(i);
    setRender(false);
  };

  const pressCustom = (index) => {
    onPressCustom(index, customValue);
    setRender(false);
  };
  const renderMenu = () => {
    if (render) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              setRender(false);
            }}
            style={styles.blackScreen}
          />
          <View style={styles.selectContainer}>
            <ScrollView style={{width: '100%'}}>
              {menus.map((item, index) => {
                if (withCustom) {
                  if (index == menus.length - 1) {
                    return (
                      <View style={styles.itemSelect}>
                        <View style={{flex: 0.2}}>
                          <TouchableOpacity
                            onPress={() => {
                              pressCustom(index);
                            }}>
                            <View
                              style={{
                                padding: 3,
                                borderRadius: 2.5,
                                backgroundColor: '#48C674',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 35,
                              }}>
                              <Text
                                style={{color: 'white', fontWeight: 'bold'}}>
                                OK
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.8}}>
                          <TextInput
                            value={customValue}
                            onChangeText={(value) => {
                              {
                                setCustomValue(value);
                              }
                            }}
                            placeholder={'Personalizado'}
                            style={{
                              width: '100%',
                              height: 35,
                              borderWidth: 0.5,
                            }}
                          />
                        </View>
                      </View>
                    );
                  }
                }
                const uri = item.image;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setValue(index);
                    }}
                    style={{width: '100%'}}>
                    <View style={styles.itemSelect}>
                      <View style={{flex: 0.2}}>
                        <Image
                          source={item.image}
                          style={{width: 45, height: 45}}
                          resizeMode={'contain'}
                        />
                      </View>
                      <View style={{flex: 0.8}}>
                        <Text>{item.renderValue}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    }
    return null;
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setRender(true);
        }}
        style={{width: '100%', padding: 10}}>
        <View style={styles.containerType}>
          {typeof currentValue !== 'string' && currentValue !== undefined && (
            <>
              <View style={{flex: 0.2}}>
                <Image
                  source={menus[currentValue]?.image}
                  style={{width: 45, height: 45}}
                  resizeMode={'contain'}
                />
              </View>
              <View style={{flex: 0.7}}>
                <Text>{menus[currentValue]?.renderValue}</Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <FontAwesome5 name="sort-down" color="gray" size={26} />
              </View>
            </>
          )}
          {typeof currentValue == 'string' && currentValue !== undefined && (
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{flex: 0.9}}>
                <Text style={{color: 'gray'}}>{currentValue}</Text>
              </View>
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <FontAwesome5 name="sort-down" color="gray" size={26} />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {renderMenu()}
    </>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  blackScreen: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  selectContainer: {
    width: '85%',
    height: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  itemSelect: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerType: {
    backgroundColor: 'white',
    width: '100%',
    height: 60,
    marginBottom: 10,
    //borderRadius: 50,
    justifyContent: 'center',
    borderWidth: 1,
    paddingRight: 5,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    padding: 15,
  },
});
