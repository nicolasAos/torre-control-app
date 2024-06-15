import React, { useState } from 'react'
import { View, StyleSheet, Text, FlatList, Switch, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native'
import QuestionComponent from '../components/QuestionComponent'
import ListContainer from '../components/ListContainerOneColumn'
import RenderEmpty from '../components/renderEmpty'
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {getDateBD} from '../configs/utils';
import TextModal from '../components/TextInputModal'
import { getQuestions, sendQuestionArray } from '../actions/driver'
import { NavigationEvents } from 'react-navigation';
import { Loading, Modal } from '../components';
import {useTranslation, Trans} from 'react-i18next';

const options = {
  cameraType: 'back',
  mediaType: 'photo',
  allowsEditing: false,
  storageOptions: {
    quality: 0.5,
    cameraRoll: false,
    skipBackup: true,
  },
};

let questionModel = {
  question: 'lorem ipsum?',
  value: false,
  comments: '',
  photo: []
}
 
const QuestionaireScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [modalIndex, setModalIndex] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [t] = useTranslation('buttons');
   
  const getAllQuestions = () => {
    setLoading(true)
    getQuestions(navigation.state.params.userId).then(response => {
      const parseResponse = response.map((data) => {
        return {
          question: data.preguntaSup,
          question_id: navigation.state.params.asignacionId,
          comments: '',
          photo: []
        }
      })
      setQuestions(parseResponse)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }
  
  const sendQuestions = () => {
    setLoading(true)
    sendQuestionArray(questions).then(() => {
      setModal(true)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }

  const onChangeSwitch = ( index ) => {
    let newArr = [ ...questions ]
    if (newArr[index].value) {
      newArr[index].value = false
    } else {
      newArr[index].value = true
    }
    setQuestions(newArr)
  }

  const onDoneModal = (value) => {
    const newArr = [ ...questions ]
    newArr[modalIndex].comments = value
    setQuestions(newArr)
    setModalIndex('')
  }

  const addPhotoByIndex = (image, index) => {
    let newArr = [ ...questions ]
    let photoArr = [ ...questions[index].photo, { uri: image, type: 'image/png', name: `image_${index}.png`} ]
    newArr[index].photo = photoArr
    setQuestions(newArr)
  }

  const deletePhotoByIndex = (i, photoI) => {
    let newArr = [ ...questions ]
    newArr[i].photo.splice(photoI, 1)
    setQuestions(newArr)
  }

  const renderCamera = async(index) => {
    setLoading(true)
    console.log(index, 'here')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Torre de Control solicita permisos",
          message:
            "¿Desea Permitir el acceso a su camara?",
          buttonNeutral: "Preguntame mas tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera(options, (response) => {
          if (response.didCancel) {
            return
          }
          const img = response.assets[0]
          ImageResizer.createResizedImage(
            img.uri,
            1280,
            960,
            'PNG',
            100,
            0,
          ).then( image => {
            addPhotoByIndex(image.uri, index) 
            setLoading(false)
          })
        });
      } else {
        reset()
        setLoading(false)
        Alert.alert('Necesitamos permisos para acceder a esta función')
      }
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  const endProccess = () => {
    setLoading(true)
    setModal(false)
    navigation.goBack()
  }

  const renderModal = () => {
    return (
      <Modal
        isVisible={modal}
        title={'questionaire.success'}
        bodyText={'questionaire.success'}
        buttons={[
          {
            onPress: () => {
              endProccess()              
            },
            text: 'accept',
            backgroundColor: global.COLOR_TITLE_CARD,
          }
        ]}
      />
    );
  };
  return (
    <View
      style={styles.container}
    >
      <Loading show={loading} />
      <NavigationEvents
        onWillFocus={() => getAllQuestions()} 
      />
      <View
        style={{flex: 1}}
      >
        <View
          style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 10, marginTop: 15 }}
        >
          <View
            style={{ flex: .55, justifyContent: 'center'}}
          >
            <Text
              style={{ fontWeight: 'bold', fontSize: 8  }}
            >
              Tarea
            </Text>
          </View>
          <View style={{ flex: .45, flexDirection: 'row' }}>
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 8 }}
              >
                No Cumple / Cumple
              </Text>
            </View>
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 8 }}
              >
                Fotos
              </Text>
            </View>
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 8 }}
              >
                Comentarios
              </Text>
            </View>
          </View>
        </View>
        <ListContainer
          data={questions}
          onRefresh={()=>{}}
          refreshing={false}
          contentStyle={{
              backgroundColor: 'white'
          }}
          renderEmptyList={() => <View/>}
          itemSeparator={<View style={{ width: 16, backgroundColor: 'pink' }}/>}
          renderItem={({item, index}) => { 
            return(
              <QuestionComponent
                item={item}
                index={index}
                onChangeSwitch={onChangeSwitch}
                onSelectCamera={ async() => { await renderCamera(index) }}
                onSelectDetails={()=> {
                  setModalIndex(index)
                }}
                deletePhoto={deletePhotoByIndex}
              />  
            )
            }
          }
        />
      </View>
      <View
        style={{width: '100%', padding: 15}}
      >
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={() =>{ setLoading(true), sendQuestions() }}
        >
          <View
            style={{ width:'100%', padding: 15, alignItems: 'center', borderRadius: 5, justifyContent: 'center', backgroundColor: global.COLOR_MAIN}}
          >
            <Text
              style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}
            >
              {t('send')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TextModal
        isVisible={typeof(modalIndex) == 'number'}
        OnCloseModal={()=> {
          setModalIndex('')
        }}
        OnDoneModal={onDoneModal}
      />
      {renderModal()}
    </View> 
  )
}

export default QuestionaireScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

})
