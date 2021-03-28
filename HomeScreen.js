import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {JoinAppContext} from './JoinAppContext';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let tournament_id = '';
    let calendar = this.context.calendar;
    let ga = '';
    if (calendar !== undefined) {
      // console.log(calendar);
      for (let i = 0; i < calendar.length; i++) {
        // console.log(calendar[i].tournament_id);
        tournament_id += calendar[i].tournament_id;
        ga = <Text>{tournament_id}</Text>;
      }
    }
    if (this.context.calendar === 'empty') {
      return (
        <View style={styles.container}>
          <Text>You have 0 items.</Text>
          <Button
            title="Add new"
            onPress={() => this.props.navigation.navigate('Match')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>{this.context.calendar[0].tournament_id}</Text>
          {this.context.calendar.map((friend, index) => (
            <Text key={index}>{friend.toString()}</Text>
          ))}
          <Text>You have {tournament_id} items.</Text>
          <Button
            title="Add new"
            onPress={() => this.props.navigation.navigate('Match')}
          />
        </View>
      );
    }
  }
}
HomeScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
