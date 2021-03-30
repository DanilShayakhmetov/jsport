import React, {Component} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
import Handler from '../../graphql/handler';

const handler = Handler;

export default class TeamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchList: 'empty',
      rosterList: 'empty',
      focusedTab: '0',
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

  tabsHandler = (page) => {
    console.log(this.context.focusedTab);
    this.setState({
      focusedTab: page,
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
        <View style={styles.container}>
          <Text style={styles.topHeading}>Wait</Text>
          <Button
            title="Back to home"
            onPress={() => this.props.navigation.navigate('MatchCenter')}
          />
        </View>
      );
    } else {
      console.log(rosterList);
      return (
        <View style={styles.container}>
          <View style={styles.titleText}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.tabsHandler.bind(this, '0')}>
              <Text>
                {team.logo}.{team.short_name}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 30, marginBottom: 30}}>
            <ScrollView horizontal={true} style={styles.scrollItem}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.tabsHandler.bind(this, '0')}>
                <Text>{'        Матчи         '}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.touchItem}
                onPress={this.tabsHandler.bind(this, '1')}>
                <Text>{'        Состав          '}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.mainDataContainer}>
            <Text>{this.state.focusedTab}</Text>
            <View
              style={{
                display: this.state.focusedTab === '0' ? null : 'none',
                overflow: 'hidden',
              }}>
              {matchList.map((item) => (
                <Text>
                  {item.team1.logo}.{'  +  '}.{item.team2.logo}.{' '}
                  {item.team1.short_name}.{'   -   '}.{item.team2.short_name}.{' '}
                  {'\n'}. {item.start_dt}
                </Text>
              ))}
            </View>
            <View
              style={{
                display: this.state.focusedTab === '1' ? null : 'none',
                overflow: 'hidden',
              }}>
              <Text>1</Text>
            </View>
            {rosterList.map((item) => (
              <Text>
                {item.photo}.{item.last_name}.{item.first_name}.
                {item.middle_name}
              </Text>
            ))}
          </View>
          {/*<Button*/}
          {/*  title="К списку матчей"*/}
          {/*  onPress={() => this.props.navigation.navigate('MatchCenter')}*/}
          {/*/>*/}
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
