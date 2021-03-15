import gql from 'graphql-tag';

export const GET_MATCH_CENTER = gql`
  query MatchCenterQuery($from: Date!, $to: Date!) {
    calendar(filters: {start_date_range: {from: $from, to: $to}}) {
      paginatorInfo {
        count
      }
      data {
        tournament_id
        series_id
        number
        team1 {
          team_id
          short_name
          logo
        }
        team2 {
          team_id
          short_name
          logo
        }
        gf
        ga
        gfp
        gap
        stadium_id
        start_dt
      }
    }
  }
`;
