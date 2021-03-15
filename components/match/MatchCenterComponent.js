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

  getTournamentList = (calendar) => {
    let tournamentList = {};
    if (calendar !== 'empty') {
      for (let i = 0; i < calendar.length; i++) {
        if (!(calendar[i].tournament_id in tournamentList)) {
          tournamentList[calendar[i].tournament_id] = [];
        }
      }
    }
    return tournamentList;
  };

  getSortedData = (calendar) => {
    let resultList = this.getTournamentList(calendar);
    if (calendar !== 'empty') {
      for (let i = 0; i < calendar.length; i++) {
        if (calendar[i].tournament_id in resultList) {
          resultList[calendar[i].tournament_id].push(calendar[i]);
        }
      }
    }
    return resultList;
  };

  render() {
    if (this.context.calendar !== 'empty') {
      let calendar = dataHandler.dataFilter(this.context.calendar);
      let result = this.getSortedData(calendar);
      console.log(result);
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
          <Text>You have 0 items.</Text>
          <Button
            title="Add new"
            onPress={() => this.props.navigation.navigate('Match')}
          />
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
