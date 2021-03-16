import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {FriendsContext} from '../../FriendsContext';
import Handler from '../../graphql/handler';

const dataHandler = Handler;
const today = new Date();

class MatchCenterScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var tournaments = [];
    if (
      this.context.calendar === 'empty' ||
      this.context.calendar === undefined
    ) {
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
      tournaments = Object.keys(this.context.calendar);
      console.log(this.context.calendar);
      return (
        <View style={styles.container}>
          <Text>{tournaments.toString()}</Text>
          {/*{tournaments.map((tournament, events) => (*/}
          {/*  <View style={styles.container}>*/}
          {/*    /!*<Text key={tournament}>{tournament}</Text>*!/*/}
          {/*    {this.context.calendar[parseInt(tournament)].map((item, k) => (*/}
          {/*      <Text key={k}>{item.__typename}</Text>*/}
          {/*    ))}*/}
          {/*  </View>*/}
          {/*))}*/}
        </View>
      );
    }
  }
}
MatchCenterScreen.contextType = FriendsContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MatchCenterScreen;
