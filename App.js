import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet,} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {FriendsContext} from './FriendsContext';
import HomeScreen from './HomeScreen';
import FriendsScreen from './ItemsScreen';
import makeApolloClient from './apollo';
import gql from 'graphql-tag';

const Stack = createStackNavigator();
const client = makeApolloClient();

var G = 'sadas';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleFriends: ['A', 'B', 'S'],
      currentFriends: [],
      calendar: 'empty',
    };
  }

  getDate = (year, month, date) => {
    const d = new Date(year, month, date);
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    const resultDate = `${ye}-${mo}-${da}`;
    // console.log(resultDate);
  };

  getCalendar = (from, to) => {
    let result = client
      .query({
        variables: {from: from, to: to},
        query: gql`
          query TestQuery($from: Date!, $to: Date!) {
            calendar(filters: {start_date_range: {from: $from, to: $to}}) {
              paginatorInfo {
                count
              }
              data {
                tournament_id
                series_id
                number
                team1 {
                  team_id
                  short_name
                  logo
                }
                team2 {
                  team_id
                  short_name
                  logo
                }
                gf
                ga
                gfp
                gap
                stadium_id
                start_dt
              }
            }
          }
        `,
      })
      .then(function (value) {
        let calendar = value.data.calendar.data;
        let calendarArr = new Array(calendar.length);
        for (let i = 0; i < calendar.length; i++) {
          let id = calendar[i].tournament_id;
          if (calendarArr[id]) {
            continue;
          } else {
            let counter = 0;
            let bufferArr = new Array(calendar.length);
            for (let j = 0; j < calendar.length; j++) {
              if (calendar[j].tournament_id === id) {
                bufferArr[counter] = calendar[j];
                counter++;
              }
            }
            calendarArr[id] = bufferArr;
          }
        }
        return calendarArr;
      })
      .then((val) => {
        this.setState({
          calendar: val,
        });
        return true;
      })
      .catch((error) => {
        error;
      });
    // console.log(this.state.responseAPI);
    return result;
  };

  getSortedByTournament = (from, to) => {
    let calendar = this.getCalendar(from, to);
  };

  render() {
    const dataset = this.state.calendar;
    if (dataset === 'empty') {
      this.getCalendar('2019-12-01', '2019-12-25');
    } else {
      const filtered = dataset.filter(function (el) {
        return el != null;
      });
      this.state.calendar = filtered[0];
      // console.log(filtered[i]);
      // console.log(filtered[0][0].__typename);
    }

    return (
      <FriendsContext.Provider
        value={{
          currentFriends: this.state.currentFriends,
          possibleFriends: this.state.possibleFriends,
          calendar: this.state.calendar,
        }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Friends" component={FriendsScreen} />
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
