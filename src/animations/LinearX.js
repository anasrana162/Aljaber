import React from 'react';
import {
  Animated
} from 'react-native';
import 'react-native-gesture-handler'



class LinearX extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pos: new Animated.ValueXY({ x: -400, y: 400 }),
    }
  }

  Anim = () => {
    Animated.timing(
      this.state.pos,
      {
        
        speed: 5, duration: 1000, useNativeDriver: true,
      }
    ).start();
  }

  componentDidMount() {
    this.Anim()
  }

  render() {
    return (
      <Animated.View
        style={
          {
            ...this.props.style,
            transform: [{ translateX: this.state.pos.x }]
          }
        }
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

export default LinearX;

