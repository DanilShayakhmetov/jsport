import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {FriendsContext} from '../../FriendsContext';
import Handler from '../../graphql/handler';

const handler = Handler;
const d = <Text>{'gggggggggggggggggggg'}</Text>;
export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTab: '',
    };
  }

  async componentDidMount() {
    await this.context.matchData
      .then((value) => {
        this.setState({
          matchData: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  eventsPage = () => {
    this.setState({
      focusedTab: 'events',
    });
  };

  statisticsPage = () => {
    this.setState({
      focusedTab: 'statistics',
    });
  };

  rosterPage = () => {
    this.setState({
      focusedTab: 'roster',
    });
  };

  render() {
    console.log(this.context.matchData._W);
    var matchD = this.context.matchData._W;
    if (
      this.context.matchId === 'empty' ||
      this.context.matchId === undefined ||
      matchD === null
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
      console.log(this.context.matchId);
      // console.log(this.context.matchData);
      console.log(matchD);
      return (
        <View style={styles.container}>
          {d}
          {/*<View style={styles.containerTop} key={'qwe'}>*/}
          {/*  <Text>{this.context.matchId}</Text>*/}
          {/*  <Text>{matchD.item.start_dt}</Text>*/}
          {/*  <Text>*/}
          {/*    {matchD.team1.logo}.{matchD.gf}.{'      :      '}.{matchD.ga}.*/}
          {/*    {matchD.team2.logo}*/}
          {/*  </Text>*/}
          {/*  <Text>*/}
          {/*    {matchD.team1.short_name}.{'            '}.*/}
          {/*    {matchD.team2.short_name}*/}
          {/*  </Text>*/}
          {/*</View>*/}
          {/*<View style={{height: 30, marginBottom: 30}}>*/}
          {/*  <ScrollView horizontal={true} style={styles.scrollItem}>*/}
          {/*    <TouchableOpacity*/}
          {/*      activeOpacity={0.8}*/}
          {/*      onPress={() => this.eventsPage()}>*/}
          {/*      <Text>{'        События         '}</Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*    <TouchableOpacity*/}
          {/*      activeOpacity={0.8}*/}
          {/*      style={styles.touchItem}*/}
          {/*      onPress={() => this.statisticsPage()}>*/}
          {/*      <Text>{'        Статистика          '}</Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*    <TouchableOpacity*/}
          {/*      activeOpacity={0.8}*/}
          {/*      onPress={() => this.rosterPage()}>*/}
          {/*      <Text>{'        Составы          '}</Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*  </ScrollView>*/}
          {/*</View>*/}
          {/*<View style={styles.mainDataContainer}>*/}
          {/*  <Text>{this.state.focusedTab}</Text>*/}
          {/*</View>*/}
          {/*<Button*/}
          {/*  title="К списку матчей"*/}
          {/*  onPress={() => this.props.navigation.navigate('MatchCenter')}*/}
          {/*/>*/}
        </View>
      );
    }
  }
}
MatchScreen.contextType = FriendsContext;

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
});
