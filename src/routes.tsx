import React, {useEffect} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {View, StatusBar, Image} from 'react-native';
import NavigationService from './navigationService';
import LoginScreen from './screens/auth/Login';
import RegisterScreen from './screens/auth/Register';
import ForgotScreen from './screens/auth/Forgot';
import ForgotTokenScreen from './screens/auth/ForgotToken';
import ResetPasswordScreen from './screens/auth/ResetPassword';
import AuthLoadingScreen from './screens/auth/AuthLoading';
import HomeScreen from './screens/home/Home';
import MyTravelsScreen from './screens/MyTravelsFlux';
import InspectScreen from './screens/InspectScreen';
import AuditScreen from './screens/AuditScreen';
import MyTravelsInitiateScreen from './screens/MyTravelsInitiate';
import MyTravelsFinishScreen from './screens/MyTravelsFinish';
import TermScreen from './screens/Term';
import SpreadSheetScreen from './screens/SpreadSheet';
import MapScreen from './screens/Map';
import CTesScreen from './screens/CTes';
import LowByCTesScreen from './screens/LowByCTes';
import InvoicesScreen from './screens/Invoices';
import InvoicesByCteScreen from './screens/InvoicesByCte';
import LowScreen from './screens/Low';
import OccurrenceScreen from './screens/Occurrence';
import LowCteScreen from './screens/LowCte';
import OccurrenceCteScreen from './screens/OccurrenceCte';
import OccurrenceNFsCteScreen from './screens/OccurrenceNFsCte';
import NotificationScreen from './screens/Notifications';
import ResetPasswordScreenWeb from './screens/auth/ResetPasswordScreen';
import MenuFreightOffersScreen from './screens/freightOffers/MenuFreightOffers';
import FreightPreferencesScreen from './screens/freightOffers/FreightPreferences';
import FreightWishScreen from './screens/freightOffers/FreightWish';
import FreightOffersScreen from './screens/freightOffers/FreightOffers';
import FreightOffersSavedScreen from './screens/freightOffers/FreightOffersSaved';

import MenuRegisterScreen from './screens/myRegister/MenuRegister';
import MyRegisterUserScreen from './screens/myRegister/MyRegisterUser';
import MyRegisterSecurityScreen from './screens/myRegister/MyRegisterSecurity';
import MyRegisterCardRepomScreen from './screens/myRegister/MyRegisterCardRepom';
import MyRegisterDriverScreen from './screens/myRegister/MyRegisterDriver';
import MyCarsScreen from './screens/myRegister/MyCars';
import MyRegisterCarScreen from './screens/myRegister/MyRegisterCar';
import MyRegisterTruckBodyScreen from './screens/myRegister/MyRegisterTruckBody';
import MyListOwnerScreen from './screens/myRegister/MyListOwner';
import MyRegisterOwnerScreen from './screens/myRegister/MyRegisterOwner';
import MyRegisterResponsibleFreightScreen from './screens/myRegister/MyRegisterResponsibleFreight';
import MyWorkDayScreen from './screens/myWorkDay/MyWorkDay';
import EditWorkActivityScreen from './screens/myWorkDay/EditWorkActivity';
import SettingsScreen from './screens/Settings';
import TravelsTranfersScreen from './screens/travelsTransfer/TravelsTransfer';
import DeliveryRouteScreens from './screens/RouteDelivery';
import {useTranslation} from 'react-i18next';
import RemittancesScreen from './screens/RemittancesScreen';
import RemissionScreen from './screens/RemissionScreen';
import SignatureRemissionScreen from './screens/SignatureRemissionScreen';
import SACReportScreen from './screens/SACReportScreen';
import SACReportPedidosCompletosScreen from './screens/SACReportPedidosCompletosScreen';
import MapFullScreen from './screens/MapFullScreen';
import AddRotuloScreen from './screens/AddRotuloScreen';
import PickingScreen from './screens/RecogidasYEntregas';
import LabelGenerate from './screens/LabelGenerate';
import QuestionaireScreen from './screens/QuestionaireScreen';
import ColectasScreen from './screens/Colectas';
import PrinterScreen from './screens/PrinterScreen';
import PrinterSignatureScreen from './screens/PrinterSignaturesScreen';
import ProcesoCargue from './screens/ProcesoCargue';
import PedidosCompletoNovedad from './screens/PedidosCompletoNovedad';
import NovedadReporteSac from './screens/NovedadReporteSac';
import PedidosAdminFotos from './screens/PedidosAdminFotos';
import VerCargue from './screens/VerCargue';
import FotosPedido from './screens/FotosPedido';
import RemesaBoxesScreen from './screens/RemesaBoxesScreen';
import LoggerScreen from './screens/Logger';
//import {sendLocationEvent} from './actions/geolocation';
// pickingStack
// utils
import {Logger} from './utils';

