import gql from 'graphql-tag';

export const GET_TOURNAMENT_SCHEDULE = gql`
  query TournamentScheduleQuery(
    $tournamentId: Int!
    $roundId: Int!
    $from: Date!
    $to: Date!
  ) {
    calendar(
      filters: {
        round_id: $roundId
        tournament_id: $tournamentId
        start_date_range: {from: $from, to: $to}
      }
    ) {
      paginatorInfo {
        count
      }
      data {
        match_id
        round_id
        tournament_id
        series_id
        number
        team1 {
          team_id
        }
        team2 {
          team_id
        }
        gf
        ga
        gfp
        gap
        overtime
        technical
        is_live
        stadium_id
        start_dt
        timezone
        preview
        video_url
      }
    }
  }
`;
