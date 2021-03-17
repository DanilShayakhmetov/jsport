import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';
import {FriendsContext} from '../../FriendsContext';
import Handler from '../../graphql/handler';

const handler = Handler;

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
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
          <View key={'qwe'}>
            <Text>{this.context.matchId}</Text>
            <Text>{matchD.start_dt}</Text>
            <Text>
              {matchD.team1.logo}.{matchD.gf}.{'      :      '}.{matchD.ga}.
              {matchD.team2.logo}
            </Text>
            <Text>
              {matchD.team1.short_name}.{'            '}.
              {matchD.team2.short_name}
            </Text>
          </View>
          <Button
            title="К списку матчей"
            onPress={() => this.props.navigation.navigate('MatchCenter')}
          />
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
});