const headerDefault = (
  title?: string,
  headerTintColor?: string,
  backgroundColor?: string,
) => {
  return {
    title,
    headerTintColor: headerTintColor ? headerTintColor : '#ffffff',
    headerStyle: {
      backgroundColor: backgroundColor ? backgroundColor : global.COLOR_MAIN,
    },
    headerRight: (
      <Image
        style={{width: 80, resizeMode: 'contain'}}
        source={require('../src/imgs/solistica-logo.png')}
      />
    ),
  };
};

/**
 * Home screens
 */
const HomeStack = createStackNavigator({
  homeStack: {
    screen: HomeScreen,
    path: 'home/:home',
    navigationOptions: {
      header: null,
    },
  },
  logger: {
    screen: LoggerScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('Logs')),
  },
  menuFreightOffersStack: {
    screen: MenuFreightOffersScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('offers')),
  },
  freightOffersStack: {
    screen: FreightOffersScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('offers')),
  },
  remesaBoxesStack: {
    screen: RemesaBoxesScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault('Entrega Última Milla'),
  },
  freightOffersSavedStack: {
    screen: FreightOffersSavedScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('saved-offers')),
  },
  freightWishStack: {
    screen: FreightWishScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('wanna-freight')),
  },
  freightPreferencesStack: {
    screen: FreightPreferencesScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('freight-preferences')),
  },
  menuRegisterStack: {
    screen: MenuRegisterScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('register')),
  },
  myTravelsStack: {
    screen: MyTravelsScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('travels')),
  },
  inspectStack: {
    screen: InspectScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('inspect')),
  },
  auditStack: {
    screen: AuditScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('audit')),
  },
  termStack: {
    screen: TermScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('term')),
  },
  myRegisterUserStack: {
    screen: MyRegisterUserScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('user-data')),
  },
  myRegisterCardRepomStack: {
    screen: MyRegisterCardRepomScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('repom-card')),
  },
  myRegisterSecurityStack: {
    screen: MyRegisterSecurityScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('security')),
  },
  myRegisterDriverStack: {
    screen: MyRegisterDriverScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('driver-data')),
  },
  myRegisterCarStack: {
    screen: MyRegisterCarScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('vehicle-data')),
  },
  myRegisterTruckBodyStack: {
    screen: MyRegisterTruckBodyScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('bodywork-data')),
  },
  myListOwnerStack: {
    screen: MyListOwnerScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('owner')),
  },
  myRegisterOwnerStack: {
    screen: MyRegisterOwnerScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('owners')),
  },
  myRegisterResponsibleFreightStack: {
    screen: MyRegisterResponsibleFreightScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('responsible-for-freight')),
  },
  spreadSheetStack: {
    screen: SpreadSheetScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('transp-document')),
  },
  // alertasTravelsStack: {
  //   screen: AlertasTravelsScreen,
  //   navigationOptions: ({screenProps: {t}}:any) =>
  //     headerDefault(t('transp-document')),
  // },
  mapStack: {
    screen: MapScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault('Mapa'),
  },
  deliveryRouteStack: {
    screen: DeliveryRouteScreens,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('delivery-route')),
  },
  notificationStack: {
    screen: NotificationScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('notifications')),
  },
  ctesStack: {
    screen: CTesScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('ctes-n')),
  },
  lowByCtesStack: {
    screen: LowByCTesScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('delivery-by-cte')),
  },
  invoicesStack: {
    screen: InvoicesScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('nfes')),
  },
  invoicesByCteStack: {
    screen: InvoicesByCteScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('cte-nfe')),
  },
  lowStack: {
    screen: LowScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('delivery')),
  },
  pickupStack: {
    screen: LowScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('pickup')),
  },
  occurrenceStack: {
    screen: OccurrenceScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('occurrence')),
  },
  lowCteStack: {
    screen: LowCteScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('delivery-cte')),
  },
  occurrenceCteStack: {
    screen: OccurrenceCteScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('occurrence-cte')),
  },
  occurrenceNFsCteStack: {
    screen: OccurrenceNFsCteScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('occurrence-nfe')),
  },
  settingsStack: {
    screen: SettingsScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('settings')),
  },
  myCarsStack: {
    screen: MyCarsScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('my-vehicles')),
  },
  myWorkDayStack: {
    screen: MyWorkDayScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('my-work-day')),
  },
  editWorkActivityStack: {
    screen: EditWorkActivityScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('edit-work-activity')),
  },
  travelTransferStack: {
    screen: TravelsTranfersScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('travels-transfer')),
  },
  // Nueva pantalla de Procesar Remesas(Directo a la listas de Ctes).
  RemittancesStack: {
    screen: RemittancesScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('ctes')),
  },
  RemissionStack: {
    screen: RemissionScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('remission')),
  },
  SignatureRemissionStack: {
    screen: SignatureRemissionScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('signatureRemission')),
  },
  SACReportStack: {
    screen: SACReportScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('sacReport')),
  },
  SACReportPedidosCompletosStack: {
    screen: SACReportPedidosCompletosScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('sacReport')),
  },
  MapFull: {
    screen: MapFullScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('mapHeader')),
  },
  addRotulo: {
    screen: AddRotuloScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('rotulosScreens')),
  },
  pickingStack: {
    screen: PickingScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('remission')),
  },
  labelGenerateStack: {
    screen: LabelGenerate,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('rotulosScreens')),
  },
  questionaireStack: {
    screen: QuestionaireScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('auditScreen')),
  },
  colectasStack: {
    screen: ColectasScreen,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(t('colecta')),
  },
  printerStack: {
    screen: PrinterScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('rotulosScreens')),
  },
  printerSignatureStack: {
    screen: PrinterSignatureScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('rotulosScreens')),
  },
  ProcesoCargueScreen: {
    screen: ProcesoCargue,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault('Proceso Cargue'),
  },
  PedidosCompletoNovedadScreen: {
    screen: PedidosCompletoNovedad,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(''),
  },
  NovedadReporteSacScreen: {
    screen: NovedadReporteSac,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault(''),
  },
  VerCargueScreen: {
    screen: VerCargue,
    navigationOptions: ({screenProps: {t}}: any) => headerDefault('Ver Cargue'),
  },
  PedidosAdminFotosScreen: {
    screen: PedidosAdminFotos,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault('Registro fotográfico'),
  },
  FotosPedidoScreen: {
    screen: FotosPedido,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault('Fotos del Pedido'),
  },
});

