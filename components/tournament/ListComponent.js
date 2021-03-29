import React, {Component, useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';

const handler = Handler;

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
      .getTournamentList(this.state.seasonId)
      .then((value) => {
        console.log(value);
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
        <View style={styles.container}>
          <Text>Wait</Text>
          <Button
            title="К списку матчей"
            onPress={() => this.props.navigation.navigate('MatchCenter')}
          />
        </View>
      );
    } else {
      console.log(tournamentsList.tournaments.data);
      return (
        <View style={styles.container}>
          <Picker
            selectedValue={this.state.seasonId}
            style={{height: 50, width: 150}}
            onValueChange={(itemValue) => {
              this.setState({seasonId: itemValue});
              handler
                .getTournamentList(this.state.seasonId)
                .then((value) => {
                  console.log(value);
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
          <ScrollView>
            {tournamentsList.tournaments.data.map((tournament) => (
              <Text>
                {tournament.start_dt}.{'   -   '}.{tournament.end_dt}
                {tournament.cover}.{'   -   '}.{tournament.short_name}
                {tournament.description}
              </Text>
            ))}
          </ScrollView>
          {/*<Button*/}
          {/*  title="К списку матчей"*/}
          {/*  onPress={() => this.props.navigation.navigate('MatchCenter')}*/}
          {/*/>*/}
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
