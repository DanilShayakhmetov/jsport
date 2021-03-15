import gql from 'graphql-tag';

export const GET_TOURNAMENT = gql`
  query TournamentQuery($tournamentId: ID!) {
    tournament(tournament_id: $tournamentId) {
      full_name
      short_name
    }
  }
`;
