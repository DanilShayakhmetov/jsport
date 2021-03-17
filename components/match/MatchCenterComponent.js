import React, {Component} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  AsyncStorage,
} from 'react-native';
import {FriendsContext} from '../../FriendsContext';
import Handler from '../../graphql/handler';

const handler = Handler;

export default class MatchCenterScreen extends Component {
  //Main View defined under this Class
  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let array = [];
    if (
      this.context.calendar === undefined ||
      this.context.calendar === 'empty'
    ) {
    } else {
      array = [...this.context.calendar];
      array.map((value, placeindex) =>
        value.tournamentId === index
          ? (array[placeindex].isExpanded = !array[placeindex].isExpanded)
          : (array[placeindex].isExpanded = true),
      );
      this.setState({
        calendar: array,
      });
    }
  };

  matchRedirect = (matchId) => {
    this.context.matchId = matchId;
    this.context.matchData = handler.getMatchMain(matchId);
    return this.props.navigation.navigate('Match');
  };

  changeInterval = (calendar, days = 0, month = 0) => {
    let to = handler.getDate(days, month);
    // let calendar = this.context.calendar.matchItems;
    let filtered = {
      isExpanded: false,
      tournamentId: this.context.calendar.tournamentId,
      matchItems: [],
    };
    let result = [];

    calendar.forEach(function (value) {
      let matchList = value.matchItems;
      matchList.forEach(function (match) {
        if (match.start_dt.split(' ')[0] <= to) {
          filtered.matchItems.push(match);
        }
      });
      result[value.tournamentId] = filtered;
    });
    // for (let i = 0; i < calendar.length; i++) {
    //   let matchList = this.context.calendar[i].matchItems;
    //   for (let j = 0; j < matchList.length; j++) {
    //     if (matchList[j].start_dt.split(' ')[0] <= to) {
    //       filtered.matchItems.push(this.context.calendar[i].matchItems[j]);
    //     }
    //   }
    // }
    return result;
  };

  render() {
    if (
      this.context.calendar === 'empty' ||
      this.context.calendar === undefined
    ) {
      return (
        <View style={styles.container}>
          <Text style={styles.topHeading}>Wait</Text>
        </View>
      );
    } else {
      // console.log(this.context.calendar[0].matchItems[0].start_dt.split(' ')[0] < '2021-04-17');
      // if (this.context.calendar[0].matchItems[0].start_dt.split(' ')[0] < '2021-04-17') {
      //   this.context.calendar[0].matchItems[0] = {};
      // }
      // console.log(this.context.calendar[0].matchItems.start_dt);
      // console.log(new Date());
      let calendar = this.changeInterval(this.context.calendar);
      if (calendar !== undefined) {
        return (
          <View style={styles.container}>
              <ScrollView horizontal={true}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.changeInterval.bind(this, 0, 0)}
                    style={styles.header}>
                  <Text>{'        Сегодня         '}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.changeInterval.bind(this, 1, 0)}
                    style={styles.header}>
                  <Text>{'        Завтра          '}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.changeInterval.bind(this, 7, 0)}
                    style={styles.header}>
                  <Text>{'        Неделя          '}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.changeInterval.bind(this, 0, 1)}
                    style={styles.header}>
                  <Text>{'        Месяц           '}</Text>
                </TouchableOpacity>
              </ScrollView>
              <ScrollView>
                {calendar.map((item, number) => (
                    <View>
                      {/*Header of the Expandable List Item*/}
                      <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={this.updateLayout.bind(this, item.tournamentId)}
                          style={styles.header}>
                        <Text style={styles.headerText}>{item.tournamentId}</Text>
                        {/*<Text style={styles.headerText}>{item.isExpanded.toString()}</Text>*/}
                      </TouchableOpacity>
                      <View
                          style={{
                            height: item.isExpanded ? 0 : null,
                            overflow: 'hidden',
                          }}>
                        {/*Content under the header of the Expandable List Item*/}
                        {item.matchItems.map((value, key) => (
                            <TouchableOpacity
                                key={key}
                                style={styles.content}
                                onPress={() => this.matchRedirect(value.match_id)}>
                              <Text style={styles.text}>
                                {value.team1.short_name}.{value.team1.logo}.{value.gf}.
                                {':'}.{value.ga}.{value.team2.logo}.
                                {value.team2.short_name}
                              </Text>
                              <Text style={styles.text}>
                                {value.start_dt}.{value.stadium_id}.
                              </Text>
                              <View style={styles.separator} />
                            </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                ))}
              </ScrollView>
            </View>
        );
      }
    }
  }
}

MatchCenterScreen.contextType = FriendsContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F5FCFF',
  },
  topHeading: {
    paddingLeft: 10,
    fontSize: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
});
