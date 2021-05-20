import React, {Component} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  Image,
  ActivityIndicator,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';
import Icon from 'react-native-vector-icons/Ionicons';

const handler = Handler;
const regex = /(<([^>]+)>)/gi;

export default class PlayerStatsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasonsList: undefined,
      seasonId: undefined,
      playerStats: undefined,
      playerSeasonStats: undefined,
      playerMatch: undefined,
      from: undefined,
      to: undefined,
    };
  }

  async componentDidMount() {
    await handler
      .getSeasons()
      .then((value) => {
        let seasonId = value.seasons[value.seasons.length - 1].season_id;
        let from = value.seasons[value.seasons.length - 1].start_dt;
        let to = value.seasons[value.seasons.length - 1].end_dt;
        this.setState({
          seasonsList: value,
          seasonId: seasonId,
          from: from,
          to: to,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getPlayerStats(this.context.playerId)
      .then((value) => {
        this.setState({
          playerStats: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getPlayerSeasonStats(this.context.playerId, this.state.seasonId)
      .then((value) => {
        this.setState({
          playerSeasonStats: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(this.state.from, this.state.to);
    await handler
      .getPlayerMatch(this.context.teamId, this.state.from, this.state.to)
      .then((value) => {
        this.setState({
          playerMatch: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let seasonsList = this.state.seasonsList;
    let playerStats = this.state.playerStats;
    let playerSeasonStats = this.state.playerSeasonStats;
    let playerMatch = this.state.playerMatch;
    if (
      seasonsList === undefined ||
      playerStats === undefined ||
      playerSeasonStats === undefined ||
      playerMatch === undefined
    ) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator />
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    } else {
      console.log(playerMatch.length);
      let player = playerStats[0];
      let playerSeason = playerSeasonStats[0];
      if (playerSeason === undefined) {
        return (
          <View style={styles.container}>
            <View style={styles.playerProfile_container}>
              <View style={styles.playerProfile_item}>
                <Image
                  style={styles.playerProfile_photo}
                  source={{
                    uri: handler.getPlayerImageURI(
                      player.player.player_id,
                      player.player.photo,
                    ),
                  }}
                />
                <View style={styles.playerProfile_personal}>
                  <Text style={styles.playerProfile_name}>
                    {player.player.last_name} {player.player.first_name}{' '}
                    {player.player.middle_name}
                  </Text>
                  <Text style={styles.playerProfile_birthdate}>
                    Дата рождения: {player.player.birthday}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.playerProfile_team}>
              Клуб: {player.team.full_name}
            </Text>
            <View style={styles.playerStats_container}>
              <View style={styles.playerStats_item}>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>игр</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>голы</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>передачи</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>жк</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>кк</Text>
                </View>
              </View>
              <View style={styles.playerStats_item}>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.games}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.goals}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.assists}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.yellow_cards}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.red_cards}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.playerSeason_container}>
              <View style={styles.playerSeason_textContainer}>
                <Text style={styles.playerSeason_text}>СТАТИСТИКА</Text>
              </View>
              <Picker
                selectedValue={this.state.seasonId}
                style={styles.playerSeason_picker}
                onValueChange={(itemValue) => {
                  this.setState({seasonId: itemValue});
                  handler
                    .getPlayerSeasonStats(
                      this.context.playerId,
                      this.state.seasonId,
                    )
                    .then((value) => {
                      this.setState({
                        playerSeasonStats: value,
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}>
                {seasonsList.seasons.map((season) => (
                  <Picker.Item label={season.title} value={season.season_id} />
                ))}
              </Picker>
            </View>
            <View style={styles.playerTeam_container}>
              <View style={styles.playerTeam_row_score}>
                <View style={styles.playerTeam_row_container}>
                  <View style={styles.playerTeam_row_item}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {'-'}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_item}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {'-'}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_item}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {'-'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.playerTeam_row_scoreTitle}>
                <View style={styles.playerTeam_row_container}>
                  <View style={styles.playerTeam_row_itemTitle}>
                    <Text style={styles.playerTeam_row_itemText}>ИГР</Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTitle}>
                    <Text style={styles.playerTeam_row_itemText}>ГОЛ.</Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTitle}>
                    <Text style={styles.playerTeam_row_itemText}>ПАС.</Text>
                  </View>
                </View>
              </View>
              <View style={styles.playerTeam_row_team}>
                <View style={styles.playerTeam_row_teamContainer}>
                  <Image
                    style={styles.playerTeam_row_teamLogo}
                    source={{
                      uri: handler.getTeamImageURI(
                        player.team.team_id,
                        player.team.logo,
                      ),
                    }}
                  />
                  <Text style={styles.playerTeam_row_teamName}>
                    {player.team.full_name}
                  </Text>
                </View>
                <View style={styles.playerTeam_row_container}>
                  <View style={styles.playerTeam_row_itemTeam}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {'-'}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTeam}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {'-'}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTeam}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {'-'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.playerTeam_row_tournament}>
                <View style={styles.playerTeam_row_tournamentContainer}>
                  <Text style={styles.playerTeam_row_tournamentName}>
                    Название турнира
                  </Text>
                </View>
              </View>
              <View style={{height: '35%'}}>
                <ScrollView style={{flex: 1}}>
                  {playerMatch.map((match) => (
                    <View style={styles.playerTeam_row_match}>
                      <View style={styles.playerTeam_row_match_dataContainer}>
                        <View style={styles.playerTeam_row_match_dataItem}>
                          <View style={styles.playerTeam_row_match_team1}>
                            <Text
                              numberOfLines={1}
                              style={styles.playerTeam_row_text}>
                              {'-'}
                            </Text>
                          </View>
                          <View style={styles.playerTeam_row_match_score}>
                            <Text style={styles.playerTeam_row_text}>
                              {'-'}
                              {' : '}
                              {'-'}
                            </Text>
                          </View>
                          <View style={styles.playerTeam_row_match_team2}>
                            <Text
                              numberOfLines={1}
                              style={styles.playerTeam_row_text}>
                              {'-'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.playerTeam_row_match_date}>
                          <Text>                      {'-'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.playerTeam_row_match_scoreContainer}>
                        <View style={styles.playerTeam_row_match_scoreItem}>
                          <Text style={styles.playerTeam_row_text}>0</Text>
                        </View>
                        <View style={styles.playerTeam_row_match_scoreItem}>
                          <Text style={styles.playerTeam_row_text}>0</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 40,
                alignSelf: 'center',
                // alignItems: 'flex-end',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 10,
                  marginBottom: -20,
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
                  onPress={() =>
                    this.props.navigation.navigate('TournamentList')
                  }
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
      } else {
        return (
          <View style={styles.container}>
            <View style={styles.playerProfile_container}>
              <View style={styles.playerProfile_item}>
                <Image
                  style={styles.playerProfile_photo}
                  source={{
                    uri: handler.getPlayerImageURI(
                      player.player.player_id,
                      player.player.photo,
                    ),
                  }}
                />
                <View style={styles.playerProfile_personal}>
                  <Text style={styles.playerProfile_name}>
                    {player.player.last_name} {player.player.first_name}{' '}
                    {player.player.middle_name}
                  </Text>
                  <Text style={styles.playerProfile_birthdate}>
                    Дата рождения: {player.player.birthday}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.playerProfile_team}>
              Клуб: {player.team.full_name}
            </Text>
            <View style={styles.playerStats_container}>
              <View style={styles.playerStats_item}>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>игр</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>голы</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>передачи</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>жк</Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_title_items}>кк</Text>
                </View>
              </View>
              <View style={styles.playerStats_item}>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.games}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.goals}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.assists}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.yellow_cards}
                  </Text>
                </View>
                <View style={styles.playerStats_item_Container}>
                  <Text style={styles.playerStats_value_items}>
                    {player.red_cards}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.playerSeason_container}>
              <View style={styles.playerSeason_textContainer}>
                <Text style={styles.playerSeason_text}>СТАТИСТИКА</Text>
              </View>
              <Picker
                selectedValue={this.state.seasonId}
                style={styles.playerSeason_picker}
                onValueChange={(itemValue) => {
                  this.setState({seasonId: itemValue});
                  handler
                    .getPlayerSeasonStats(
                      this.context.playerId,
                      this.state.seasonId,
                    )
                    .then((value) => {
                      this.setState({
                        playerSeasonStats: value,
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}>
                {seasonsList.seasons.map((season) => (
                  <Picker.Item label={season.title} value={season.season_id} />
                ))}
              </Picker>
            </View>
            <View style={styles.playerTeam_container}>
              <View style={styles.playerTeam_row_score}>
                <View style={styles.playerTeam_row_container}>
                  <View style={styles.playerTeam_row_item}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {playerSeason.games}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_item}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {playerSeason.goals}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_item}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {playerSeason.assists}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.playerTeam_row_scoreTitle}>
                <View style={styles.playerTeam_row_container}>
                  <View style={styles.playerTeam_row_itemTitle}>
                    <Text style={styles.playerTeam_row_itemText}>ИГР</Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTitle}>
                    <Text style={styles.playerTeam_row_itemText}>ГОЛ.</Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTitle}>
                    <Text style={styles.playerTeam_row_itemText}>ПАС.</Text>
                  </View>
                </View>
              </View>
              <View style={styles.playerTeam_row_team}>
                <View style={styles.playerTeam_row_teamContainer}>
                  <Image
                    style={styles.playerTeam_row_teamLogo}
                    source={{
                      uri: handler.getTeamImageURI(
                        player.team.team_id,
                        player.team.logo,
                      ),
                    }}
                  />
                  <Text style={styles.playerTeam_row_teamName}>
                    {player.team.full_name}
                  </Text>
                </View>
                <View style={styles.playerTeam_row_container}>
                  <View style={styles.playerTeam_row_itemTeam}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {playerSeason.games}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTeam}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {playerSeason.goals}
                    </Text>
                  </View>
                  <View style={styles.playerTeam_row_itemTeam}>
                    <Text style={styles.playerTeam_row_itemText}>
                      {playerSeason.assists}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.playerTeam_row_tournament}>
                <View style={styles.playerTeam_row_tournamentContainer}>
                  <Text style={styles.playerTeam_row_tournamentName}>
                    Название турнира
                  </Text>
                </View>
              </View>
              <View style={{height: '35%'}}>
                <ScrollView style={{flex: 1}}>
                  {playerMatch.map((match) => (
                    <View style={styles.playerTeam_row_match}>
                      <View style={styles.playerTeam_row_match_dataContainer}>
                        <View style={styles.playerTeam_row_match_dataItem}>
                          <View style={styles.playerTeam_row_match_team1}>
                            <Text
                              numberOfLines={1}
                              style={styles.playerTeam_row_text}>
                              {match.team1.full_name}
                            </Text>
                          </View>
                          <View style={styles.playerTeam_row_match_score}>
                            <Text style={styles.playerTeam_row_text}>
                              {match.ga}
                              {' : '}
                              {match.gf}
                            </Text>
                          </View>
                          <View style={styles.playerTeam_row_match_team2}>
                            <Text
                              numberOfLines={1}
                              style={styles.playerTeam_row_text}>
                              {match.team2.full_name}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.playerTeam_row_match_date}>
                          <Text>{handler.getFormedDate(match.start_dt)}</Text>
                        </View>
                      </View>
                      <View style={styles.playerTeam_row_match_scoreContainer}>
                        <View style={styles.playerTeam_row_match_scoreItem}>
                          <Text style={styles.playerTeam_row_text}>0</Text>
                        </View>
                        <View style={styles.playerTeam_row_match_scoreItem}>
                          <Text style={styles.playerTeam_row_text}>0</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 40,
                alignSelf: 'center',
                marginTop: 20,
                // alignItems: 'flex-end',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 10,
                  marginBottom: -20,
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
                  onPress={() =>
                    this.props.navigation.navigate('TournamentList')
                  }
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
}
PlayerStatsScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  playerProfile_container: {
    backgroundColor: 'lightgray',
    height: '20%',
    justifyContent: 'center',
  },

  playerProfile_item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '5%',
  },

  playerProfile_photo: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: 'red',
  },

  playerProfile_personal: {
    width: '60%',
    margin: 5,
    marginLeft: '5%',
  },

  playerProfile_name: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'OpenSans',
  },

  playerProfile_birthdate: {
    fontSize: 15,
    color: 'gray',
    fontFamily: 'OpenSans',
    marginTop: '5%',
  },

  playerProfile_team: {
    fontSize: 15,
    color: 'gray',
    fontFamily: 'OpenSans',
    paddingLeft: '5%',
    backgroundColor: 'lightgray',
    alignItems: 'center',
    height: '5%',
  },

  playerStats_container: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerStats_item: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerStats_value: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerStats_item_Container: {
    alignItems: 'center',
    width: '20%',
  },
  playerStats_title_items: {
    alignItems: 'center',
    fontSize: 17,
    color: 'black',
    fontFamily: 'OpenSans',
  },

  playerStats_value_items: {
    alignItems: 'center',
    fontSize: 17,
    color: 'blue',
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },

  playerSeason_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    height: '5%',
  },

  playerSeason_text: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'OpenSans',
    marginLeft: '5%',
  },
  playerSeason_textContainer: {
    width: '40%',
    height: '100%',
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  playerSeason_picker: {
    width: '60%',
    height: '100%',
  },

  playerTeam_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'yellow',
    height: '50%',
  },

  playerTeam_row_score: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    backgroundColor: '#3498db',
    height: '20%',
    width: '100%',
  },

  playerTeam_row_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '40%',
    height: '100%',
  },
  playerTeam_row_item: {
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '100%',
  },
  playerTeam_row_itemTitle: {
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '100%',
  },
  playerTeam_row_itemTeam: {
    backgroundColor: '#85B1FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '100%',
  },
  playerTeam_row_itemText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  playerTeam_row_scoreTitle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'lightgray',
    height: '10%',
    width: '100%',
    justifyContent: 'flex-end',
  },

  playerTeam_row_team: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#85B1FF',
    height: '20%',
    width: '100%',
    alignItems: 'center',
  },

  playerTeam_row_teamContainer: {
    backgroundColor: '#85B1FF',
    width: '60%',
    height: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  playerTeam_row_teamItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '50%',
  },

  playerTeam_row_teamLogo: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: 'white',
    margin: '5%',
  },

  playerTeam_row_teamName: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  playerTeam_row_tournament: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerTeam_row_tournamentContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#B9D5D7',
  },

  playerTeam_row_tournamentName: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    marginLeft: '5%',
  },

  playerTeam_row_match: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 100,
    width: '100%',
  },

  playerTeam_row_match_dataContainer: {
    // backgroundColor: '#FF1493',
    width: '60%',
    height: '100%',
  },

  playerTeam_row_match_dataItem: {
    // backgroundColor: '#5F2093',
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  playerTeam_row_match_date: {
    // backgroundColor: '#5F9493',
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerTeam_row_match_team1: {
    // backgroundColor: '#5F2493',
    width: '42%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playerTeam_row_match_score: {
    // backgroundColor: '#971223',
    width: '16%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playerTeam_row_match_team2: {
    // backgroundColor: '#FFF223',
    width: '42%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playerTeam_row_match_scoreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'gray',
    justifyContent: 'flex-end',
    width: '40%',
    height: '100%',
  },

  playerTeam_row_match_scoreItem: {
    // backgroundColor: 'pink',
    width: '30%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: '10%',
  },
  playerTeam_row_text: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  touchItem: {
    // borderBottomColor: 'blue',
    borderBottomWidth: 2,
  },
  scrollItem: {
    flex: 1,
    height: '100%',
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  logo: {
    width: 200,
    height: 120,
    borderRadius: 20,
    margin: 5,
  },
});
