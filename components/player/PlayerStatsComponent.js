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
    };
  }

  async componentDidMount() {
    await handler
      .getSeasons()
      .then((value) => {
        let seasonId = value.seasons[value.seasons.length - 1].season_id;
        this.setState({
          seasonsList: value,
          seasonId: seasonId,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getPlayerStats(this.context.playerId, this.state.seasonId)
      .then((value) => {
        this.setState({
          playerStats: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let seasonsList = this.state.seasonsList;
    let playerStats = this.state.playerStats;
    if (seasonsList === undefined || playerStats === undefined) {
      return (
        <View>
          <Text>Wait</Text>
        </View>
      );
    } else {
      console.log(playerStats);
      return (
        <View style={styles.container}>
          <View style={styles.playerProfile_container}>
            <View style={styles.playerProfile_item}>
              <Image style={styles.playerProfile_photo} />
              <View style={styles.playerProfile_personal}>
                <Text style={styles.playerProfile_name}>
                  Петров Сергей Александрович
                </Text>
                <Text style={styles.playerProfile_birthdate}>
                  Дата рождения: 21.12.1234
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.playerProfile_team}>Клуб: Спартак</Text>
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
                <Text style={styles.playerStats_value_items}>1</Text>
              </View>
              <View style={styles.playerStats_item_Container}>
                <Text style={styles.playerStats_value_items}>12</Text>
              </View>
              <View style={styles.playerStats_item_Container}>
                <Text style={styles.playerStats_value_items}>5</Text>
              </View>
              <View style={styles.playerStats_item_Container}>
                <Text style={styles.playerStats_value_items}>1</Text>
              </View>
              <View style={styles.playerStats_item_Container}>
                <Text style={styles.playerStats_value_items}>1</Text>
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
                  <Text style={styles.playerTeam_row_itemText}>1</Text>
                </View>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>3</Text>
                </View>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>5</Text>
                </View>
              </View>
            </View>
            <View style={styles.playerTeam_row_scoreTitle}>
              <View style={styles.playerTeam_row_container}>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>ИГР</Text>
                </View>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>ГОЛ.</Text>
                </View>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>ПАС.</Text>
                </View>
              </View>
            </View>
            <View style={styles.playerTeam_row_team}>
              <View style={styles.playerTeam_row_teamContainer}>
                <Image style={styles.playerTeam_row_teamLogo} />
                <Text style={styles.playerTeam_row_teamName}>"СПАРТАК"</Text>
              </View>
              <View style={styles.playerTeam_row_container}>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>1</Text>
                </View>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>3</Text>
                </View>
                <View style={styles.playerTeam_row_item}>
                  <Text style={styles.playerTeam_row_itemText}>5</Text>
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
            <View style={styles.playerTeam_row_match}>
              <View style={styles.playerTeam_row_match_DataContainer}>
                <Text />
              </View>
              <View style={styles.playerTeam_row_match_ScoreContainer}>
                <View style={styles.playerTeam_row_match_ScoreItem}>
                  <Text>1</Text>
                </View>
                <View style={styles.playerTeam_row_match_ScoreItem}>
                  <Text>2</Text>
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
          </View>
        </View>
      );
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

  playerProfile_container: {
    backgroundColor: 'black',
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
    fontSize: 25,
    color: 'white',
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
    backgroundColor: 'black',
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
    fontSize: 15,
    color: 'blue',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  playerStats_value_items: {
    alignItems: 'center',
    fontSize: 15,
    color: 'black',
    fontFamily: 'OpenSans',
  },

  playerSeason_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: 'blue',
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
    backgroundColor: 'gray',
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
    backgroundColor: 'yellow',
    height: '50%',
  },

  playerTeam_row_score: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    backgroundColor: 'green',
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
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '100%',
  },
  playerTeam_row_itemText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  playerTeam_row_scoreTitle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'black',
    height: '10%',
    width: '100%',
    justifyContent: 'flex-end',
  },

  playerTeam_row_team: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'gray',
    height: '20%',
    width: '100%',
    alignItems: 'center',
  },

  playerTeam_row_teamContainer: {
    backgroundColor: 'blue',
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
    fontSize: 15,
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
    backgroundColor: 'blue',
  },

  playerTeam_row_tournamentName: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    marginLeft: '5%',
  },

  playerTeam_row_match: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'aqua',
    height: '20%',
    width: '100%',
  },

  playerTeam_row_match_DataContainer: {
    backgroundColor: '#FF1493',
    width: '60%',
    height: '100%',
  },

  playerTeam_row_match_ScoreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'pink',
    justifyContent: 'flex-end',
    width: '40%',
    height: '100%',
  },

  playerTeam_row_match_ScoreItem: {
    backgroundColor: 'purple',
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
