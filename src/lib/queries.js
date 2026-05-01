import { gql } from '@apollo/client'

export const LIST_GLUCOSE_READINGS = gql`
  query ListGlucoseReadings($limit: Int = 50) {
    glucose_reading(order_by: { reading_at: desc }, limit: $limit) {
      id
      value
      context
      notes
      reading_at
      status
    }
  }
`

export const UPDATE_GLUCOSE_READING = gql`
  mutation UpdateGlucoseReading(
    $id: uuid!
    $value: Int!
    $context: String!
    $notes: String
    $reading_at: timestamptz!
    $status: String
  ) {
    update_glucose_reading_by_pk(
      pk_columns: { id: $id }
      _set: { value: $value, context: $context, notes: $notes, reading_at: $reading_at, status: $status }
    ) {
      id
      value
      context
      notes
      reading_at
      status
    }
  }
`

export const DELETE_GLUCOSE_READING = gql`
  mutation DeleteGlucoseReading($id: uuid!) {
    delete_glucose_reading_by_pk(id: $id) {
      id
    }
  }
`

export const INSERT_GLUCOSE_READING = gql`
  mutation InsertGlucoseReading(
    $value: Int!
    $context: String!
    $notes: String
    $reading_at: timestamptz!
    $status: String
  ) {
    insert_glucose_reading_one(object: {
      value: $value, context: $context, notes: $notes, reading_at: $reading_at, status: $status
    }) {
      id
      value
      context
      notes
      reading_at
      status
    }
  }
`

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
    user_profile {
      user_id
      name
      age
      diabetes_type
      language
      target_fasting
      target_post_meal
    }
  }
`

export const UPSERT_PROFILE = gql`
  mutation UpsertProfile(
    $name: String
    $age: Int
    $diabetes_type: String
    $language: String
    $target_fasting: Int
    $target_post_meal: Int
  ) {
    insert_user_profile_one(
      object: {
        name: $name
        age: $age
        diabetes_type: $diabetes_type
        language: $language
        target_fasting: $target_fasting
        target_post_meal: $target_post_meal
      }
      on_conflict: {
        constraint: user_profile_pkey
        update_columns: [name, age, diabetes_type, language, target_fasting, target_post_meal, updated_at]
      }
    ) {
      user_id
      name
      age
      diabetes_type
      language
    }
  }
`

export const UPDATE_PROFILE_LANGUAGE = gql`
  mutation UpdateProfileLanguage($language: String!) {
    insert_user_profile_one(
      object: { language: $language }
      on_conflict: { constraint: user_profile_pkey, update_columns: [language, updated_at] }
    ) {
      user_id
      language
    }
  }
`

export const LIST_RETINA_SCANS = gql`
  query ListRetinaScans($limit: Int = 5) {
    retina_scan(order_by: { created_at: desc }, limit: $limit) {
      id
      classification
      confidence
      risk_level
      created_at
    }
  }
`

export const LIST_CHAT_MESSAGES = gql`
  query ListChatMessages($session_id: String!) {
    chat_message(where: { session_id: { _eq: $session_id } }, order_by: { created_at: asc }) {
      id
      role
      content
      created_at
    }
  }
`

export const INSERT_CHAT_MESSAGE = gql`
  mutation InsertChatMessage($session_id: String!, $role: String!, $content: String!) {
    insert_chat_message_one(object: { session_id: $session_id, role: $role, content: $content }) {
      id
    }
  }
`
