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
var PLAYERS = <Text>{''}</Text>;

export default class TableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: '0',
      focusedRoster: '0',
      matchList: 'empty',
      tableList: 'empty',
      players: 'empty',
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

  tabsHandler = (page) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: page,
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
        console.log(value.application.players);
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
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.touchItem}
              onPress={this.showApplication.bind(this, team, 1)}>
              <Text>{'        Заявленные          '}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.touchItem}
              onPress={this.showApplication.bind(this, team, 0)}>
              <Text>{'        Отзаявленные          '}</Text>
            </TouchableOpacity>

            {players.approved.map((player) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchItem}
                onPress={this.teamRedirect.bind(this, team)}>
                <Text>
                  {player.player_id}.{'   -   '}.
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
        let disapproved = (
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.showApplication.bind(this, team, 1)}>
              <Text>{'        Заявленные          '}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.touchItem}
              onPress={this.showApplication.bind(this, team, 0)}>
              <Text>{'        Отзаявленные          '}</Text>
            </TouchableOpacity>
            {players.disapproved.map((player) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.teamRedirect.bind(this, team)}>
                <Text>
                  {player.player_id}.{'   -   '}.
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

        this.tabsHandler('3');
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
      return (
        <View style={styles.container}>
          <View style={styles.titleText}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.tabsHandler.bind(this, '0')}>
              <Text>
                {matchD.tournament.short_name}. {'\n'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 30, marginBottom: 30}}>
            <ScrollView horizontal={true} style={styles.scrollItem}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.tabsHandler.bind(this, '0')}>
                <Text>{'        Матчи         '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchItem}
                onPress={this.tabsHandler.bind(this, '1')}>
                <Text>{'        Таблица          '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.tabsHandler.bind(this, '2')}>
                <Text>{'        Статистика          '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.tabsHandler.bind(this, '3')}>
                <Text>{'        Команды          '}</Text>
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
              {matchList.map((item) => (
                <Text>
                  {item.item.team1.short_name}.{'   -   '}.
                  {item.item.team2.short_name}. {'\n'}. {item.item.start_dt}
                </Text>
              ))}
            </View>
            <View
              style={{
                display: this.state.focusedTab === '1' ? null : 'none',
                overflow: 'hidden',
              }}>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <Text>{tableList.name}</Text>
              </View>
              {tableList.tableRows.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.showApplication.bind(this, item.team)}>
                  <Text>
                    {item.team.short_name}.{item.team.logo}.{'\n'}.{item.games}.
                    {item.wins}.{item.draws}.{item.loses}.{item.ga}.{' - '}.
                    {item.gf}
                  </Text>
                </TouchableOpacity>
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

            <View
              style={{
                display: this.state.focusedTab === '3' ? null : 'none',
                overflow: 'hidden',
              }}>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                }}>
                <Text>{tableList.name}</Text>
              </View>
              {tableList.tableRows.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.showApplication.bind(this, item.team)}>
                  <Text>
                    {item.team.logo}.{item.team.short_name}
                  </Text>
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
TableScreen.contextType = FriendsContext;

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
  titleText: {
    marginTop: 50,
    fontSize: 200,
    fontWeight: 'bold',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
});
