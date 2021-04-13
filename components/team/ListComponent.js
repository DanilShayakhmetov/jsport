import React, {Component, useState} from 'react';
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
import {Icon} from 'react-native-elements';

const handler = Handler;

export default class TeamListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasonsList: 'empty',
      seasonId: 'empty',
      teamsList: 'empty',
    };
  }

  async componentDidMount() {
    await handler
      .getSeasons()
      .then((value) => {
        let seasonId = parseInt(
          value.seasons[value.seasons.length - 1].season_id,
        );
        console.log(seasonId);
        this.setState({
          seasonsList: value,
          seasonId: seasonId,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getTeamList(this.state.seasonId)
      .then((value) => {
        console.log(value);
        this.setState({
          teamsList: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let teamList = this.state.teamsList;
    let seasonsList = this.state.seasonsList;
    // console.log(teamList.teams);
    if (
      teamList === 'empty' ||
      teamList === undefined ||
      seasonsList === 'empty' ||
      seasonsList === undefined
    ) {
      return (
        <View>
          <Text>Wait</Text>
        </View>
      );
    } else {
      console.log(teamList.teams.data);
      return (
        <View style={styles.container}>
          <Picker
            selectedValue={this.state.seasonId}
            style={{height: 50, width: 150}}
            onValueChange={(itemValue) => {
              this.setState({seasonId: parseInt(itemValue)});
              handler
                .getTeamList(this.state.seasonId)
                .then((value) => {
                  console.log(value);
                  this.setState({
                    teamsList: value,
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
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginLeft: 10,
            }}>
            {teamList.teams.data.map((team) => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.logo}
                  source={{
                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                  }}
                />
                <Text style={{marginLeft: 10}}>{team.full_name}</Text>
                {/*<Text>*/}
                {/*  {team.logo}.{'   -   '}.{team.full_name}*/}
                {/*</Text>*/}
              </View>
            ))}
          </ScrollView>
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
TeamListScreen.contextType = JoinAppContext;

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
    width: 25,
    height: 25,
    borderRadius: 100,
    margin: 5,
  },
});
