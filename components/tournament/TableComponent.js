import React, {Component} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  numberOfLines,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';
import Icon from 'react-native-vector-icons/Ionicons';
import cover from '../../assets/images/football_cover_cover.jpg';

const handler = Handler;
const COVER = Image.resolveAssetSource(cover).uri;
var PLAYERS = <Text>{''}</Text>;

export default class TableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: 0,
      focusedRoster: 0,
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
    const tournament_id = this.context.matchData._W.tournament_id;
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

    await handler
      .getTournamentStats(tournament_id)
      .then((value) => {
        this.setState({
          tournamentStats: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getTournamentItem(tournament_id)
      .then((value) => {
        this.setState({
          tournamentItem: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(this.state.tournamentItem);
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
              if (substitution.player_out === player.player_id) {
                playerItem.sub = {
                  player_in_id: substitution.player_in,
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
              <Text
                style={{
                  borderRadius: 5,
                  backgroundColor: 'lightgray',
                }}>
                {'        Заявленные          '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 0)}
              style={{margin: 5}}>
              <Text style={{borderRadius: 5}}>
                {'        Отзаявленные          '}
              </Text>
            </TouchableOpacity>

            {players.approved.map((player) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.teamRedirect.bind(this, team)}
                style={{
                  width: '100%',
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
                    uri: handler.getPlayerImageURI(
                      player.player.player_id,
                      player.player.photo,
                    ),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 14,
                    width: '75%',
                    margin: 10,
                  }}>
                  {player.player.last_name} {player.player.first_name}{' '}
                  {player.player.middle_name}
                </Text>
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
              <Text
                style={{
                  borderRadius: 5,
                  backgroundColor: '#fff',
                }}>
                {'        Заявленные          '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 0)}
              style={{margin: 5}}>
              <Text
                style={{
                  borderRadius: 5,
                  backgroundColor: 'lightgray',
                }}>
                {'        Отзаявленные          '}
              </Text>
            </TouchableOpacity>

            {players.disapproved.map((player) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.teamRedirect.bind(this, team)}
                style={{
                  width: '100%',
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
                    uri: handler.getPlayerImageURI(
                      player.player.player_id,
                      player.player.photo,
                    ),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 14,
                    width: '75%',
                    margin: 10,
                  }}>
                  {player.player.last_name} {player.player.first_name}{' '}
                  {player.player.middle_name}
                </Text>
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
    const statsList = this.state.tournamentStats;
    if (
      tableList === undefined ||
      matchList === undefined ||
      statsList === undefined ||
      matchD === null
    ) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator />
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    } else {
      let rosterList = this.rosterPreparer(matchD);
      this.state.rosterList = rosterList;
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
                  uri: COVER,
                }}
              />
              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.tabsHandler.bind(this, 0)}>
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {matchD.tournament.short_name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
                {'Матчи'}
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
                {'Таблица'}
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
                {'Статистика'}
              </Text>
            </TouchableOpacity>
            <View style={{width: '5%'}} />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.tabsHandler.bind(this, 3)}>
              <Text
                style={[
                  styles.tabsItem,
                  this.state.focusedTab === 3
                    ? styles.tabsItem_chosen
                    : styles.tabsItem_default,
                ]}>
                {'Команды'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tableList_name}>
            <Text style={styles.tableList_nameText}>{tableList.name}</Text>
          </View>
          <View style={styles.mainDataContainer}>
            <View
              style={{
                display: this.state.focusedTab === 0 ? null : 'none',
                overflow: 'hidden',
                height: '130%',
              }}>
              <ScrollView style={{flex: 1}}>
                {matchList.map((match) => (
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
                          uri: handler.getTeamImageURI(
                            match.item.team1.team_id,
                            match.item.team1.logo,
                          ),
                        }}
                      />
                      <Image
                        style={styles.teamLogo}
                        source={{
                          uri: handler.getTeamImageURI(
                            match.item.team2.team_id,
                            match.item.team2.logo,
                          ),
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{fontFamily: 'OpenSans', fontSize: 16}}>
                        {match.item.team1.full_name}
                        {'   —   '}
                        {match.item.team2.full_name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 16,
                          color: '#95a5a6',
                        }}>
                        {handler.getFormedDate(match.item.start_dt)}
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
                height: '130%',
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
                  <Text style={{fontFamily: 'OpenSans', fontSize: 16}}>
                    Команда
                  </Text>
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
                      fontFamily: 'OpenSans',
                      fontSize: 16,
                    }}>
                    И
                  </Text>
                  <Text
                    style={{
                      width: '15%',
                      fontFamily: 'OpenSans',
                      fontSize: 16,
                    }}>
                    В
                  </Text>
                  <Text
                    style={{
                      width: '15%',
                      fontFamily: 'OpenSans',
                      fontSize: 16,
                    }}>
                    Н
                  </Text>
                  <Text
                    style={{
                      width: '15%',
                      fontFamily: 'OpenSans',
                      fontSize: 16,
                    }}>
                    П
                  </Text>
                  <View
                    style={{
                      width: '40%',
                      alignItems: 'flex-end',
                      alignSelf: 'flex-end',
                    }}>
                    <Text
                      style={{
                        width: '15%',
                        fontFamily: 'OpenSans',
                        fontSize: 16,
                      }}>
                      О
                    </Text>
                  </View>
                </View>
              </View>
              <ScrollView style={{flex: 1}}>
                {tableList.tableRows.map((item, number) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.showApplication.bind(this, item.team)}>
                    <View
                      style={[
                        styles.tableList_rowContainer,
                        number % 2 === 0
                          ? styles.tableList_rowContainerEven
                          : styles.tableList_rowContainer,
                      ]}>
                      <View
                        style={{
                          width: '45%',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={styles.teamLogo}
                          source={{
                            uri: handler.getTeamImageURI(
                              item.team.team_id,
                              item.team.logo,
                            ),
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: 'OpenSans',
                            fontSize: 14,
                            width: '60%',
                            margin: 10,
                          }}>
                          {item.team.full_name}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '55%',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'OpenSans',
                            fontSize: 14,
                            width: '15%',
                          }}>
                          {item.games}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'OpenSans',
                            fontSize: 14,
                            width: '15%',
                          }}>
                          {item.wins}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'OpenSans',
                            fontSize: 14,
                            width: '15%',
                          }}>
                          {item.draws}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'OpenSans',
                            fontSize: 14,
                            width: '15%',
                          }}>
                          {item.losses}
                        </Text>
                        <View
                          style={{
                            width: '40%',
                            alignItems: 'flex-end',
                            alignSelf: 'flex-end',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'OpenSans',
                              fontSize: 14,
                            }}>
                            {item.points}
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
                height: '130%',
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
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    width: '35%',
                  }}>
                  Игрок
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    width: '35%',
                  }}>
                  Команда
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    width: '5%',
                  }}>
                  И
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    width: '5%',
                  }}>
                  Г
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    width: '10%',
                  }}>
                  ЖК
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 16,
                    width: '10%',
                  }}>
                  КК
                </Text>
              </View>
              <ScrollView style={{flex: 1}}>
                {statsList.map((row, number) => (
                  <View
                    style={[
                      styles.statsList_rowContainer,
                      number % 2 === 0
                        ? styles.statsList_rowContainerEven
                        : styles.statsList_rowContainer,
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '35%',
                      }}>
                      <Image
                        style={styles.logoMini}
                        source={{
                          uri: handler.getPlayerImageURI(
                            row.player.player_id,
                            row.player.photo,
                          ),
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 14,
                          width: '60%',
                          margin: 10,
                        }}>
                        {row.player.first_name} {row.player.last_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '35%',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}>
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
                        numberOfLines={1}
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 14,
                          width: '60%',
                          margin: 10,
                        }}>
                        {row.team.full_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '5%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 14,
                        }}>
                        {row.games}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '5%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 14,
                        }}>
                        {row.goals}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '10%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 14,
                        }}>
                        {row.yellow_cards}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '10%',
                        height: '100%',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 14,
                        }}>
                        {row.red_cards}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                display: this.state.focusedTab === 3 ? null : 'none',
                overflow: 'hidden',
                height: '130%',
              }}>
              <ScrollView style={{flex: 1}}>
                {tableList.tableRows.map((item) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.showApplication.bind(this, item.team)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        width: '100%',
                        margin: '2%',
                      }}>
                      <Image
                        style={styles.teamListLogo}
                        source={{
                          uri: handler.getTeamImageURI(
                            item.team.team_id,
                            item.team.logo,
                          ),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 18,
                          color: 'black',
                          fontWeight: 'bold',
                          width: '80%',
                        }}>
                        {item.team.full_name}
                      </Text>
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
              width: '110%',
              height: 40,
              margin: -5,
              alignSelf: 'center',
              backgroundColor: 'white',
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
TableScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  horizontal: {
    justifyContent: 'center',
    flexDirection: 'row',
    padding: -50,
  },
  containerTop: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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

  tableList_name: {
    height: 30,
    marginBottom: '5%',
    marginTop: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'OpenSans',
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: 'lightgray',
    padding: '1%',
  },
  tableList_nameText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
  },
  scrollItem: {
    flex: 1,
    height: 10,
  },
  mainDataContainer: {
    flex: 1,
    marginBottom: 100,
    padding: 10,
    height: '100%',
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
  tableList_rowContainer: {
    width: '100%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%',
  },

  tableList_rowContainerEven: {
    width: '100%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%',
  },

  statsList_rowContainer: {
    width: '100%',
    height: '2%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%',
  },

  statsList_rowContainerEven: {
    width: '100%',
    height: '2%',
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  logo: {
    width: 100,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  logoMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 2,
  },
  teamLogo: {
    width: 25,
    height: 25,
    borderRadius: 100,
    marginRight: 5,
  },
  teamListLogo: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 5,
  },
});
