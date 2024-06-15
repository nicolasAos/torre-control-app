import React, {createElement, useState, useEffect} from 'react';
import {Alert} from 'react-native';

// import { Container } from './styles';
import {isObjectEmpty} from '../../../configs/utils';

import View from './view';

import {useTranslation} from 'react-i18next';

function NextCollectContainer(props) {
  const {
    monitoring,
    rescheduledDate,
    onGaveBad,
    onGaveGood,
    onNavigation,
  } = props;

  const [t] = useTranslation('screens');

  const {data_coleta, origem_carregamento, romaneio} = monitoring;

  const monitoringOrigem =
    origem_carregamento != null ? monitoring.origem_carregamento.endereco : '';

  const [address, setAddress] = useState(monitoringOrigem);
  const [spreadsheet, setSpreadsheet] = useState(romaneio);
  const [hasCollect, setHasCollect] = useState(!isObjectEmpty(monitoring));

  const [dateCollect, setDateCollect] = useState(data_coleta);
  const [dateCollectTitle, setDateCollectTitle] = useState(
    t('next-collect.collection-date'),
  );
  const [dateCollectColor, setDateCollectColor] = useState(false);

  useEffect(() => {
    if (!rescheduledDate) {
      return;
    }

    setDateCollect(rescheduledDate);
    setDateCollectTitle(t('next-collect.rescheduled-date'));
    setDateCollectColor(true);
  }, [rescheduledDate, t]);

  const viewProps = {
    onGaveBad,
    onGaveGood,
    onNavigation,
    loadOrigin: origem_carregamento,
    hasCollect,
    spreadsheet,
    dateCollect,
    address,
    dateCollectTitle,
    dateCollectColor,
  };

  return createElement(View, viewProps);
}

export default NextCollectContainer;
