import React, {Component} from 'react';
import {
  Button,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Image,
} from 'react-native';
import {JoinAppContext} from '../../JoinAppContext';
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
    if (handler.isUndefined(this.context.calendar)) {
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
        match.visibility = match.item.start_dt.split(' ')[0] <= to;
      });
    });
    this.setState({
      filteredCalendar: calendar,
    });
  };

  getCalendar = () => {
    var calendar = '';
    if (this.state.filteredCalendar !== 'empty') {
      calendar = handler.dataFilter(this.state.filteredCalendar);
    } else {
      calendar = this.context.calendar;
    }

    return calendar;
  };

  render() {
    if (handler.isUndefined(this.context.calendar)) {
      return (
        <View style={styles.container}>
          <Text style={styles.topHeading}>Wait</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={{height: 50}}>
            <ScrollView
              horizontal={true}
              style={{fontFamily: 'OpenSans', fontSize: 14}}>
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
          </View>
          <ScrollView style={{fontFamily: 'OpenSans'}}>
            {this.getCalendar().map((item, number) => (
              <View>
                {/*Header of the Expandable List Item*/}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.updateLayout.bind(this, item.tournamentId)}
                  style={styles.header}>
                  <Text style={styles.headerText}>{item.Data.full_name}</Text>
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
                          {value.item.team1.short_name}
                          {/*.{value.item.team1.logo}*/}
                        </Text>
                        <Image
                          style={styles.logo}
                          source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                          }}
                        />
                        <Text
                          style={{
                            display: value.item.ga === null ? null : 'none',
                            overflow: 'hidden',
                          }}>
                          {value.item.start_dt}
                          {/*.{value.item.team2.logo}*/}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#606070',
                            padding: 10,
                            fontFamily: 'OpenSans',
                            display: value.item.ga !== null ? null : 'none',
                            margin: 10,
                          }}>
                          {value.item.ga}.{':'}.{value.item.gf}
                          {/*.{value.item.team2.logo}*/}
                        </Text>
                        <Image
                          style={styles.logo}
                          source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                          }}
                        />
                        <Text style={styles.text}>
                          .{value.item.team2.short_name}
                        </Text>
                        <Text style={styles.text}>
                          {value.start_dt}.{item.Stadium.name}.{'|'}.
                          {item.Stadium.address}
                        </Text>
                        <View style={styles.separator} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Button
              title="матч центр"
              onPress={() => this.props.navigation.navigate('MatchCenter')}
            />
            <Button
              title="турниры"
              onPress={() => this.props.navigation.navigate('TournamentList')}
            />
            <Button
              title="команды"
              onPress={() => this.props.navigation.navigate('TeamList')}
            />
          </View>
        </View>
      );
    }
  }
}

MatchCenterScreen.contextType = JoinAppContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'OpenSans',
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
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'OpenSans',
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
    fontFamily: 'OpenSans',
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    fontFamily: 'OpenSans',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hideItem: {
    display: 'none',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  logo: {
    width: 25,
    height: 25,
    borderRadius: 100,
  },
});
