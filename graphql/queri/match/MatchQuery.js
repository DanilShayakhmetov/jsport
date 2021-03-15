import gql from 'graphql-tag';

export const GET_MATCH = gql`
  query MatchQuery($matchId: ID!) {
    match(match_id: $matchId) {
      match_id
      round_id
      tournament_id
      start_dt
      stadium_id
      team1 {
        team_id
        short_name
      }
      team2 {
        team_id
        short_name
      }
      gf
      ga
      referees {
        referee_id
        position_id
      }
    }
  }
`;
