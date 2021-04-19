import 'react-native-gesture-handler';
import React from 'react';
import {Image} from 'react-native';
import makeApolloClient from './apollo';
import {GET_MATCH_CENTER} from './queri/match/MatchCenterQuery';
import {GET_MATCH} from './queri/match/MatchQuery';
import {GET_TOURNAMENT} from './queri/match/TournamentQuery';
import {GET_ROUND} from './queri/match/RoundQuery';
import {GET_TOURNAMENT_SCHEDULE} from './queri/tournament/ScheduleQuery';
import {GET_TOURNAMENT_TABLE} from './queri/tournament/TableQuery';
import {GET_TOURNAMENT_LIST} from './queri/tournament/ListQuery';
import {GET_TOURNAMENT_APPLICATION} from './queri/tournament/ApplicationQuery';
import {GET_TEAM_MATCH} from './queri/team/TeamMatchQuery';
import {GET_TEAM_ROSTER} from './queri/team/TeamRosterQuery';
import {GET_TEAM_LIST} from './queri/team/ListQuery';
import {JoinAppContext} from '../JoinAppContext';
import {GET_SEASONS} from './queri/season/SeasonQuery';
import teamLogo from '../assets/images/team_logo.png';
import soccerBall from '../assets/images/soccer-ball.png';

const client = makeApolloClient();
const today = new Date();
const listOfMonth = {
  '01': 'января',
  '02': 'февраля',
  '03': 'марта',
  '04': 'апреля',
  '05': 'мая',
  '06': 'июня',
  '07': 'июля',
  '08': 'августа',
  '09': 'сентября',
  10: 'октября',
  11: 'ноября',
  12: 'декабря',
};

class Handler extends React.Component {
  constructor(props) {
    super(props);
  }

  //GET MATCH CALENDAR FOR MATCH CENTER
  static getMatchCalendar(from, to) {
    return client
      .query({
        variables: {from: from, to: to},
        query: GET_MATCH_CENTER,
      })
      .then(function (value) {
        // console.log(calendar);
        return value.data.calendar.data;
      })
      .catch((error) => {
        error;
      });
  }

  //GET MATCH PROFILE PAGE
  static getMatchMain(matchId) {
    return client
      .query({
        variables: {matchId: matchId},
        query: GET_MATCH,
      })
      .then((value) => {
        return value.data.match;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //GET TOURNAMENT NAMES
  static getTournament(tournament_id) {
    let tournamentId = parseInt(tournament_id);
    return client
      .query({
        variables: {tournamentId: tournamentId},
        query: GET_TOURNAMENT,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //GET ROUND DATA UNIVERSAL 1003807 1003808  1003809
  static getRound(roundId) {
    return client
      .query({
        variables: {roundId: roundId},
        query: GET_ROUND,
      })
      .then(function (value) {
        return value.data.round;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //GET TOURNAMENT SCHEDULE START PAGE
  static getTournamentSchedule(tournamentId, roundId, from, to) {
    return client
      .query({
        variables: {
          tournamentId: tournamentId,
          roundId: roundId,
          from: from,
          to: to,
        },
        query: GET_TOURNAMENT_SCHEDULE,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTournamentTable(tournamentId, roundId, from, to) {
    return client
      .query({
        variables: {
          tournamentId: tournamentId,
          roundId: roundId,
          from: from,
          to: to,
        },
        query: GET_TOURNAMENT_TABLE,
      })
      .then(function (value) {
        let calendar = value.data;
        console.log(calendar);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTournamentList(season_id) {
    let seasonId = parseInt(season_id);
    return client
      .query({
        variables: {
          seasonId: seasonId,
        },
        query: GET_TOURNAMENT_LIST,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTournamentApplication(teamId, tournamentId) {
    return client
      .query({
        variables: {
          tournamentId: tournamentId,
          teamId: teamId,
        },
        query: GET_TOURNAMENT_APPLICATION,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTeamMatch(team_id) {
    let teamId = parseInt(team_id);
    return client
      .query({
        variables: {
          teamId: teamId,
        },
        query: GET_TEAM_MATCH,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTeamRoster(teamId) {
    return client
      .query({
        variables: {
          teamId: teamId,
        },
        query: GET_TEAM_ROSTER,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTeamList(season_id) {
    let seasonId = parseInt(season_id);
    return client
      .query({
        variables: {
          seasonId: seasonId,
        },
        query: GET_TEAM_LIST,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getPlayerStats(teamsCount) {
    return client
      .query({
        variables: {
          teamsCount: teamsCount,
        },
        query: GET_TEAM_LIST,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getSeasons() {
    return client
      .query({
        query: GET_SEASONS,
      })
      .then(function (value) {
        return value.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static dataFilter(inputData) {
    if (inputData === 'empty' || inputData === undefined) {
      console.log(inputData);
      return [];
    } else {
      const filtered = inputData.filter(function (el) {
        return el != null;
      });

      return filtered;
    }
  }

  static getDate(day = 0, month = 0) {
    let dd = today.getDate() + day;
    let mm = today.getMonth() + 1 + month;
    let yyyy = today.getFullYear();
    if (mm.toString().length === 1) {
      mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
  }

  static isUndefined(inputData) {
    return inputData === 'empty' || inputData === undefined;
  }

  static getFormedDate(dateString) {
    let date = dateString.split(' ')[0].split('-');
    let time = dateString.split(' ')[1].split(':');
    date[1] = listOfMonth[date[1]];
    console.log(date, time);
    return date[2] + ' ' + date[1] + ' , ' + time[0] + ':' + time[1];
  }

  static getImageURI(teamId, image) {
    if (teamId === null || image === null) {
      return 'https://nflperm.ru/assets/936085a3/football_logo_173x173.png';
    } else {
      return (
        'https://st.joinsport.io/team/' +
        teamId +
        '/logo/' +
        image.split('.')[0] +
        '_100x100.' +
        image.split('.')[1]
      );
    }
  }
}

Handler.contextType = JoinAppContext;

export default Handler;
