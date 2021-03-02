import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {FriendsContext} from './FriendsContext';
import makeApolloClient from './apollo';
import {gql, useQuery} from '@apollo/client';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>You have {this.context.currentFriends.length} items.</Text>
        <Button
          title="Add new"
          onPress={() => this.props.navigation.navigate('Friends')}
        />
      </View>
    );
  }
}
HomeScreen.contextType = FriendsContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
