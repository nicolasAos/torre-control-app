import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, Text, TextInput} from 'react-native';
import {AsyncStorage, Logger} from '../utils';

export default function LoggerScreen() {
  const [logs, setLogs] = useState([]);
  const [filter, setFiler] = useState('');

  useEffect(() => {
    Logger.log('mount Logger screen');
    getlogs();
    return () => {
      Logger.log('unmount Logger screen');
    };
  }, []);

  async function getlogs() {
    try {
      const response = await AsyncStorage.getData('appLogs');
      if (response) {
        setLogs(response);
      }
    } catch (error) {}
  }

  function renderItem({item}: any) {
    const {date, log} = item;
    const d = new Date(date);
    const timeStamp = `${
      d.getMonth() + 1
    }/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
    return (
      <View style={styles.log}>
        <Text>
            <Text style={styles.date}>{`[${timeStamp}]`}</Text>
            {` => ${log}`}
        </Text>
      </View>
    );
  }

  const keyExtractor = (_: any, index: number) => index.toString();

  return (
    <View style={styles.mainGrap}>
        <TextInput style={styles.textInput} onChangeText={(t) => setFiler(t)}/>
      <FlatList
        data={
            filter ? 
            logs.filter((l:any) =>{
                if(l.log){
                    return l.log.includes(filter)
                }else{
                    return false
                }
            }).sort((a:any,b:any) => b.date - a.date)
            :
            logs.sort((a:any,b:any) => b.date - a.date)
        }
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        keyExtractor={keyExtractor}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainGrap: {
    flex: 1,
  },
  log: {
    paddingHorizontal: 15,
    paddingVertical:10,
  },
  date:{
    fontSize:10,
    fontWeight:'bold'
  },
  textInput:{
    height:50,
    padding:5,
    paddingHorizontal:20, 
    backgroundColor:'#fafafa'
  }
});
