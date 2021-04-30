import gql from 'graphql-tag';

export const GET_TOURNAMENT_STATS = gql`
  query TournamentStatsQuery($tournamentId: Int!) {
    stats(
      filters: {tournament_id: $tournamentId}
      sorters: [{column: GOALS, order: DESC}]
      groupers: [PLAYER]
      aggregates: [GAMES, GOALS, YELLOW_CARDS, RED_CARDS]
    ) {
      data {
        player {
          player_id
          first_name
          last_name
          photo
        }
        team {
          team_id
          full_name
          logo
        }
        goals
        games
        yellow_cards
        red_cards
      }
    }
  }
`;
