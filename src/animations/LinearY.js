import React from 'react';
import {
  Animated,
} from 'react-native';
import { useRef } from 'react';
import { useEffect } from 'react';
import 'react-native-gesture-handler'

export default function PositiveY(props) {
  const logo = useRef(new Animated.ValueXY({ x: -400, y: 400 })).current
  useEffect(() => {
    Animated.timing(
      logo,
      {
        // toValue: { x: 5, y: 20 },
        speed: 5, duration: 600, useNativeDriver: true
      }
    ).start();
  })
  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateY: logo.y }]
      }}
    >
      {props.children}
    </Animated.View>
  );
}



