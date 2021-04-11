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
        match_id
        team1 {
          team_id
          short_name
          full_name
          logo
        }
        team2 {
          team_id
          short_name
          full_name
          logo
        }
        gf
        ga
        gfp
        gap
        start_dt
        tournament {
          full_name
          short_name
        }
        stadium {
          name
          address
        }
      }
    }
  }
`;
