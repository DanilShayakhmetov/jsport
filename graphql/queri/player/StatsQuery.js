import gql from 'graphql-tag';

export const GET_PLAYER_STATS = gql`
  query PlayerStatsQuery($playerId: Int!) {
    stats(filters: {player_id: $playerId}) {
      data {
        player {
          player_id
          first_name
          last_name
        }
        team {
          team_id
          full_name
        }
        goals
        yellow_cards
      }
    }
  }
`;
