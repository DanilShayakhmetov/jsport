import gql from 'graphql-tag';

export const GET_PLAYER_MATCH = gql`
  query PlayerMatchQuery($teamId: Int!, $from: Date!, $to: Date!) {
    calendar(
      filters: {team_id: $teamId, start_date_range: {from: $from, to: $to}}
    ) {
      paginatorInfo {
        count
      }
      data {
        series_id
        number
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
        overtime
        technical
        start_dt
      }
    }
  }
`;
