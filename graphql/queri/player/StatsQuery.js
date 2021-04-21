import gql from 'graphql-tag';

export const GET_PLAYER_STATS = gql`
  query PlayerStatsQuery($playerId: Int!, $seasonId: Int!) {
    stats(
      filters: {player_id: $playerId, season_id: $seasonId}
      sorters: [{column: GOALS, order: DESC}]
      groupers: [TOURNAMENT]
      aggregates: [GAMES, GOALS, ASSISTS, YELLOW_CARDS, RED_CARDS]
    ) {
      data {
        player {
          player_id
          first_name
          last_name
          birthday
          photo
        }
        team {
          team_id
          full_name
          logo
        }
        goals
        games
        assists
        yellow_cards
        red_cards
      }
    }
  }
`;
