import React, {Component} from 'react';
import {View, Dimensions, Button} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class WelcomeScreen extends Component {
  onComplete = () => {
    this.props.navigation.navigate(
      'Home',
      {},
      {
        type: 'Navigation/NAVIGATE',
        routeName: 'home',
      },
    );
  };

  render() {
    return (
      <View style={[styles.slideStyle]}>
        <View>
          <Button title="Next" color="#0288D1" onPress={this.onComplete} />
        </View>
      </View>
    );
  }
}

const styles = {
  slideStyle: {
    flex: 1,
    width: SCREEN_WIDTH,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#03A9F4',
  },
};

export default WelcomeScreen;
