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

const handler = Handler;

export default class TeamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: 'empty',
      rosterList: 'empty',
      focusedTab: 0,
    };
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      title: this.context.tournamentData.Data.full_name,
    });
    await handler
      .getTeamMatch(this.context.teamData.team_id)
      .then((value) => {
        console.log(value.calendar.data);
        this.setState({
          matchList: value.calendar.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getTeamRoster(this.context.teamData.team_id)
      .then((value) => {
        this.setState({
          rosterList: value.team.players,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  tabsHandler = (tab) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: tab,
    });
  };

  playerStatsRedirect = (playerId) => {
    this.context.playerId = playerId;
    return this.props.navigation.navigate('PlayerStats');
  };

  render() {
    const matchList = this.state.matchList;
    const rosterList = this.state.rosterList;
    const team = this.context.teamData;
    if (
      this.state.matchList === 'empty' ||
      this.state.matchList === undefined ||
      this.state.rosterList === 'empty' ||
      this.state.rosterList === undefined
    ) {
      return (
        <View>
          <Text>Wait</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.tabsHandler.bind(this, 0)}
              style={styles.titleText}>
              <Image
                style={styles.logo}
                source={{
                  uri: handler.getTeamImageURI(team.team_id, team.logo),
                }}
              />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 22,
                  color: '#606070',
                  fontFamily: 'OpenSans',
                  fontWeight: 'bold',
                }}>
                {team.full_name}
              </Text>
            </TouchableOpacity>
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
            <View style={{width: '15%'}} />
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
                {'Состав'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.mainDataContainer}>
              <View
                style={{
                  display: this.state.focusedTab === 0 ? null : 'none',
                  overflow: 'hidden',
                }}>
                {matchList.map((match) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      margin: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginRight: 20,
                      }}>
                      <Image
                        style={styles.teamLogo}
                        source={{
                          uri: handler.getTeamImageURI(
                            match.team1.team_id,
                            match.team1.logo,
                          ),
                        }}
                      />
                      <Image
                        style={styles.teamLogo}
                        source={{
                          uri: handler.getTeamImageURI(
                            match.team2.team_id,
                            match.team2.logo,
                          ),
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#606070',
                          fontFamily: 'OpenSans',
                          fontWeight: 'bold',
                        }}>
                        {match.team1.full_name}
                        {'   -   '}
                        {match.team2.full_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'gray',
                          fontFamily: 'OpenSans',
                        }}>
                        {handler.getFormedDate(match.start_dt)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <View
                style={{
                  display: this.state.focusedTab === 1 ? null : 'none',
                  overflow: 'hidden',
                }}>
                {rosterList.map((player) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      margin: 10,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={this.playerStatsRedirect.bind(
                        this,
                        player.player_id,
                      )}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginRight: 20,
                        }}>
                        <Image
                          style={styles.playerLogo}
                          source={{
                            uri: handler.getPlayerImageURI(
                              player.player_id,
                              player.photo,
                            ),
                          }}
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: '#606070',
                            fontFamily: 'OpenSans',
                          }}>
                          {player.last_name}
                          {player.first_name}
                          {player.middle_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'gray',
                            fontFamily: 'OpenSans',
                          }}>
                          {player.start_dt}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              width: 432,
              height: 40,
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
                <Icon name="football-outline" size={30} color="#517fa4" />
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
                <Icon name="trophy-outline" size={30} color="#517fa4" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate('TeamList')}
                style={{
                  width: 144,
                  color: 'gray',
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
TeamScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
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
    marginBottom: '5%',
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
    marginBottom: 25,
    fontSize: 200,
    fontWeight: 'bold',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  teamLogo: {
    width: 25,
    height: 25,
    borderRadius: 100,
    marginLeft: -5,
  },
  playerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
