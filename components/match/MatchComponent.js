import React, {Component} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';
import {Icon} from 'react-native-elements';

const handler = Handler;

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: 0,
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
        roster.team1.name = match.team1.full_name;
        roster.team2.name = match.team2.full_name;
        roster.team1.logo = match.team1.logo;
        roster.team2.logo = match.team2.logo;
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

  tabsHandler = (tab) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: tab,
    });
  };

  rosterHandler = (team) => {
    this.setState({
      focusedRoster: team,
    });
  };

  tournamentRedirect = () => {
    return this.props.navigation.navigate('TournamentTable');
  };

  render() {
    const matchData = this.context.matchData._W;

    if (
      this.context.matchId === 'empty' ||
      this.context.matchId === undefined ||
      matchData === null
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
      let eventsList = this.eventPreparer(matchData);
      let rosterList = this.rosterPreparer(matchData);
      this.state.rosterList = rosterList;
      console.log(matchData);
      console.log(rosterList);
      return (
        <View style={styles.container}>
          <View style={styles.containerTop} key={'qwe'}>
            <Text>{matchData.start_dt}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  width: 120,
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.logo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text>{matchData.team1.full_name}</Text>
              </View>
              <Text>
                {matchData.gf}{'      :      '}{matchData.ga}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  width: 120,
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.logo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text>{matchData.team2.full_name}</Text>
              </View>
            </View>
          </View>
          <View style={styles.containerBottom}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.tournamentRedirect.bind(this)}>
              <Text style={styles.borderItems}>
                {matchData.tournament.short_name}
              </Text>
            </TouchableOpacity>
            <Text style={styles.borderItems}>{matchData.stadium.name}</Text>
          </View>
          <View style={styles.tabsContainer}>
            <ScrollView horizontal={true} style={styles.scrollItem}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 0 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 0)}>
                <Text>{'        События         '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 1 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 1)}>
                <Text>{'        Статистика          '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 2 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 2)}>
                <Text>{'        Составы          '}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.mainDataContainer}>
            <View
              style={{
                display: this.state.focusedTab === 0 ? null : 'none',
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
                display: this.state.focusedTab === 1 ? null : 'none',
                overflow: 'hidden',
              }}>
              <View
                style={{
                  width: '100%',
                  marginBottom: 5,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    width: '40%',
                  }}>
                  Команда
                </Text>
                <Text
                  style={{
                    width: '10%',
                  }}>
                  И
                </Text>
                <Text
                  style={{
                    width: '10%',
                  }}>
                  В
                </Text>
                <Text
                  style={{
                    width: '10%',
                  }}>
                  Н
                </Text>
                <Text
                  style={{
                    width: '10%',
                  }}>
                  П
                </Text>
                <View
                  style={{
                    width: '20%',
                    alignItems: 'flex-end',
                    alignSelf: 'flex-end',
                  }}>
                  <Text>О</Text>
                </View>
              </View>
              {eventsList.map((item) => (
                <View>
                  <Text>
                    {item.event}.{item.time}.{'stats'}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                display: this.state.focusedTab === 2 ? null : 'none',
                overflow: 'hidden',
              }}>
              <View
                style={{
                  marginBottom: 20,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <TouchableOpacity
                  style={styles.borderItems}
                  activeOpacity={0.8}
                  onPress={this.rosterHandler.bind(this, '0')}>
                  <Image
                    style={styles.logo}
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                  <Text>{rosterList.team1.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.borderItems}
                  activeOpacity={0.8}
                  onPress={this.rosterHandler.bind(this, '1')}>
                  <Image
                    style={styles.logo}
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                  <Text>{rosterList.team2.name}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View
                  style={{
                    display: this.state.focusedRoster === '0' ? null : 'none',
                    overflow: 'hidden',
                  }}>
                  {rosterList.team1.map((item) => (
                    <View>
                      <Text>
                        {item.number}.{item.name}.{item.position}
                      </Text>
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    display: this.state.focusedRoster === '1' ? null : 'none',
                    overflow: 'hidden',
                  }}>
                  {rosterList.team2.map((item) => (
                    <View>
                      <Text>
                        {item.number}
                        {item.name}
                        {item.position}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              width: 432,
              height: 50,
              alignSelf: 'center',
              backgroundColor: 'lightGray',
              borderTopWidth: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('MatchCenter')}
                style={{
                  width: 144,
                  color: 'gray',
                }}>
                <Icon
                  name="ios-american-football"
                  type="ionicon"
                  color="#517fa4"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('TournamentList')}
                style={{
                  width: 144,
                  color: 'gray',
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                }}>
                <Icon
                  name="ios-trophy-outline"
                  type="ionicon"
                  color="#517fa4"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('TeamList')}
                style={{
                  width: 144,
                  color: 'gray',
                }}>
                <Icon name="ios-people-sharp" type="ionicon" color="#517fa4" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
}
MatchScreen.contextType = JoinAppContext;

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
    marginBottom: 5,
  },
  containerBottom: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tabsContainer: {
    height: 30,
    marginBottom: 5,
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
    marginBottom: 25,
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  logo: {
    width: 25,
    height: 25,
    borderRadius: 100,
    margin: 5,
  },

  borderItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    alignItems: 'center',
  },
});
