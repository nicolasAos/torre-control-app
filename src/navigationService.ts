import {NavigationActions} from 'react-navigation';

let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

/**
 * Navigate to a screen
 * @param routeName
 * @param params
 */
function navigate(routeName: string, params?: object) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

export default {
  navigate,
  setTopLevelNavigator,
};
