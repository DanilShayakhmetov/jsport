import gql from 'graphql-tag';

export const GET_TEAM_MATCH = gql`
  query TeamMatchQuery($teamId: Int!) {
    calendar(filters: {team_id: $teamId}) {
      paginatorInfo {
        count
      }
      data {
        series_id
        number
        team1 {
          team_id
        }
        team2 {
          team_id
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
