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
import soccerBall from '../../src/images/soccer-ball.png';

const handler = Handler;
const EVENT_IMAGE = Image.resolveAssetSource(soccerBall).uri;

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: 0,
      focusedRoster: 0,
      eventsList: undefined,
      statsList: undefined,
      rosterList: undefined,
    };
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      title: this.context.tournamentData.Data.full_name,
    });
    await this.context.matchData
      .then((value) => {
        this.setState({
          matchData: value,
        });
        console.log(value);
        this.setState({
          eventList: this.eventPreparer(value),
        });
        this.setState({
          rosterList: this.rosterPreparer(value),
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
          color: '',
        };
        eventItem.event = 'ГОЛ';
        eventItem.color = 'lightblue';
        eventItem.time = goal.minute;
        eventsList.push(eventItem);
      });
    }

    if (yellowCardItems !== undefined) {
      yellowCardItems.forEach(function (card) {
        let eventItem = {
          time: '',
          event: '',
          color: '',
        };
        eventItem.event = 'ЖК';
        eventItem.color = 'yellow';
        eventItem.time = card.minute;
        eventsList.push(eventItem);
      });
    }

    if (redCardItems !== undefined) {
      redCardItems.forEach(function (card) {
        let eventItem = {
          time: '',
          event: '',
          color: '',
        };
        eventItem.event = 'КК';
        eventItem.color = 'red';
        eventItem.time = card.minute;
        eventsList.push(eventItem);
      });
    }

    if (shootoutItems !== undefined) {
      shootoutItems.forEach(function (card) {
        let eventItem = {
          time: '',
          event: '',
          color: '',
        };
        eventItem.event = 'ПЕНАЛЬТИ';
        eventItem.color = 'blue';
        eventItem.time = card.minute;
        eventsList.push(eventItem);
      });
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
          playerItem.name = player.last_name + ' ' + player.first_name;
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
    const matchData = this.state.matchData;
    const eventsList = this.state.eventList;
    const rosterList = this.state.rosterList;
    if (
      rosterList === undefined ||
      eventsList === undefined ||
      matchData === undefined
    ) {
      return (
        <View>
          <Text>Wait</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.matchData} key={'qwe'}>
            <Text style={styles.matchData_date}>
              {handler.getFormedDate(matchData.start_dt)}
            </Text>
            <View style={styles.matchData_container}>
              <View style={styles.matchData_team}>
                <Image
                  style={styles.matchData_teamLogo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text style={styles.matchData_teamName}>
                  {matchData.team1.full_name}
                </Text>
              </View>
              <Text style={styles.matchData_score}>
                {matchData.gf}
                {':'}
                {matchData.ga}
              </Text>
              <View style={styles.matchData_team}>
                <Image
                  style={styles.matchData_teamLogo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text style={styles.matchData_teamName}>
                  {matchData.team2.full_name}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.matchData_additional}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.tournamentRedirect.bind(this)}>
              <Text style={styles.matchData_additionalText}>
                {matchData.tournament.short_name}
              </Text>
            </TouchableOpacity>
            <Text style={styles.matchData_additionalText}>
              {matchData.stadium.name}
            </Text>
          </View>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.tabsHandler.bind(this, 0)}>
              <Text
                style={[
                  styles.tabsItem,
                  this.state.focusedTab === 0
                    ? styles.tabsItem_chosen
                    : styles.tabsItem_default,
                ]}>
                {'События'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.tabsHandler.bind(this, 1)}>
              <Text
                style={[
                  styles.tabsItem,
                  this.state.focusedTab === 1
                    ? styles.tabsItem_chosen
                    : styles.tabsItem_default,
                ]}>
                {'Статистика'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.tabsHandler.bind(this, 2)}>
              <Text
                style={[
                  styles.tabsItem,
                  this.state.focusedTab === 2
                    ? styles.tabsItem_chosen
                    : styles.tabsItem_default,
                ]}>
                {'Составы'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mainDataContainer}>
            <View
              style={{
                display: this.state.focusedTab === 0 ? null : 'none',
                overflow: 'hidden',
              }}>
              <ScrollView>
                {eventsList.map((item) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 5,
                      width: 400,
                    }}>
                    <Image
                      style={styles.eventList_image}
                      source={{
                        uri: EVENT_IMAGE,
                      }}
                    />
                    <Text>
                      {item.time}
                      {"'"}
                    </Text>
                  </View>
                ))}
              </ScrollView>
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
              <View style={styles.rosterList_container}>
                <View style={styles.rosterTabs_container}>
                  <TouchableOpacity
                    style={[
                      styles.rosterTabsItem,
                      this.state.focusedRoster === 0
                        ? styles.rosterTabsItem_chosen
                        : styles.rosterTabsItem_default,
                    ]}
                    activeOpacity={0.8}
                    onPress={this.rosterHandler.bind(this, 0)}>
                    <Image
                      style={styles.logoMini}
                      source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                      }}
                    />
                    <Text
                      style={{
                        color:
                          this.state.focusedRoster === 0 ? '#3498db' : 'black',
                      }}>
                      {rosterList.team1.name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.rosterTabsItem,
                      this.state.focusedRoster === 1
                        ? styles.rosterTabsItem_chosen
                        : styles.rosterTabsItem_default,
                    ]}
                    activeOpacity={0.8}
                    onPress={this.rosterHandler.bind(this, 1)}>
                    <Image
                      style={styles.logoMini}
                      source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                      }}
                    />
                    <Text
                      style={{
                        color:
                          this.state.focusedRoster === 1 ? '#3498db' : 'black',
                      }}>
                      {rosterList.team2.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={{
                    marginBottom: 26,
                  }}>
                  <View
                    style={{
                      display: this.state.focusedRoster === 0 ? null : 'none',
                      overflow: 'hidden',
                    }}>
                    {rosterList.team1.map((item) => (
                      <View style={styles.rosterList_item}>
                        <Text style={styles.rosterList_itemText}>
                          {item.number}
                          {item.name}
                          {item.position}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View
                    style={{
                      display: this.state.focusedRoster === 1 ? null : 'none',
                      overflow: 'hidden',
                    }}>
                    {rosterList.team2.map((item) => (
                      <View style={styles.rosterList_item}>
                        <Text style={styles.rosterList_itemText}>
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
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchData: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  matchData_date: {
    fontSize: 18,
    color: '#95a5a6',
    fontFamily: 'OpenSans',
  },
  matchData_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  matchData_score: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 35,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  matchData_team: {
    justifyContent: 'center',
    width: 120,
    alignItems: 'center',
  },
  matchData_teamName: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'OpenSans',
  },
  matchData_teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 5,
  },
  matchData_additional: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
    marginBottom: 15,
  },
  matchData_additionalText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 18,
    color: '#95a5a6',
    fontFamily: 'OpenSans',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    alignItems: 'center',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tabsItem: {
    overflow: 'hidden',
    fontFamily: 'OpenSans',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 25,
    marginRight: 25,
    height: 40,
  },
  tabsItem_default: {
    borderBottomWidth: 0,
    color: 'lightgray',
    borderBottomColor: 'lightgray',
  },
  tabsItem_chosen: {
    borderBottomWidth: 3,
    color: '#3498db',
    borderBottomColor: '#3498db',
  },
  eventList_image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10,
  },
  mainDataContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
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
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 5,
  },
  logoMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 2,
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
  rosterTabs_container: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    justifyContent: 'flex-start',
  },
  rosterTabsItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 3,
    margin: 5,
    alignItems: 'center',
  },
  rosterTabsItem_default: {
    backgroundColor: '#fff',
    color: 'lightgray',
    borderBottomColor: 'lightgray',
  },
  rosterTabsItem_chosen: {
    backgroundColor: 'lightgray',
    color: '#3498db',
    borderBottomColor: '#3498db',
  },
  rosterList_container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    width: 400,
  },
  rosterList_item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5,
    width: 200,
  },

  rosterList_itemText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'OpenSans',
  },
});
