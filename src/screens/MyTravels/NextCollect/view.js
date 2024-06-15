import React from 'react';
import {Alert} from 'react-native';
import moment from 'moment';

/* Components */
import {Button} from '../../../components/Button';

/* Themes */
import {deviceWidth} from '../../../theme/dimensions';
import {shadows} from '../../../theme/shadow';

/* Styles */
import {
  Touchable,
  WrapperCollect,
  ContentCollect,
  TitleCollect,
  IconCollect,
  IconMap,
  FieldLabel,
  FieldDescription,
  ViewOrgnizeHorizontalBetween,
  Field,
  FieldHour,
  Divider,
  FieldAddress,
  FieldNotCollect,
} from './styles';

// i18n
import {useTranslation} from 'react-i18next';

const styleButtonTitle = {
  alignSelf: 'center',
  fontSize: 14,
  color: 'white',
  fontWeight: 'bold',
};

const styleButton = {
  flex: 1,
  height: 37,
  backgroundColor: global.COLOR_DANGER,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  ...shadows.primary,
};

function NextCollect(props) {
  const {
    onGaveBad,
    onGaveGood,
    onNavigation,
    loadOrigin,
    hasCollect,
    spreadsheet,
    dateCollect,
    address,
    dateCollectTitle,
    dateCollectColor,
  } = props;

  const [t] = useTranslation('screens');

  return (
    <WrapperCollect>
      <TitleCollect>{t('next-collect.next-collection')}</TitleCollect>
      {hasCollect ? (
        <ContentCollect style={shadows.primary}>
          <ViewOrgnizeHorizontalBetween>
            <Field>
              <FieldLabel>{t('next-collect.travel')}</FieldLabel>
              <FieldDescription>{spreadsheet}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>{t(dateCollectTitle)}</FieldLabel>
              <FieldDescription isColor={dateCollectColor}>
                {moment(dateCollect).format('DD/MM/YYYY')}
              </FieldDescription>
            </Field>
            <FieldHour>
              <FieldLabel>{t('next-collect.hour')}</FieldLabel>
              <FieldDescription isColor={dateCollectColor}>
                {moment(dateCollect).format('HH:mm')}
              </FieldDescription>
            </FieldHour>
          </ViewOrgnizeHorizontalBetween>

          <Divider />

          <ViewOrgnizeHorizontalBetween>
            <FieldAddress>{address}</FieldAddress>
            <Touchable onPress={() => onNavigation(loadOrigin)}>
              <IconMap />
            </Touchable>
          </ViewOrgnizeHorizontalBetween>

          <ViewOrgnizeHorizontalBetween>
            <IconCollect />
            <Button
              title="problem"
              titleStyle={styleButtonTitle}
              onPress={onGaveBad}
              buttonStyle={styleButton}
            />

            <Button
              title="arrived"
              titleStyle={styleButtonTitle}
              onPress={onGaveGood}
              buttonStyle={{
                ...styleButton,
                marginLeft: 5,
                backgroundColor: global.COLOR_SUCCESS,
              }}
            />
          </ViewOrgnizeHorizontalBetween>
        </ContentCollect>
      ) : (
        <ContentCollect style={shadows.primary}>
          <ViewOrgnizeHorizontalBetween>
            <IconCollect />
            <FieldNotCollect>
              {t('next-collect.scheduled-collection')}
            </FieldNotCollect>
          </ViewOrgnizeHorizontalBetween>
        </ContentCollect>
      )}
    </WrapperCollect>
  );
}

export default NextCollect;
