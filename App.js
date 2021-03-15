import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {FriendsContext} from './FriendsContext';
import MatchScreen from './MatchScreen';
import MatchCenterScreen from './components/match/MatchCenterComponent';
import Handler from './graphql/handler';

const Stack = createStackNavigator();
const handler = Handler;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleFriends: ['A', 'B', 'S'],
      currentFriends: [],
      calendar: 'empty',
      days: 0,
    };
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

  async componentDidMount() {
    // let days = this.context.days;
    // let from = dataHandler.getDate();
    // let to = dataHandler.getDate(days);
    await handler
      .getMatchCalendar('2020-12-01', '2020-12-25')
      .then((value) => {
        const calendar = this.getSortedData(handler.dataFilter(value));
        this.setState({
          calendar: calendar,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <FriendsContext.Provider
        value={{
          currentFriends: this.state.currentFriends,
          possibleFriends: this.state.possibleFriends,
          calendar: this.state.calendar,
          days: this.state.days,
        }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="MatchCenter" component={MatchCenterScreen} />
            <Stack.Screen name="Match" component={MatchScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FriendsContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

// console.log(v.getMatchCalendar('2019-12-01', '2019-12-25'));
// console.log(v.getMatchMain(1056738));
// console.log(v.getRound(1003809));
// console.log(v.getTeamList(10));
// console.log(v.getTeamMatch(1056737));
// console.log(v.getTournament(1006386));
// console.log(v.getTournamentApplication(1133117, 1006386));
// console.log(v.getTournamentList(2));
// console.log(v.getTournamentSchedule(1002307, 1003809 ,'2019-12-01', '2019-12-25'));
// console.log(
//   v.getTournamentTable(1002307, 1003809, '2001-12-01', '2020-12-25'),
// );
