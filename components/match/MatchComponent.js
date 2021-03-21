import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {FriendsContext} from '../../FriendsContext';
import Handler from '../../graphql/handler';

const handler = Handler;

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: '0',
      eventsList: '',
    };
  }

  async componentDidMount() {
    await this.context.matchData
      .then((value) => {
        this.setState({
          matchData: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  eventPreparer = (match) => {
    let eventsList = [];
    let goalItems = match.goals;
    let yellowCardItems = match.yellowCards;
    let redCardItems = match.redCards;
    let shootoutItems = match.shootouts;

    if (goalItems !== undefined) {
      goalItems.forEach(function (goal) {
        let eventItem = {
          time: '',
          event: '',
        };
        eventItem.event = goal.situation + goal.player_id;
        eventItem.time = goal.minute;
        eventsList.push(eventItem);
      });
    }

    if (yellowCardItems !== undefined) {
      yellowCardItems.forEach(function (card) {
        let eventItem = {
          time: '',
          event: '',
        };
        eventItem.event = card.reason + card.player_id;
        eventItem.time = card.minute;
        eventsList.push(eventItem);
      });
    }

    if (redCardItems !== undefined) {
      redCardItems.forEach(function (card) {
        let eventItem = {
          time: '',
          event: '',
        };
        eventItem.event = card.reason + card.player_id;
        eventItem.time = card.minute;
        eventsList.push(eventItem);
      });
    }

    if (shootoutItems !== undefined) {
      shootoutItems.forEach(function (card) {
        let eventItem = {
          time: '',
          event: '',
        };
        eventItem.event = card.result + card.player_id;
        eventItem.time = card.minute;
        eventsList.push(eventItem);
      });
    }

    for (let i = 0; i < eventsList.length - 1; i++) {
      for (let j = 1; j < eventsList.length; j++) {
        if (eventsList[i].time > eventsList[j].time) {
          let buff = eventsList[i];
          eventsList[i] = eventsList[j];
          eventsList[j] = buff;
        }
      }
    }

    return eventsList;
  };

  EventsPage = (props) => {
    this.setState({
      focusedTab: 'events',
    });
    let events = this.eventPreparer(props.match);

    if (events !== undefined) {
      return (
        <View>
          {events.map((item) => (
            <Text>
              {item.event}.{item.time}
            </Text>
          ))}
        </View>
      );
    } else {
      return (
        <View>
          <Text>events error</Text>
        </View>
      );
    }
  };

  statisticsPage = () => {
    this.setState({
      focusedTab: 'statistics',
    });
  };

  rosterPage = () => {
    this.setState({
      focusedTab: 'roster',
    });
  };

  tabsHandler = (page) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: page,
    });
  };

  render() {
    console.log(this.state.focusedTab);
    const matchD = this.context.matchData._W;
    if (
      this.context.matchId === 'empty' ||
      this.context.matchId === undefined ||
      matchD === null
    ) {
      return (
        <View style={styles.container}>
          <Text style={styles.topHeading}>Wait</Text>
          <Button
            title="Back to home"
            onPress={() => this.props.navigation.navigate('MatchCenter')}
          />
        </View>
      );
    } else {
      let eventsList = this.eventPreparer(matchD);
      return (
        <View style={styles.container}>
          <View style={styles.containerTop} key={'qwe'}>
            <Text>{this.context.matchId}</Text>
            <Text>{matchD.start_dt}</Text>
            <Text>
              {matchD.team1.logo}.{matchD.gf}.{'      :      '}.{matchD.ga}.
              {matchD.team2.logo}
            </Text>
            <Text>
              {matchD.team1.short_name}.{'            '}.
              {matchD.team2.short_name}
            </Text>
          </View>
          <View style={{height: 30, marginBottom: 30}}>
            <ScrollView horizontal={true} style={styles.scrollItem}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.tabsHandler.bind(this, '0')}>
                <Text>{'        События         '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchItem}
                onPress={this.tabsHandler.bind(this, '1')}>
                <Text>{'        Статистика          '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.tabsHandler.bind(this, '2')}>
                <Text>{'        Составы          '}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.mainDataContainer}>
            <Text>{this.state.focusedTab}</Text>
            <View
              style={{
                display: this.state.focusedTab === '0' ? null : 'none',
                overflow: 'hidden',
              }}>
              {eventsList.map((item) => (
                <Text>
                  {item.event}.{item.time}.{'events'}
                </Text>
              ))}
            </View>
            <View
              style={{
                display: this.state.focusedTab === '1' ? null : 'none',
                overflow: 'hidden',
              }}>
              {eventsList.map((item) => (
                <Text>
                  {item.event}.{item.time}.{'stats'}
                </Text>
              ))}
            </View>
            <View
              style={{
                display: this.state.focusedTab === '2' ? null : 'none',
                overflow: 'hidden',
              }}>
              {eventsList.map((item) => (
                <Text>
                  {item.event}.{item.time}.{'roast'}
                </Text>
              ))}
            </View>
          </View>
          {/*<Button*/}
          {/*  title="К списку матчей"*/}
          {/*  onPress={() => this.props.navigation.navigate('MatchCenter')}*/}
          {/*/>*/}
        </View>
      );
    }
  }
}
MatchScreen.contextType = FriendsContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTop: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  touchItem: {
    borderBottomColor: 'blue',
    borderBottomWidth: 2,
  },
  scrollItem: {
    flex: 1,
    height: 10,
  },
  mainDataContainer: {
    flex: 1,
    marginBottom: 100,
  },
});
