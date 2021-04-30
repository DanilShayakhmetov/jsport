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
  ActivityIndicator,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';
import Icon from 'react-native-vector-icons/Ionicons';
import cover from '../../assets/images/football_cover_cover.jpg';

const handler = Handler;
const COVER = Image.resolveAssetSource(cover).uri;
const regex = /(<([^>]+)>)/gi;

export default class TournamentListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seasonsList: 'empty',
      seasonId: 'empty',
      tournamentsList: 'empty',
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
      .getTournamentList(this.state.seasonId)
      .then((value) => {
        this.setState({
          tournamentsList: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let tournamentsList = this.state.tournamentsList;
    let seasonsList = this.state.seasonsList;
    console.log(tournamentsList);
    if (
      tournamentsList === 'empty' ||
      tournamentsList === undefined ||
      seasonsList === 'empty' ||
      seasonsList === undefined
    ) {
      return (
        <View style={[styles.loadingContainer, styles.horizontal]}>
          <ActivityIndicator />
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      );
    } else {
      console.log(tournamentsList.tournaments.data);
      return (
        <View style={styles.container}>
          <Text style={{marginLeft: 20}}>Выбор сезона</Text>
          <Picker
            selectedValue={this.state.seasonId}
            style={{height: 50, width: 200, marginLeft: 10}}
            onValueChange={(itemValue) => {
              this.setState({seasonId: itemValue});
              handler
                .getTournamentList(this.state.seasonId)
                .then((value) => {
                  this.setState({
                    tournamentsList: value,
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
              // alignItems: 'center',
              // justifyContent: 'center',
              // alignSelf: 'flex-start',
            }}>
            {tournamentsList.tournaments.data.map((tournament) => (
              <View
                style={{
                  marginBottom: 10,
                  // justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    marginBottom: 10,
                    // justifyContent: 'center',
                  }}>
                  <Image
                    style={styles.logo}
                    source={{
                      uri: COVER,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: '#606070',
                        fontFamily: 'OpenSans',
                        padding: '1%',
                      }}>
                      {tournament.start_dt}
                      {'   -   '}
                      {tournament.end_dt}
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        color: '#606070',
                        fontFamily: 'OpenSans',
                        padding: '1%',
                      }}>
                      Колл-во команд
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      color: '#606070',
                      fontFamily: 'OpenSans',
                      padding: '1%',
                    }}>
                    {/*{tournament.cover}.{'   -   '}.{tournament.short_name}*/}
                    {tournament.description.replace(regex, '')}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              width: '100%',
              height: 40,
              alignSelf: 'center',
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
TournamentListScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
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
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  logo: {
    width: 120,
    height: 70,
    borderRadius: 10,
    margin: 5,
  },
});
