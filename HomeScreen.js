import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {FriendsContext} from './FriendsContext';

class HomeScreen extends React.Component {
  // getC = () => {
  //   console.log(this.context.calendar);
  //
  //   return this.context.calendar;
  // };

  render() {
    let tournament_id = '';
    let calendar = this.context.calendar;
    let ga = '';
    // let ga = '';
    // let ga = '';
    // let ga = '';
    // let ga = '';
    // let ga = '';
    if (calendar !== undefined) {
      console.log(calendar);
      for (let i = 0; i < calendar.length; i++) {
        console.log(calendar[i].tournament_id);
        tournament_id += calendar[i].tournament_id;
        ga = <Text>{tournament_id}</Text>;
      }
    }
    return (
      <View style={styles.container}>
        <Text>{tournament_id}</Text>
        {ga}
        <Text>You have {tournament_id} items.</Text>
        <Button
          title="Add new"
          onPress={() => this.props.navigation.navigate('Friends')}
        />
      </View>
    );
  }
}
HomeScreen.contextType = FriendsContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
