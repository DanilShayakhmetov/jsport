import gql from 'graphql-tag';

export const GET_TOURNAMENT_TABLE = gql`
  query TournamentTableQuery($roundId: ID!) {
    round(round_id: $roundId) {
      name
      type_id
      target
      has_table
      tableRows {
        team {
          short_name
        }
        games
        points
        wins
        draws
        losses
        gf
        ga
        place
      }
    }
  }
`;
