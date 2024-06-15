import React, {useState, useEffect} from 'react';

import {WrapperAnimation, Animation, WrapperNumber, Number} from './styles';

const rangeNumbers = {
  min: 1,
  max: 59,
};

const parameters = {
  asc: {
    signal: false,
    initial: rangeNumbers.min,
  },
  desc: {
    signal: true,
    initial: rangeNumbers.max,
  },
};

function LoadingTimer(props) {
  const {operation = 'desc'} = props;

  const [count, setCount] = useState();
  const [param, setParam] = useState();

  useEffect(() => {
    setParam(parameters[operation]);
  }, [operation]);

  useEffect(() => {
    if (!param) {
      return;
    }
    setCount(param.initial);
  }, [param]);

  useEffect(() => {
    if (!count) {
      return;
    }

    setTimeout(() => {
      setCount((e) => {
        if (param.initial === Math.abs(e - rangeNumbers.max) + 1) {
          return param.initial;
        }

        return param.signal ? e - 1 : e + 1;
      });
    }, 1000);
  }, [count, param.initial, param.signal]);

  return (
    <WrapperAnimation>
      <Animation />
      <WrapperNumber>
        <Number>{count}</Number>
      </WrapperNumber>
    </WrapperAnimation>
  );
}

export default LoadingTimer;
