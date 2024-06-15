# APP AGV GO - REACT NATIVE

Atualizado em: 19/11/2019 - 10:00

-   [Pré-requisitos](#pré-requisitos)
-   [Android](#android)
    -   [Pré-requisitos](#pré-requisitos)
    -   [Passos](#passos)
    -   [Rodar modo debug](#rodar-modo-debug)
    -   [Rodar modo release](#rodar-modo-release)
-   [iOS](#ios)
    -   [Pré-requisitos](#pré-requisitos)
    -   [Passos](#passos)
    -   [Rodar modo release](#rodar-modo-release)
-   [Versão do React Native](#versão-do-react-native)
-   [Libs e Versões](#libs-e-versões)
-   [Dica para debug](#dica-para-debug)

## Pré-requisitos

-   Nodejs

## Android

### Pré-requisitos

-   Android Studio
-   Jdk

### Passos

-   Pelo terminal entre no diretório do aplicativo
-   Execute `npm install`
-   Reorganize o arquio 'MainApplication.java', pois, a lib do datami desorganiza o mesmo
-   Exclua a pasta 'react-native' dentro 'node_modules/react-native-smisdk-plugin/node_modules/'
-   Execute `npm start -- --reset-cache` para iniciar o servidor
-   Execute `npm run android` para instalar o aplicativo

### Rodar modo debug

`npm run android`

### Rodar modo release

`npm run android -- --variant=release`

## iOS

### Pré-requisitos

-   Xcode

### Passos

-   Entrar na raiz do projeto
-   `rm -rf node_modules`
-   `rm -rf ios/build`
-   `npm i`
-   `rm -rf node_modules/react-native-smisdk-plugin/node_modules/react-native`
-   Fazer o start (`npm start -- --reset-cache`)

### Rodar modo release

`npm run ios --device --configuration Release`

## Versão do React Native

-   0.59.5

## Libs e Versões

-   @mauron85/react-native-background-geolocation: 0.5.3,
-   @react-native-community/netinfo: 3.2.1,
-   axios: 0.18.0,
-   email-validator: 2.0.4,
-   moment: 2.24.0,
-   react-native-action-button: 2.8.5,
-   react-native-animatable: 1.3.2,
-   react-native-background-fetch: 2.7.0,
-   react-native-background-timer: 2.1.1,
-   react-native-check-box: 2.1.7,
-   react-native-datepicker: 1.7.2,
-   react-native-device-info: 2.2.2,
-   rn-fetch-blob: 0.10.8,
-   react-native-firebase: 5.2.3,
-   react-native-gesture-handler: 1.0.15,
-   react-native-htmlview: 0.13.0,
-   react-native-image-picker: 0.28.1,
-   react-native-loading-spinner-overlay: 1.0.1,
-   react-native-masked-text: 1.12.2,
-   react-native-modal: 7.0.2,
-   react-native-modal-photo-view: 0.1.1,
-   react-native-onesignal: 3.2.12,
-   react-native-picker-select: 6.1.0,
-   react-native-render-html: 4.1.2,
-   react-native-slider: 0.11.0,
-   react-native-smisdk-plugin: git+https://bitbucket.org/datami/sd-react-native-smisdk-plugin.git,
-   react-native-system-setting: 1.7.2,
-   react-native-text-input-mask: 0.9.0,
-   react-native-vector-icons: 6.3.0,
-   react-navigation: 3.2.1,
-   react-redux: 6.0.1,
-   realm: 2.28,
-   redux: 4.0.1,
-   redux-devtools-extension: 2.13.8,
-   redux-persist: 5.10.0,
-   redux-thunk: 2.3.0
-   styled-components: 5.0.1

## Dica para debug

Utilizar o software [Reactotron](https://github.com/infinitered/reactotron);


## se inicia desarrollo para inspección de rutas.