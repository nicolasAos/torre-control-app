import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Animated} from 'react-native';

import {deviceHeight} from '../../../theme/dimensions';

export const Touchable = styled.TouchableWithoutFeedback``;

export const Content = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 50;
  width: 100%;
  height: 50px;
  margin: -50px 0 0 0;
  background: white;
`;

export const ViewWrapper = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0 10px;
`;

export const ModalWrapper = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex: 1;
  height: ${deviceHeight}px;
  background: #00000098;
  z-index: ${({isOpen}) => (isOpen ? 5 : 0)};
  opacity: ${({isOpen}) => (isOpen ? 1 : 0)};
  justify-content: flex-start;
  align-items: center;
`;

const ModalContainerAnimated = styled.View.attrs(({style}) => ({
  style,
}))`
  position: relative;
  padding: 16px;
  width: 90%;
  height: 330px;
  background: white;
  padding: 20px 16px;
  justify-content: flex-start;
  align-items: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
export const ModalContainer = Animated.createAnimatedComponent(
  ModalContainerAnimated,
);

export const Field = styled.View`
  width: 100%;
  padding: 5px 10px;
  margin: 0 0 10px 0;
`;

export const FieldLabel = styled.Text`
  width: 100%;
  font-size: 15px;
  font-weight: 900;
  color: ${global.COLOR_DARK};
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const FieldDescription = styled.View`
  width: 100%;
  margin-top: 5px;
  min-height: 50px;
  padding: 5px;
  border-radius: 5px;
  background: ${global.COLOR_WHITE_PLATINUM};
`;

export const Text = styled.Text`
  font-size: 28px;
  text-align: center;
  padding: 10px 20px;
  background: blueviolet;
  color: white;
  width: 100%;
  flex: 1;
`;

export const ViewContent = styled.View`
  padding: 2px;
  height: 50px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const IconArrow = styled(FontAwesome5).attrs({
  name: 'angle-down',
  size: 50,
  color: global.COLOR_TOOLBAR,
})`
  width: 50px;
  height: 50px;
  margin-left: 5px;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const IconToggle = styled(FontAwesome5).attrs((props) => ({
  name: props.status ? 'check-square' : 'exclamation-triangle',
  size: 35,
  solid: true,
  color: props.status ? global.COLOR_SUCCESS : global.COLOR_DANGER,
}))`
  width: 40px;
  height: 35px;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ViewVehicle = styled.View`
  width: 100px;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 10px 0 5px;
  border-right-width: 1px;
  border-right-color: ${global.COLOR_GREY};
`;

export const ViewShippingCompany = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 10px;
`;

export const FieldHeader = styled.View`
  width: 100%;
`;

export const FieldHeaderLabel = styled.Text`
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  color: ${global.COLOR_DARK};
  margin-top: 5px;
`;

export const FieldDHeaderescription = styled.Text.attrs({
  numberOfLines: 1,
})`
  width: 100%;
  font-size: 18px;
  color: ${({isColor}) => (isColor ? global.COLOR_DARK : global.COLOR_DANGER)};
  overflow: hidden;
`;
