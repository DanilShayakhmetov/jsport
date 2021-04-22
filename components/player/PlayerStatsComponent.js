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
              <Image />
              <View style={styles.playerProfile_personal}>
                <Text style={styles.playerProfile_name}> </Text>
                <Text style={styles.playerProfile_bithdate}> </Text>
              </View>
            </View>
            <Text style={styles.playerProfile_team}>asd </Text>
          </View>
          <View style={styles.playerStats_container}>
            <Text style={styles.playerStats_item}>игр </Text>
            <Text style={styles.playerStats_item}>игр </Text>
            <Text style={styles.playerStats_item}>игр </Text>
            <Text style={styles.playerStats_item}>игр </Text>
            <Text style={styles.playerStats_item}>игр </Text>
          </View>
          <View style={styles.playerSeason_container}>
            <Picker
              selectedValue={this.state.seasonId}
              style={{height: 50, width: 150}}
              onValueChange={(itemValue) => {
                this.setState({seasonId: itemValue});
              }}>
              {seasonsList.seasons.map((season) => (
                <Picker.Item label={season.title} value={season.season_id} />
              ))}
            </Picker>
            <Text style={styles.playerSeason_text}>СТАТИСТИКА</Text>
          </View>
          <View style={styles.playerTeam_container}>
            <View style={styles.playerTeam_scoreTop}>СТАТИСТИКА</View>
            <View style={styles.playerTeam_scoreTitle}>СТАТИСТИКА</View>
            <View style={styles.playerTeam_scoreBottom}>СТАТИСТИКА</View>
            <View style={styles.playerSeason_text}>СТАТИСТИКА</View>
            <View style={styles.playerSeason_text}>СТАТИСТИКА</View>
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
    // alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
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
