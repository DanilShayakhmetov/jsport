import React, {Component} from 'react';
import {
  Button,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';
import Icon from 'react-native-vector-icons/Ionicons';

const handler = Handler;

export default class MatchCenterScreen extends Component {
  //Main View defined under this Class
  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.changeInterval = this.changeInterval.bind(this);
    this.state = {
      focusedTab: 0,
    };
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let calendar = [];
    if (handler.isUndefined(this.context.calendar)) {
    } else {
      calendar = [...this.context.calendar];
      calendar.map((value, placeindex) =>
        value.tournamentId === index
          ? (calendar[placeindex].isExpanded = !calendar[placeindex].isExpanded)
          : (calendar[placeindex].isExpanded = true),
      );
      this.setState({
        calendar: calendar,
      });
    }
  };

  matchRedirect = (matchId, matches) => {
    this.context.matchId = matchId;
    this.context.tournamentId = matches.tournamentId;
    this.context.matchData = handler.getMatchMain(matchId);
    this.context.tournamentData = matches;
    return this.props.navigation.navigate('Match');
  };

  changeInterval = (days = 0, month = 0, tab = 0) => {
    let INTERVALS = [
      {from: [-1, 0], to: [-1, 0]},
      {from: [0, 0], to: [0, 0]},
      {from: [1, 0], to: [1, 0]},
      {from: [0, 0], to: [7, 0]},
      {from: [0, 0], to: [0, 1]},
    ];
    let to = handler.getDate(INTERVALS[tab].to[0], INTERVALS[tab].to[1]);
    let from = handler.getDate(INTERVALS[tab].from[0], INTERVALS[tab].from[1]);
    console.log(to, from);
    let calendar = [...this.context.calendar];
    calendar.forEach(function (value) {
      value.matchItems.forEach(function (match) {
        if (match.item.start_dt.split(' ')[0] >= from) {
          match.visibility = match.item.start_dt.split(' ')[0] <= to;
        } else {
          match.visibility = false;
        }
      });
    });

    this.setState({
      filteredCalendar: calendar,
      focusedTab: tab,
    });
  };

  render() {
    if (this.context.filteredCalendar === 'empty') {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator />
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    } else {
      console.log(this.state.filteredCalendar);
      return (
        <View style={styles.container}>
          <View style={styles.tabs_container}>
            <ScrollView horizontal={true}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changeInterval.bind(this, 2, 0, 0)}>
                <Text
                  style={[
                    styles.tabsItem,
                    this.state.focusedTab === 0
                      ? styles.tabsItem_chosen
                      : styles.tabsItem_default,
                  ]}>
                  {'        Вчера         '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changeInterval.bind(this, 0, 0, 1)}>
                <Text
                  style={[
                    styles.tabsItem,
                    this.state.focusedTab === 1
                      ? styles.tabsItem_chosen
                      : styles.tabsItem_default,
                  ]}>
                  {'        Сегодня         '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changeInterval.bind(this, 1, 0, 2)}>
                <Text
                  style={[
                    styles.tabsItem,
                    this.state.focusedTab === 2
                      ? styles.tabsItem_chosen
                      : styles.tabsItem_default,
                  ]}>
                  {'        Завтра          '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changeInterval.bind(this, 7, 0, 3)}>
                <Text
                  style={[
                    styles.tabsItem,
                    this.state.focusedTab === 3
                      ? styles.tabsItem_chosen
                      : styles.tabsItem_default,
                  ]}>
                  {'        Неделя          '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.changeInterval.bind(this, 0, 1, 4)}>
                <Text
                  style={[
                    styles.tabsItem,
                    this.state.focusedTab === 4
                      ? styles.tabsItem_chosen
                      : styles.tabsItem_default,
                  ]}>
                  {'        Месяц           '}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <ScrollView>
            {this.context.filteredCalendar.map((item, number) => (
              <View>
                {/*Header of the Expandable List Item*/}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.updateLayout.bind(this, item.tournamentId)}
                  style={styles.matchList_header}>
                  <Text style={styles.matchList_headerText}>
                    {item.Data.full_name}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: item.isExpanded ? 0 : null,
                    overflow: 'hidden',
                  }}>
                  {/*Content under the header of the Expandable List Item*/}
                  {item.matchItems.map((value, key) => (
                    <View
                      style={{
                        display: value.visibility ? null : 'none',
                        overflow: 'hidden',
                      }}>
                      <TouchableOpacity
                        key={key}
                        style={styles.matchItem_container}
                        onPress={() =>
                          this.matchRedirect(value.item.match_id, item)
                        }>
                        <View style={styles.matchItem_topBlock}>
                          <View style={styles.matchItem_team1}>
                            <Text numberOfLines={1} style={styles.text}>
                              {value.item.team1.full_name}
                            </Text>
                            <Image
                              style={styles.logo}
                              source={{
                                uri: handler.getTeamImageURI(
                                  value.item.team1.team_id,
                                  value.item.team1.logo,
                                ),
                              }}
                            />
                          </View>
                          <View style={styles.matchItem_score}>
                            <Text
                              style={{
                                display: value.item.ga === null ? null : 'none',
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {handler.getFormedDateShort(value.item.start_dt)}
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                color: '#606070',
                                padding: 5,
                                fontFamily: 'OpenSans',
                                display: value.item.ga !== null ? null : 'none',
                                margin: 10,
                                fontWeight: 'bold',
                              }}>
                              {value.item.ga}
                              {' : '}
                              {value.item.gf}
                            </Text>
                          </View>
                          <View style={styles.matchItem_team2}>
                            <Image
                              style={styles.logo}
                              source={{
                                uri: handler.getTeamImageURI(
                                  value.item.team2.team_id,
                                  value.item.team2.logo,
                                ),
                              }}
                            />
                            <Text numberOfLines={1} style={styles.text}>
                              {value.item.team2.full_name}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.matchItem_bottomBlock}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'OpenSans',
                              color: 'gray',
                              display:
                                item.Stadium === 'empty' ||
                                item.Stadium === null
                                  ? 'none'
                                  : null,
                              margin: 5,
                            }}>
                            {handler.getFormedDate(value.item.start_dt)}
                            {' | '}
                            {item.Stadium === null ? '-' : item.Stadium.name}
                          </Text>
                        </View>
                        <View style={styles.separator} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              width: '100%',
              height: 40,
              alignSelf: 'center',
              // paddingBottom: 10,
              marginBottom: 5,
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

MatchCenterScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'OpenSans',
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
  tabs_container: {
    height: 50,
    marginBottom: 15,
    margin: 15,
  },
  tabsItem: {
    overflow: 'hidden',
    height: 50,
    fontFamily: 'OpenSans',
    fontSize: 18,
  },
  tabsItem_default: {
    borderBottomWidth: 0,
    color: 'lightgray',
    borderBottomColor: 'lightgray',
  },
  tabsItem_chosen: {
    borderBottomWidth: 2,
    color: 'blue',
    borderBottomColor: 'blue',
  },
  matchList_header: {
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  matchList_headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  matchItem_container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: 'OpenSans',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchItem_team1: {
    width: '40%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  matchItem_team2: {
    width: '40%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  matchItem_score: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  matchItem_topBlock: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    fontFamily: 'OpenSans',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  matchItem_bottomBlock: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    fontFamily: 'OpenSans',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 18,
    color: '#606070',
    padding: 10,
    fontFamily: 'OpenSans',
    width: '70%',
    fontWeight: 'bold',
  },
  logo: {
    width: 25,
    height: 25,
    borderRadius: 100,
    margin: 5,
  },
});