// Login
const AuthStack = createStackNavigator({
  loginStack: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    },
  },
  registerStack: {
    screen: RegisterScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('register')),
  },
  forgotStack: {
    screen: ForgotScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('forgot-my-password')),
  },
  forgotTokenStack: {
    screen: ForgotTokenScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('token-verification')),
  },
  resetPasswordStack: {
    screen: ResetPasswordScreen,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('password-reset')),
  },
  ResetPasswordScreen: {
    screen: ResetPasswordScreenWeb,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const TabBottonTravelStack = createBottomTabNavigator(
  {
    travelsInitiateStack: {
      screen: MyTravelsInitiateScreen,
      navigationOptions: ({screenProps: {t}}: any) =>
        headerDefault(t('started-travels')),
    },
    travelsFinishStack: {
      screen: MyTravelsFinishScreen,
      navigationOptions: ({screenProps: {t}}: any) =>
        headerDefault(t('finished-travels')),
    },
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'black',
      activeBackgroundColor: global.COLOR_MAIN,
      inactiveBackgroundColor: '#25519a',
      labelStyle: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
      },
      tabStyle: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      showIcon: false,
    },
  },
);

const AppStack = createStackNavigator({
  menu: {
    screen: HomeStack,
    path: '',
    navigationOptions: {
      header: null,
    },
  },
  menuTravel: {
    screen: TabBottonTravelStack,
    navigationOptions: ({screenProps: {t}}: any) =>
      headerDefault(t('travel-summary')),
  },
});

const Routes = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

const AppContainer = createAppContainer(Routes);
const prefix = 'agvgo://';

export default function App() {
  const [t, i18n] = useTranslation('routes');

  useEffect(() => {
    Logger.log('mount App Navigator');
    return () => {
      Logger.log('unmount App Navigator');
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#25519a" barStyle="light-content" />
      <AppContainer
        screenProps={{t, i18n}}
        uriPrefix={prefix}
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </View>
  );
}
