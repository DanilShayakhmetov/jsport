import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {FriendsContext} from './FriendsContext';

class MatchScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Add new items!</Text>

        {this.context.possibleFriends.map((friend, index) => (
          <Button
            key={friend}
            title={'Add items'}
            onPress={() => this.context.addFriend(index)}
          />
        ))}
        {this.context.calendar.map((friend, index) => (
          <View>
            <Text>{friend.__typename}</Text>
            <Text>{index}</Text>
          </View>
        ))}
        <Button
          title="Back to home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
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

export default MatchScreen;
