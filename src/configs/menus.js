export const menus = [
  // {
  // 	id: 7,
  // 	nameMenu: 'menu.title.offers',
  // 	image: require('../imgs/em-transito-active.png'),
  // 	stack: 'menuFreightOffersStack'
  // },
  {
    id: 2,
    nameMenu: 'menu.title.travels',
    image: require('../imgs/minhasviagens.png'),
    stack: 'myTravelsStack', //se comenta para pruebas de los nuevos flujos solamente
    // stack: 'RemittancesStack', //solo se agrega esta pantalla para probar los nuevos flujos
  },
  {
    id: 3,
    nameMenu: 'menu.title.travels-transfer',
    image: require('../imgs/tranferir-planilha.png'),
    stack: 'travelTransferStack',
  },
  {
    id: 4,
    nameMenu: 'menu.title.register',
    image: require('../imgs/cadastro.png'),
    stack: 'menuRegisterStack',
  },
  {
    id: 8,
    nameMenu: 'menu.title.my-work-day',
    image: require('../imgs/drivers_journey.png'),
    stack: 'myWorkDayStack',
  },
  {
    id: 5,
    nameMenu: 'menu.title.settings',
    image: require('../imgs/config.png'),
    stack: 'settingsStack',
  },
  {
    id: 6,
    nameMenu: 'menu.title.logout',
    image: require('../imgs/sair.png'),
    stack: 'logout',
  },
];


export const globalProfileMenu  = [
  {
    id: 2,
    nameMenu: 'menu.title.travels',
    image: require('../imgs/minhasviagens.png'),
    stack: 'RemittancesStack',
    permissionLevel: 2
  },
  {
    id: 3,
    nameMenu: 'menu.title.travels',
    image: require('../imgs/minhasviagens.png'),
    stack: 'myTravelsStack',
    permissionLevel: 1
  },
  {
    id: 4,
    nameMenu: 'menu.title.travels-transfer',
    image: require('../imgs/tranferir-planilha.png'),
    stack: 'travelTransferStack',
    permissionLevel: 3
  },
  {
    id: 5,
    nameMenu: 'menu.title.my-work-day',
    image: require('../imgs/drivers_journey.png'),
    stack: 'myWorkDayStack',
    permissionLevel: 4,
  },
  {
    id: 6,
    nameMenu: 'menu.title.inspect',
    image: require('../imgs/querofrete.png'),
    stack: 'inspectStack',
    permissionLevel: 5
  }, 
  {
    id: 7,
    nameMenu: 'menu.title.register',
    image: require('../imgs/cadastro.png'),
    stack: 'menuRegisterStack',
    permissionLevel: 'g'
  },
  {
    id: 8,
    nameMenu: 'menu.title.settings',
    image: require('../imgs/config.png'),
    stack: 'settingsStack',
    permissionLevel: 'g'
  },
  {
    id: 9,
    nameMenu: 'menu.title.logout',
    image: require('../imgs/sair.png'),
    stack: 'logout',
    permissionLevel: 'g'
  },
]
