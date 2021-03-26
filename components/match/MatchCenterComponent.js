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
    this.changeInterval = this.changeInterval.bind(this);
    this.state = {
      filteredCalendar: 'empty',
    };
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let calendar = [];
    if (
      this.context.calendar === undefined ||
      this.context.calendar === 'empty'
    ) {
    } else {
      calendar = [...this.context.calendar];
      calendar.map((value, placeindex) =>
        value.tournamentId === index
          ? (calendar[placeindex].isExpanded = !calendar[placeindex].isExpanded)
          : (calendar[placeindex].isExpanded = true),
      );
      this.setState({
        calendar: calendar,
      });
    }
  };

  matchRedirect = (matchId, matches) => {
    this.context.matchId = matchId;
    this.context.tournamentId = matches.tournamentId;
    this.context.matchData = handler.getMatchMain(matchId);
    this.context.tournamentData = matches;
    return this.props.navigation.navigate('Match');
  };

  changeInterval = (days = 0, month = 0) => {
    let to = handler.getDate(days, month);
    let calendar = [...this.context.calendar];
    calendar.forEach(function (value) {
      value.matchItems.forEach(function (match) {
        match.visibility = match.item.start_dt.split(' ')[0] >= to;
      });
    });
    this.setState({
      filteredCalendar: calendar,
    });
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
      var calendar = '';
      if (this.state.filteredCalendar !== 'empty') {
        calendar = handler.dataFilter(this.state.filteredCalendar);
      } else {
        calendar = this.context.calendar;
      }

      return (
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.changeInterval.bind(this, 0, 0)}
              style={styles.header}>
              <Text color={true ? 'red' : 'blue'}>
                {'        Сегодня         '}
              </Text>
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
                    <View
                      style={{
                        display: value.visibility ? null : 'none',
                        overflow: 'hidden',
                      }}>
                      <TouchableOpacity
                        key={key}
                        style={styles.content}
                        onPress={() =>
                          this.matchRedirect(value.item.match_id, item)
                        }>
                        <Text style={styles.text}>
                          {value.item.team1.short_name}.{value.item.team1.logo}.
                          {':'}.{value.item.ga}.{value.item.team2.logo}.
                          {value.item.team2.short_name}
                        </Text>
                        <Text style={styles.text}>
                          {value.start_dt}.{value.stadium_id}.
                        </Text>
                        <View style={styles.separator} />
                      </TouchableOpacity>
                    </View>
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
  hideItem: {
    display: 'none',
  },
});
