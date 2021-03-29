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

export default class TeamListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: 'empty',
      rosterList: 'empty',
      focusedTab: '0',
      chosen: 'Java',
      seasonsList: 'empty',
      teamsList: 'empty',
    };
  }

  async componentDidMount() {
    await handler
      .getSeasons()
      .then((value) => {
        this.setState({
          seasonsList: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await handler
      .getTeamList(1000777)
      .then((value) => {
        this.setState({
          teamsList: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.context.chosen}
          style={{height: 50, width: 150}}
          onValueChange={(itemValue) => this.setState({chosen: itemValue})}>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>

        {/*<Button*/}
        {/*  title="К списку матчей"*/}
        {/*  onPress={() => this.props.navigation.navigate('MatchCenter')}*/}
        {/*/>*/}
      </View>
    );
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
