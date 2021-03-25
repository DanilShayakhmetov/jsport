import gql from 'graphql-tag';

export const GET_ROUND = gql`
  query RoundQuery($roundId: ID!) {
    round(round_id: $roundId) {
      type_id
      name
#      target
#      has_table
      tableRows {
        team {
          team_id
          full_name
          short_name
          description
          social_profile
          site
          logo
          cover
          main_form_color
          spare_form_color
          is_deleted
          is_archived
        }
        games
        points
        wins
        wins_ot
        wins_so
        draws
        losses_so
        losses_ot
        losses
        gf
        ga
        pf
        pa
        place
      }
    }
  }
`;
