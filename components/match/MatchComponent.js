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
import Icon from 'react-native-vector-icons/Ionicons';
import soccerBall from '../../assets/images/soccer_ball.png';
import redCard from '../../assets/images/red_card.png';
import yellowCard from '../../assets/images/yellow_card.png';

const handler = Handler;
const EVENTS = {
  YellowCard: Image.resolveAssetSource(yellowCard).uri,
  RedCard: Image.resolveAssetSource(redCard).uri,
  Goal: Image.resolveAssetSource(soccerBall).uri,
};

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

    const round_id = this.context.matchData._W.round_id;
    await handler
      .getRound(round_id)
      .then((value) => {
        this.setState({
          tableList: value,
        });
        console.log(value);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  eventPreparer = (match) => {
    let eventsList = [];
    let events = [
      match.goals,
      match.yellowCards,
      match.redCards,
      match.shootouts,
    ];
    let teams = [match.team1, match.team2];
    let playersList = {};
    teams.forEach(function (team) {
      if (team.players !== undefined) {
        team.players.forEach(function (player) {
          playersList[player.player_id] =
            player.last_name + ' ' + player.first_name;
        });
      }
    });

    events.forEach(function (event) {
      if (event !== undefined) {
        event.forEach(function (item) {
          let eventItem = {
            logo: '',
            time: '',
            team: '',
            name: '',
          };
          if (parseInt(item.team_id) === parseInt(match.team1.team_id)) {
            eventItem.team = 1;
          } else {
            eventItem.team = 2;
          }
          console.log(item.minute, 'qweqweqw');
          eventItem.logo = EVENTS[item.__typename];
          if (item.minute === null) {
            eventItem.time = '  ';
          } else {
            eventItem.time = item.minute + "'";
          }
          eventItem.name = playersList[item.player_id];
          eventsList.push(eventItem);
        });
      }
    });
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
    const tableList = this.state.tableList;
    if (
      rosterList === undefined ||
      eventsList === undefined ||
      matchData === undefined ||
      tableList === undefined
    ) {
      return (
        <View>
          <Text>Wait</Text>
        </View>
      );
    } else {
      console.log(matchData);
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
                    uri: handler.getTeamImageURI(
                      matchData.team1.team_id,
                      matchData.team1.logo,
                    ),
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
                    uri: handler.getTeamImageURI(
                      matchData.team2.team_id,
                      matchData.team2.logo,
                    ),
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
            <View style={{width: '5%'}} />
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
            <View style={{width: '5%'}} />
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
                  <View style={styles.eventList_container}>
                    <View style={styles.eventList_team1}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontFamily: 'OpenSans',
                          display: item.team === 2 ? null : 'none',
                        }}>
                        {item.time}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontFamily: 'OpenSans',
                          display: item.team === 1 ? null : 'none',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <Image
                      style={styles.eventList_image}
                      source={{
                        uri: item.logo,
                      }}
                    />
                    <View style={styles.eventList_team2}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontFamily: 'OpenSans',
                          display: item.team === 2 ? null : 'none',
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontFamily: 'OpenSans',
                          display: item.team === 1 ? null : 'none',
                        }}>
                        {item.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                display: this.state.focusedTab === 1 ? null : 'none',
                overflow: 'hidden',
              }}>
              <View style={styles.tableList_headerContainer}>
                <View style={styles.tableList_headerItemFirst}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontFamily: 'OpenSans',
                    }}>
                    Команда
                  </Text>
                </View>
                <View style={styles.tableList_headerItem}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontFamily: 'OpenSans',
                    }}>
                    И
                  </Text>
                </View>
                <View style={styles.tableList_headerItem}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontFamily: 'OpenSans',
                    }}>
                    В
                  </Text>
                </View>
                <View style={styles.tableList_headerItem}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontFamily: 'OpenSans',
                    }}>
                    Н
                  </Text>
                </View>
                <View style={styles.tableList_headerItem}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontFamily: 'OpenSans',
                    }}>
                    П
                  </Text>
                </View>
                <View style={styles.tableList_headerItemLast}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'black',
                      fontFamily: 'OpenSans',
                    }}>
                    О
                  </Text>
                </View>
              </View>
              <ScrollView>
                {tableList.tableRows.map((row, number) => (
                  <View
                    style={[
                      styles.tableList_headerContainer,
                      number % 2 === 0
                        ? styles.tableList_rowContainerEven
                        : styles.tableList_rowContainer,
                    ]}>
                    <View style={styles.tableList_rowItemFirst}>
                      <View style={styles.tableList_rowItemPersonal}>
                        <Image
                          style={styles.logoMini}
                          source={{
                            uri: handler.getTeamImageURI(
                              row.team.team_id,
                              row.team.logo,
                            ),
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'black',
                            fontFamily: 'OpenSans',
                            marginLeft: '5%',
                          }}>
                          {row.team.full_name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tableList_rowItem}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontFamily: 'OpenSans',
                        }}>
                        {row.games}
                      </Text>
                    </View>
                    <View style={styles.tableList_rowItem}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontFamily: 'OpenSans',
                        }}>
                        {row.wins}
                      </Text>
                    </View>
                    <View style={styles.tableList_rowItem}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontFamily: 'OpenSans',
                        }}>
                        {row.draws}
                      </Text>
                    </View>
                    <View style={styles.tableList_rowItem}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontFamily: 'OpenSans',
                        }}>
                        {row.losses}
                      </Text>
                    </View>
                    <View style={styles.tableList_rowItemLast}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'black',
                          fontFamily: 'OpenSans',
                        }}>
                        {row.points}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
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
                        uri: handler.getTeamImageURI(
                          matchData.team1.team_id,
                          matchData.team1.logo,
                        ),
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
                        uri: handler.getTeamImageURI(
                          matchData.team2.team_id,
                          matchData.team2.logo,
                        ),
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
              width: '100%',
              height: 40,
              alignSelf: 'center',
              borderTopWidth: 0.5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
                justifyContent: 'center',
                width: '100%',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('MatchCenter')}
                style={{
                  width: '33%',
                  color: 'lightgray',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="football-outline" size={30} color="#517fa4" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('TournamentList')}
                style={{
                  width: '33%',
                  color: 'lightgray',
                  borderLeftWidth: 0.5,
                  borderRightWidth: 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="trophy-outline" size={30} color="#517fa4" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('TeamList')}
                style={{
                  width: '33%',
                  color: 'lightgray',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="shield-outline" size={30} color="#517fa4" />
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
    paddingBottom: 10,
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

  tableList_headerContainer: {
    width: '100%',
    height: '10%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  tableList_rowContainer: {
    width: '100%',
    height: '10%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },

  tableList_rowContainerEven: {
    width: '100%',
    height: '10%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 5,
  },

  tableList_headerItemFirst: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '40%',
    height: '100%',
    paddingLeft: '2%',
  },

  tableList_headerItem: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '10%',
    height: '100%',
  },

  tableList_headerItemLast: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
    paddingRight: '2%',
  },

  tableList_rowItemFirst: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '40%',
    height: '50%',
    paddingLeft: '2%',
  },
  tableList_rowItemPersonal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '90%',
  },
  tableList_rowItem: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '10%',
    height: '100%',
  },
  tableList_rowItemLast: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
    paddingRight: '2%',
  },

  eventList_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5,
    width: '100%',
  },

  eventList_team1: {
    width: '40%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  eventList_team2: {
    width: '40%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  eventList_image: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 300,
    justifyContent: 'flex-start',
  },
  rosterTabsItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 0,
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
    width: 300,
  },

  rosterList_itemText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'OpenSans',
  },
});
