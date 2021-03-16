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
    // let days = this.context.days;
    // let from = dataHandler.getDate();
    // let to = dataHandler.getDate(days);
    await this.context.days
      .then((value) => {
        this.setState({
          days: value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    console.log(this.context.days._W);
    var matchD = this.context.days._W;
    if (
      this.context.matchMain === 'empty' ||
      this.context.matchMain === undefined ||
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
      console.log(this.context.matchMain);
      // console.log(this.context.days);
      console.log(matchD);
      return (
        <View style={styles.container}>
          <View key={'qwe'}>
            <Text>{this.context.matchMain}</Text>
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
