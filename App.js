import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {JoinAppContext} from './JoinAppContext';
import MatchScreen from './components/match/MatchComponent';
import MatchCenterScreen from './components/match/MatchCenterComponent';
import Handler from './graphql/handler';
import TableScreen from './components/tournament/TableComponent';
import TeamScreen from './components/team/TeamMatchComponent';
import TeamListScreen from './components/team/ListComponent';
import TournamentListScreen from './components/tournament/ListComponent';

const Stack = createStackNavigator();
const handler = Handler;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendar: 'empty',
      teamCalendar: 'empty',
      matchData: 'empty',
      tournamentData: 'empty',
      teamData: 'empty',
      layoutHeight: 0,
      matchId: 'empty',
      tournamentId: 'empty',
      teamId: 'empty',
      imageList: {},
    };
  }

  getTournamentList = (calendar) => {
    let tournamentList = [];
    if (calendar !== 'empty' && calendar !== undefined) {
      for (let i = 0; i < calendar.length; i++) {
        if (!(calendar[i].tournament_id in tournamentList)) {
          let tournamentItem = {
            isExpanded: false,
            tournamentId: 0,
            Data: 'empty',
            Stadium: 'empty',
            matchItems: [],
          };
          tournamentItem.tournamentId = calendar[i].tournament_id;
          tournamentItem.Data = calendar[i].tournament;
          tournamentItem.Stadium = calendar[i].stadium;
          tournamentList[calendar[i].tournament_id] = tournamentItem;
        }
      }
    }
    return tournamentList;
  };

  getSortedData = (calendar) => {
    let currentDate = handler.getDate();
    let tournamentList = this.getTournamentList(calendar);
    if (calendar !== 'empty') {
      for (let i = 0; i < calendar.length; i++) {
        let matchItem = {
          item: {},
          visibility: true,
        };
        let match = calendar[i];
        if (match.tournament_id in tournamentList) {
          matchItem.item = match;
          this.state.imageList[match.team1.team_id] = match.team1.logo;
          this.state.imageList[match.team2.team_id] = match.team2.logo;
          if (match.start_dt.split(' ')[0] === currentDate) {
            matchItem.visibility = true;
          }
          tournamentList[match.tournament_id].matchItems.push(matchItem);
          tournamentList[calendar[i].tournament_id].tournamentId =
            calendar[i].tournament_id;
          tournamentList[calendar[i].tournament_id].Stadium =
            calendar[i].stadium;
        }
      }
    }

    return tournamentList;
  };

  async componentDidMount() {
    let from = handler.getDate();
    let to = handler.getDate(0, 1);
    console.log(from, to);
    await handler
      // .getMatchCalendar(from, to)
      .getMatchCalendar('2020-03-01', '2020-12-25')
      .then((value) => {
        let calendar = handler.dataFilter(value);
        calendar = this.getSortedData(calendar);
        calendar = handler.dataFilter(calendar);
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
      <JoinAppContext.Provider
        value={{
          calendar: this.state.calendar,
          layoutHeight: this.state.layoutHeight,
          matchId: this.state.matchId,
          matchData: this.state.matchData,
          tournamentData: this.state.tournamentData,
          teamCalendar: this.state.teamCalendar,
          teamData: this.state.teamData,
          imageList: this.state.imageList,
        }}>
        <NavigationContainer>
          <Stack.Navigator style={{fontFamily: 'OpenSans'}}>
            <Stack.Screen
              name="MatchCenter"
              component={MatchCenterScreen}
              options={{title: 'Турниры'}}
            />
            <Stack.Screen
              name="Match"
              component={MatchScreen}
            />
            <Stack.Screen
              name="TournamentTable"
              component={TableScreen}
            />
            <Stack.Screen
              name="Team"
              component={TeamScreen}
            />
            <Stack.Screen
              name="TeamList"
              component={TeamListScreen}
            />
            <Stack.Screen
              name="TournamentList"
              component={TournamentListScreen}
              options={{title: 'Список турниров'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </JoinAppContext.Provider>
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
