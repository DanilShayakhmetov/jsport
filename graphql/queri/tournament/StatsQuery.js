import gql from 'graphql-tag';

export const GET_TOURNAMENT_STATS = gql`
  query TournamentStatsQuery($tournamentId: Int!, $seasonId: Int!) {
    stats(
      filters: {tournament_id: $tournamentId, season_id: $seasonId}
      sorters: [{column: GOALS, order: DESC}]
      groupers: [PLAYER]
      aggregates: [GOALS, YELLOW_CARDS]
    ) {
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
