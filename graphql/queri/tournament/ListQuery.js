import gql from 'graphql-tag';

export const GET_TOURNAMENT_LIST = gql`
  query TournamentListQuery($tournamentsCount: Int!) {
    tournaments(first: $tournamentsCount) {
      paginatorInfo {
        count
      }
      data {
        tournament_id
        full_name
        short_name
        description
        cover
        start_dt
        end_dt
        category {
          name
        }
      }
    }
  }
`;
