import styled from 'styled-components/native';
// import LottieView from 'lottie-react-native'

export const Touchable = styled.TouchableWithoutFeedback``;

export const WrapperAnimation = styled.View`
  width: 100%;
  min-height: 100px;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
`;

// export const Animation = styled(LottieView).attrs({
// 	source: require('./animation_blue_2.json'),
// 	autoPlay: true,
// 	loop: true
// })`
export const Animation = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 80px;
  border: solid 2px ${global.COLOR_GREY_LIGHT};
`;

export const WrapperNumber = styled.View`
  width: 100%;
  position: absolute;
  margin: 20px;
  justify-content: center;
  align-items: center;
`;

export const Number = styled.Text`
  font-size: 30px;
  color: ${global.COLOR_TOOLBAR};
`;
