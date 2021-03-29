import gql from 'graphql-tag';

export const GET_TOURNAMENT_LIST = gql`
  query TournamentListQuery($seasonId: Int!) {
    tournaments(first: 10, filters: {season_id: $seasonId}) {
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
