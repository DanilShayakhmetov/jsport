import gql from 'graphql-tag';

export const GET_MATCH = gql`
  query MatchQuery($matchId: ID!) {
    match(match_id: $matchId) {
      match_id
      round_id
      tournament_id
      series_id
      number
      team1 {
        team_id
        full_name
        short_name
        logo
        players {
          player_id
          first_name
          middle_name
          last_name
          position_id
        }
      }
      team2 {
        team_id
        full_name
        short_name
        logo
        players {
          player_id
          first_name
          middle_name
          last_name
          position_id
        }
      }
      gf
      ga
      gfp
      gap
      overtime
      technical
      is_live
      start_dt
      timezone
      tournament {
        short_name
      }
      stadium {
        name
        address
      }
      substitutions {
        team_id
        player_in_id
        player_in_number
        player_out_id
        player_out_number
        minute
        second
        additional
        number
      }
      players {
        id
        team_id
        player_id
        number
        status
        goalkeeper
      }
#      stats1 {
#        team_id
#        goals_first_half
#        shoots_first_half
#        shoots_overall
#        shoots_target_first_half
#        shoots_target_overall
#        corners_first_half
#        corners_overall
#        postbar_first_half
#        postbar_overall
#        fouls_first_half
#        fouls_overall
#        offsides_overall
#        referee_mark
#        discipline_mark
#        attendance
#      }
#      stats2 {
#        team_id
#        goals_first_half
#        shoots_first_half
#        shoots_overall
#        shoots_target_first_half
#        shoots_target_overall
#        corners_first_half
#        corners_overall
#        postbar_first_half
#        postbar_overall
#        fouls_first_half
#        fouls_overall
#        offsides_overall
#        referee_mark
#        discipline_mark
#        attendance
#      }
      goals {
        team_id
        player_id
        assistant_id
        minute
        second
        additional
        number
        situation
      }
      goalsMissed {
        team_id
        player_id
        count
      }
      yellowCards {
        team_id
        player_id
        minute
        second
        additional
        number
        reason
      }
      redCards {
        team_id
        player_id
        minute
        second
        additional
        number
        second_yellow
        reason
        disqualification_id
      }
      shootouts {
        team_id
        player_id
        number
        result
      }
    }
  }
`;
