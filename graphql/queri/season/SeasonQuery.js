import gql from 'graphql-tag';

export const GET_SEASONS = gql`
  query SeasonsQuery {
    seasons {
      season_id
      title
      start_dt
      end_dt
    }
  }
`;
