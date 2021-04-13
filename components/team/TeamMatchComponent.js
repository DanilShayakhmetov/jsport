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
    await handler
      .getTeamMatch(this.context.teamData.team_id)
      .then((value) => {
        console.log(value);
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
      console.log(rosterList);
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
                  uri: 'https://reactnative.dev/img/tiny_logo.png',
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
                {team.short_name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 30, marginBottom: 30}}>
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
                <Text>{'        Состав          '}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <ScrollView>
            <View style={styles.mainDataContainer}>
              <View
                style={{
                  display: this.state.focusedTab === 0 ? null : 'none',
                  overflow: 'hidden',
                }}>
                {matchList.map((item) => (
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
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#606070',
                          fontFamily: 'OpenSans',
                          fontWeight: 'bold',
                        }}>
                        {item.team1.short_name}
                        {'   -   '}
                        {item.team2.short_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'gray',
                          fontFamily: 'OpenSans',
                        }}>
                        {item.start_dt}
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
                {rosterList.map((item) => (
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
                        style={styles.playerLogo}
                        source={{
                          uri: 'https://reactnative.dev/img/tiny_logo.png',
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
                        {item.last_name}
                        {item.first_name}
                        {item.middle_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'gray',
                          fontFamily: 'OpenSans',
                        }}>
                        {item.start_dt}
                      </Text>
                    </View>
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
