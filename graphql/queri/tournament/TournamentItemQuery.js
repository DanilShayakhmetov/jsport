import gql from 'graphql-tag';

export const GET_TOURNAMENT_ITEM = gql`
  query TournamentItemQuery($tournamentId: ID!) {
    tournament(tournament_id: $tournamentId) {
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
`;
