import React, {Component} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FriendsContext} from '../../FriendsContext';
import Handler from '../../graphql/handler';

const handler = Handler;

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: '0',
      focusedRoster: '0',
      eventsList: '',
      statsList: '',
    };
  }

  async componentDidMount() {
    await this.context.matchData
      .then((value) => {
        this.setState({
          matchData: value,
        });

        this.setState({
          rosterList: value._W,
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

  rosterPreparer = (match) => {
    let team1 = match.team1.team_id;
    let team2 = match.team2.team_id;
    let teams = [match.team1, match.team2];
    let playersSubstitiutions = match.substitutions;
    let matchPlayers = match.players;
    let roster = {
      team1: [],
      team2: [],
    };

    teams.forEach(function (team) {
      if (team.players !== undefined) {
        team.players.forEach(function (player) {
          let playerItem = {
            id: '',
            number: '',
            name: '',
            sub: '',
            position: '',
          };
          playerItem.id = player.player_id;
          playerItem.name =
            player.last_name +
            ' ' +
            player.first_name +
            ' ' +
            player.middle_name;
          playerItem.position = player.position_id;
          if (playersSubstitiutions !== undefined) {
            playersSubstitiutions.forEach(function (substitution) {
              if (substitution.player_out_id === player.player_id) {
                playerItem.sub = {
                  player_in_id: substitution.player_in_id,
                  minute: substitution.minute,
                };
              }
            });
          }

          if (matchPlayers !== undefined) {
            matchPlayers.forEach(function (matchPlayer) {
              if (matchPlayer.player_id === player.player_id) {
                playerItem.number = matchPlayer.number;
              }
            });
          }

          if (team.team_id == team1) {
            roster.team1.push(playerItem);
          }
          if (team.team_id == team2) {
            roster.team2.push(playerItem);
          }
        });
      }
    });

    return roster;
  };

  statsPreparer = (match) => {
    return {
      team1: match.stats1,
      team2: match.stats2,
    };
  };

  tabsHandler = (page) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: page,
    });
  };

  rosterHandler = (team) => {
    this.setState({
      focusedRoster: team,
    });
  };

  matchRedirect = (matchId) => {
    this.context.matchId = matchId;
    this.context.matchData = handler.getMatchMain(matchId);
    return this.props.navigation.navigate('Match');
  };

  render() {
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
      let rosterList = this.rosterPreparer(matchD);
      this.state.rosterList = rosterList;
      console.log('THIS------------->', this.state.rosterList);
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
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.tabsHandler.bind(this, '0')}>
              <Text>{matchD.tournament.short_name}</Text>
            </TouchableOpacity>
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
              <View
                style={{
                  marginBottom: 20,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.rosterHandler.bind(this, '0')}>
                  <Text>{'rosterList.team1.team_id'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.rosterHandler.bind(this, '1')}>
                  <Text>{'rosterList.team2.team_id'}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: this.state.focusedRoster === '0' ? null : 'none',
                  overflow: 'hidden',
                }}>
                {rosterList.team1.map((item) => (
                  <Text>
                    {item.position}.{item.name}.{'     rost          '}
                  </Text>
                ))}
              </View>
              <View
                style={{
                  display: this.state.focusedRoster === '1' ? null : 'none',
                  overflow: 'hidden',
                }}>
                {rosterList.team2.map((item) => (
                  <Text>
                    {item.position}.{item.name}.{'     rost          '}
                  </Text>
                ))}
              </View>
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
