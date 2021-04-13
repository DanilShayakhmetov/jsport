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
var PLAYERS = <Text>{''}</Text>;

export default class TableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: 0,
      focusedRoster: 0,
      matchList: 'empty',
      tableList: 'empty',
      players: 'empty',
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
          rosterList: value._W,
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Отвечает за ненужнй раздел, просто заглушка
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

  tabsHandler = (tab) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: tab,
    });
  };

  //Отвечает за ненужнй раздел, просто заглушка
  rosterHandler = (team) => {
    this.setState({
      focusedRoster: team,
    });
  };

  showApplication = (team, approvedStatus = 1) => {
    this.context.teamId = team.team_id;
    this.context.teamData = handler
      .getTournamentApplication(team.team_id, this.context.tournamentId)
      .then((value) => {
        console.log('this', value.application.players, 'this');
        let players = {
          approved: [],
          disapproved: [],
        };
        value.application.players.forEach(function (player) {
          if (player.status === 'approved') {
            players.approved.push(player);
          } else {
            players.disapproved.push(player);
          }
        });

        let approved = (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              marginLeft: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 1)}
              style={{margin: 5}}>
              <Text style={{borderWidth: 1, borderRadius: 5}}>
                {'        Заявленные          '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 0)}
              style={{margin: 5}}>
              <Text style={{borderWidth: 1, borderRadius: 5}}>
                {'        Отзаявленные          '}
              </Text>
            </TouchableOpacity>

            {players.approved.map((player) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.teamRedirect.bind(this, team)}
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 3,
                }}>
                <Text style={{width: '5%'}}>{player.player.number}</Text>
                <Image
                  style={styles.teamLogo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text style={{width: '25%'}}>{player.player.last_name}</Text>
                <Text style={{width: '25%'}}>{player.player.first_name}</Text>
                <Text style={{width: '25%'}}>{player.player.middle_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
        let disapproved = (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              marginLeft: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 1)}
              style={{margin: 5}}>
              <Text style={{borderWidth: 1, borderRadius: 5}}>
                {'        Заявленные          '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 0)}
              style={{margin: 5}}>
              <Text style={{borderWidth: 1, borderRadius: 5}}>
                {'        Отзаявленные          '}
              </Text>
            </TouchableOpacity>

            {players.disapproved.map((player) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.teamRedirect.bind(this, team)}
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 3,
                }}>
                <Text style={{width: '5%'}}>{player.player.number}</Text>
                <Image
                  style={styles.teamLogo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text style={{width: '25%'}}>{player.player.last_name}</Text>
                <Text style={{width: '25%'}}>{player.player.first_name}</Text>
                <Text style={{width: '25%'}}>{player.player.middle_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
        if (approvedStatus) {
          PLAYERS = approved;
        } else {
          PLAYERS = disapproved;
        }

        this.tabsHandler(3);
      });
  };

  teamRedirect = (team) => {
    this.context.teamData = team;
    return this.props.navigation.navigate('Team');
  };

  render() {
    const matchD = this.context.matchData._W;
    const matchList = this.context.tournamentData.matchItems;
    const tableList = this.state.tableList;
    if (
      tableList === 'empty' ||
      tableList === undefined ||
      matchList === 'empty' ||
      matchList === undefined ||
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
      let rosterList = this.rosterPreparer(matchD);
      this.state.rosterList = rosterList;
      console.log(tableList);
      return (
        <View style={styles.container}>
          <View style={styles.titleText}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Image
                style={styles.logo}
                source={{
                  uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
              />
              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.tabsHandler.bind(this, 0)}>
                  <Text style={{fontFamily: 'OpenSans', fontSize: 18}}>
                    {matchD.tournament.short_name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{height: 30, marginBottom: 10}}>
            <ScrollView horizontal={true} style={styles.scrollItem}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 0 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 0)}>
                <Text>{'        Матчи         '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 1 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 1)}>
                <Text>{'        Таблица          '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 2 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 2)}>
                <Text>{'        Статистика          '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  borderBottomWidth: this.state.focusedTab === 3 ? 2 : 0,
                  borderBottomColor: 'blue',
                  overflow: 'hidden',
                }}
                onPress={this.tabsHandler.bind(this, 3)}>
                <Text>{'        Команды          '}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View
            style={{
              height: 30,
              marginBottom: 30,
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'OpenSans',
              fontSize: 16,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'lightgray',
              padding: 5,
            }}>
            <Text>{tableList.name}</Text>
          </View>
          <View style={styles.mainDataContainer}>
            <View
              style={{
                display: this.state.focusedTab === 0 ? null : 'none',
                overflow: 'hidden',
              }}>
              <ScrollView>
                {matchList.map((item) => (
                  <View
                    style={{
                      height: 30,
                      marginBottom: 30,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginRight: 10,
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={styles.teamLogo}
                        source={{
                          uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }}
                      />
                      <Image
                        style={styles.teamLogo}
                        source={{
                          uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{fontFamily: 'OpenSans', fontSize: 16}}>
                        {item.item.team1.full_name}
                        {'   -   '}
                        {item.item.team2.full_name}
                      </Text>
                      <Text style={{fontFamily: 'OpenSans', fontSize: 16}}>
                        {item.item.start_dt}
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
              <View
                style={{
                  width: '100%',
                  marginBottom: 5,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                <View
                  style={{
                    width: '45%',
                  }}>
                  <Text>Команда</Text>
                </View>
                <View
                  style={{
                    width: '55%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{
                      width: '15%',
                    }}>
                    И
                  </Text>
                  <Text
                    style={{
                      width: '15%',
                    }}>
                    В
                  </Text>
                  <Text
                    style={{
                      width: '15%',
                    }}>
                    Н
                  </Text>
                  <Text
                    style={{
                      width: '15%',
                    }}>
                    П
                  </Text>
                  <View
                    style={{
                      width: '40%',
                      alignItems: 'flex-end',
                      alignSelf: 'flex-end',
                    }}>
                    <Text>О</Text>
                  </View>
                </View>
              </View>
              <ScrollView>
                {tableList.tableRows.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.showApplication.bind(this, item.team)}>
                    <View
                      style={{
                        width: '100%',
                        marginBottom: 5,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}>
                      <View
                        style={{
                          width: '45%',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            width: '60%',
                            margin: 10,
                          }}>
                          {item.team.full_name}
                        </Text>
                        <Image
                          style={styles.teamLogo}
                          source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                          }}
                        />
                      </View>
                      <View
                        style={{
                          width: '55%',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        <Text
                          style={{
                            width: '15%',
                          }}>
                          {item.games}
                        </Text>
                        <Text
                          style={{
                            width: '15%',
                          }}>
                          {item.wins}
                        </Text>
                        <Text
                          style={{
                            width: '15%',
                          }}>
                          {item.draws}
                        </Text>
                        <Text
                          style={{
                            width: '15%',
                          }}>
                          {item.loses}
                        </Text>
                        <View
                          style={{
                            width: '40%',
                            alignItems: 'flex-end',
                            alignSelf: 'flex-end',
                          }}>
                          <Text>
                            {item.ga}.{' - '}.{item.gf}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                display: this.state.focusedTab === 2 ? null : 'none',
                overflow: 'hidden',
              }}>
              <View
                style={{
                  marginBottom: 20,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.rosterHandler.bind(this, 0)}>
                  <Text>{'rosterList.team1.team_id'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.rosterHandler.bind(this, 1)}>
                  <Text>{'rosterList.team2.team_id'}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: this.state.focusedRoster === 0 ? null : 'none',
                  overflow: 'hidden',
                }}>
                <ScrollView>
                  {rosterList.team1.map((item) => (
                    <Text>
                      {item.position}.{item.name}.{'     rost          '}
                    </Text>
                  ))}
                </ScrollView>
              </View>
              <View
                style={{
                  display: this.state.focusedRoster === 1 ? null : 'none',
                  overflow: 'hidden',
                }}>
                <ScrollView>
                  {rosterList.team2.map((item) => (
                    <Text>
                      {item.position}.{item.name}.{'     rost          '}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                display: this.state.focusedTab === 3 ? null : 'none',
                overflow: 'hidden',
              }}>
              <ScrollView>
                {tableList.tableRows.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.showApplication.bind(this, item.team)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={styles.teamLogo}
                        source={{
                          uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }}
                      />
                      <Text>{item.team.full_name}</Text>
                    </View>
                    <View
                      style={{
                        display:
                          this.context.teamId === item.team.team_id
                            ? null
                            : 'none',
                        overflow: 'hidden',
                      }}>
                      {PLAYERS}
                    </View>
                  </TouchableOpacity>
                ))}
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
TableScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'flex-start',
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
    padding: 10,
  },
  titleText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 200,
    fontWeight: 'bold',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },
  logo: {
    width: 100,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  teamLogo: {
    width: 25,
    height: 25,
    borderRadius: 100,
    margin: 5,
  },
});
