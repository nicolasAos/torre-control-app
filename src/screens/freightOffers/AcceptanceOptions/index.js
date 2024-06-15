import React, {useState, useRef, useEffect} from 'react';
import {Animated} from 'react-native';

/* COmponents */
import {Button} from '../../../components/Button';
import {Select} from '../../../components/UI/Select';

/* Themes */
import {shadows} from '../../../theme/shadow';

import {
  Touchable,
  Content,
  ViewWrapper,
  ModalWrapper,
  ModalContainer,
  Field,
  FieldLabel,
  FieldDescription,
  ViewContent,
  IconArrow,
  IconToggle,
  ViewVehicle,
  ViewShippingCompany,
  FieldHeader,
  FieldHeaderLabel,
  FieldDHeaderescription,
} from './styles';

import {useTranslation} from 'react-i18next';

const styleButton = {
  alignItems: 'center',
  justifyContent: 'center',
  height: 50,
  width: '100%',
  borderRadius: 10,
  marginTop: 20,
  ...shadows.primary,
};

const styleButtonTyle = {
  fontWeight: 'bold',
  fontSize: 18,
  color: 'white',
};

function AcceptanceOptions(props) {
  const [t] = useTranslation('screens');
  const {vehicle, shippingCompanie, save} = props;

  const fadeAnim = useRef(new Animated.Value(-330)).current;

  const [isOpen, setIsOpen] = useState(false);
  const [fieldVehicle, setFieldVehicle] = useState(null);
  const [fieldShippingCompanie, setFieldShippingCompanie] = useState(null);

  const isDisabled = !vehicle.value || !shippingCompanie.value;

  const fadeIn = () => {
    setIsOpen(!isOpen);
    Animated.timing(fadeAnim, {
      toValue: 0,
      delay: 50,
      duration: 1000,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: -330,
      delay: 50,
      duration: 1000,
    }).start(() => setIsOpen(!isOpen));
  };

  const handleSubmit = () => {
    save(fieldVehicle, fieldShippingCompanie);
    fadeOut();
  };

  useEffect(() => {
    setFieldVehicle(vehicle.value);
    setFieldShippingCompanie(shippingCompanie.value);
  }, [vehicle.value, shippingCompanie.value]);

  return (
    <>
      <Content>
        <Touchable onPress={fadeIn}>
          <ViewWrapper>
            <IconToggle status={!isDisabled} />
            <ViewContent>
              <ViewVehicle>
                <FieldHeader>
                  <FieldHeaderLabel>
                    {t('menu.offers.offers.plate')}
                  </FieldHeaderLabel>
                  <FieldDHeaderescription isColor={!isDisabled}>
                    {vehicle.value
                      ? vehicle.data.find(
                          (item) => item.value === vehicle.value,
                        ).label
                      : t('menu.offers.offers.select-plate-message')}
                  </FieldDHeaderescription>
                </FieldHeader>
              </ViewVehicle>
              <ViewShippingCompany>
                <FieldHeader>
                  <FieldHeaderLabel>
                    {t('menu.offers.offers.shipping-company')}
                  </FieldHeaderLabel>
                  <FieldDHeaderescription isColor={!isDisabled}>
                    {shippingCompanie.value
                      ? shippingCompanie.data.find(
                          (item) => item.value === shippingCompanie.value,
                        ).label
                      : t('menu.offers.offers.select-company-message')}
                  </FieldDHeaderescription>
                </FieldHeader>
              </ViewShippingCompany>
            </ViewContent>
            <IconArrow />
          </ViewWrapper>
        </Touchable>
      </Content>

      {isOpen ? (
        <ModalWrapper isOpen={isOpen}>
          <ModalContainer
            useNativeDriver
            style={{
              transform: [
                {
                  translateY: fadeAnim,
                },
              ],
            }}>
            <Field>
              <FieldLabel>{t('menu.offers.offers.plate') + ':'}</FieldLabel>
              <FieldDescription style={shadows.primary}>
                <Select
                  data={vehicle.data}
                  onChange={setFieldVehicle}
                  value={fieldVehicle}
                  placeholder={{
                    label: t('menu.offers.offers.select-plate-message'),
                    value: null,
                    color: '#9EA0A4',
                  }}
                />
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>
                {t('menu.offers.offers.shipping-company') + ':'}
              </FieldLabel>
              <FieldDescription style={shadows.primary}>
                <Select
                  data={shippingCompanie.data}
                  onChange={setFieldShippingCompanie}
                  value={fieldShippingCompanie}
                  placeholder={{
                    label: t('menu.offers.offers.select-company-message'),
                    value: null,
                    color: '#9EA0A4',
                  }}
                />
              </FieldDescription>
            </Field>

            <ViewWrapper>
              <Button
                title={'save'}
                titleStyle={styleButtonTyle}
                buttonStyle={[
                  styleButton,
                  {
                    backgroundColor: global.COLOR_SUCCESS,
                  },
                ]}
                // disabled={isDisabled}
                onPress={handleSubmit}
              />
            </ViewWrapper>
          </ModalContainer>
        </ModalWrapper>
      ) : null}
    </>
  );
}

export default AcceptanceOptions;
