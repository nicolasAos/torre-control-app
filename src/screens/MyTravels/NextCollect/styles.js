import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const Touchable = styled.TouchableWithoutFeedback``;

export const WrapperCollect = styled.View`
  width: 100%;
  min-height: 100px;
  margin: 0;
  padding: 24px;
`;

export const ContentCollect = styled.View`
  width: 100%;
  min-height: 40px;
  margin: 0;
  padding: 10px;
  border-radius: 10px;
  background: #fff;
`;

export const TitleCollect = styled.Text`
  font-size: 24px;
  font-weight: 500;
  color: ${global.COLOR_DANGER};
  margin-bottom: 15px;
`;

export const ViewOrgnizeHorizontal = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const IconCollect = styled(Icon).attrs({
  name: 'dolly',
  size: 40,
  color: global.COLOR_TOOLBAR,
})`
  margin-right: 15px;
`;
export const IconMap = styled(Icon).attrs({
  name: 'map-marker-alt',
  size: 40,
  color: global.COLOR_TITLE_CARD,
})`
  margin: 5px 10px 0 10px;
`;

export const FieldsOrgnizeVertical = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const FieldLabel = styled.Text`
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  color: ${global.COLOR_DARK};
  margin-top: 5px;
`;

export const FieldDescription = styled.Text`
  width: 100%;
  font-size: 18px;
  color: ${(props) =>
    props.isColor ? global.COLOR_DANGER : global.COLOR_TOOLBAR};
`;

export const ViewOrgnizeHorizontalBetween = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  /* background: gray; */
`;

export const Field = styled.View`
  flex: 2;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 5px;
`;

export const FieldHour = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
`;
export const Divider = styled.View`
  flex: 1;
  height: 1px;
  background: #f5f4f5;
  margin: 5px 0px;
`;

export const FieldAddress = styled.Text`
  flex: 1;
  padding: 5px 0 0 10px;
  margin-bottom: 15px;
  font-size: 14px;
  color: ${global.COLOR_GREY};
  text-align: justify;
  /* border-style: solid;
	border-top-color: #f5f4f5;
	border-top-width: 1px; */
`;

export const FieldNotCollect = styled.Text`
  flex: 1;
  padding: 10px 0 0 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 400;
  color: ${global.COLOR_DARK};
  text-align: center;

  /* border-style: solid;
	border-top-color: #f5f4f5;
	border-top-width: 1px; */
`;
