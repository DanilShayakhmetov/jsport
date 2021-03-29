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
var TEAM_LIST = 'empty';

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
    console.log(teamList.teams);
    if (
      teamList === 'empty' ||
      teamList === undefined ||
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
      return (
        <View style={styles.container}>
          <Picker
            selectedValue={this.state.seasonId}
            style={{height: 50, width: 150}}
            onValueChange={(itemValue) => {
              this.setState({seasonId: itemValue});
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
          <ScrollView>
            {teamList.teams.data.map((team) => (
              <Text>
                {team.logo}.{'   -   '}.{team.short_name}
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
TeamListScreen.contextType = JoinAppContext;

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
