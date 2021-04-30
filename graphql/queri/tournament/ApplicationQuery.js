import gql from 'graphql-tag';

export const GET_TOURNAMENT_APPLICATION = gql`
  query TournamentApplicationQuery($teamId: ID!, $tournamentId: ID!) {
    application(team_id: $teamId, tournament_id: $tournamentId) {
      tournament_id
      team_id
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
      status
      name
      players {
        tournament_id
        player_id
        player {
          player_id
          first_name
          last_name
          middle_name
          photo
        }
        status
        application_dt
        include_dt
        exclude_dt
        number
        position_id
        captain
      }
    }
  }
`;
