import 'react-native-gesture-handler';
import React from 'react';
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

const client = makeApolloClient();
const today = new Date();

class Handler extends React.Component {
  constructor(props) {
    super(props);
  }

  getDate = (year, month, date) => {
    const d = new Date(year, month, date);
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    const resultDate = `${ye}-${mo}-${da}`;
    // console.log(resultDate);
  };

  //GET MATCH CALENDAR FOR MATCH CENTER
  static getMatchCalendar(from, to) {
    return client
      .query({
        variables: {from: from, to: to},
        query: GET_MATCH_CENTER,
      })
      .then(function (value) {
        let calendar = value.data.calendar.data;
        return calendar;
      })
      .catch((error) => {
        error;
      });
    // console.log(this.state.responseAPI);
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
  static getTournament(tournamentId) {
    return client
      .query({
        variables: {tournamentId: tournamentId},
        query: GET_TOURNAMENT,
      })
      .then(function (value) {
        let calendar = value.data;
        console.log(calendar);
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(this.state.responseAPI);
  }

  //GET ROUND DATA UNIVERSAL 1003807 1003808  1003809
  static getRound(roundId) {
    return client
      .query({
        variables: {roundId: roundId},
        query: GET_ROUND,
      })
      .then(function (value) {
        let round;
        round = value.data.round;
        // console.log(round);
        return round;
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(this.state.responseAPI);
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
        let calendar = value.data;
        console.log(calendar);
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(this.state.responseAPI);
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

  static getTournamentList(seasonId) {
    return client
      .query({
        variables: {
          seasonId: seasonId,
        },
        query: GET_TOURNAMENT_LIST,
      })
      .then(function (value) {
        let tournaments = value.data;
        return tournaments;
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
        let application = value.data;
        // console.log(application);
        return application;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTeamMatch(teamId) {
    return client
      .query({
        variables: {
          teamId: teamId,
        },
        query: GET_TEAM_MATCH,
      })
      .then(function (value) {
        let calendar = value.data;
        return calendar;
        // console.log(calendar);
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
        let calendar = value.data;
        return calendar;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static getTeamList(seasonId) {
    return client
      .query({
        variables: {
          seasonId: seasonId,
        },
        query: GET_TEAM_LIST,
      })
      .then(function (value) {
        let teams = value.data;
        return teams;
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
        let calendar = value.data;
        console.log(calendar);
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
        let seasons = value.data;
        return seasons;
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
}

Handler.contextType = JoinAppContext;

export default Handler;
