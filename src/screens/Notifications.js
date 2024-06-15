import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

import {Card, Loading} from '../components';
import {FlatList} from 'react-native-gesture-handler';
import {getMessages} from '../actions/notifications';
import {useSelector} from 'react-redux';
import moment from 'moment';

export default (props) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {moto_nome, moto_tel, user_id} = useSelector(
    ({login}) => login.content,
  );

  useEffect(() => {
    setLoading(true);
    getMessages(user_id, 1).then((data) => {
      let datanew = data.reverse()
      setMessages(datanew);
      setLoading(false);
    });
  }, []);

  const renderItems = ({item}, index) => {
    return (
      <Card containerStyle={styles.card}>
        <View style={styles.containerTitle}>
          <View style={styles.containerIconTitle}>
            <Text style={styles.title}>Mensaje de la torre de control</Text>
          </View>
        </View>
        <View style={styles.containerBody}>
          <View style={styles.body}>
            <Text style={styles.itemHour}>
              {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Text style={styles.item}>{item.message}</Text>
          </View>
        </View>
      </Card>
    );
  };
  return (
    <View style={styles.container}>
      <Loading show={loading} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={messages}
        keyExtractor={(item) => item.created_at.toString()}
        renderItem={renderItems}
      />
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: global.COLOR_BACKGROUND,
  },
  card: {
    width: width / 1.1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    borderTopWidth: 0,
    borderRadius: 20,
  },
  containerTitle: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    width: width / 1.1,
    backgroundColor: global.COLOR_TITLE_CARD,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    fontSize: 20,
  },
  itemHour: {
    marginBottom: 10,
    fontSize: 20,
  },
  containerBody: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  body: {
    marginTop: 3,
  },
});
