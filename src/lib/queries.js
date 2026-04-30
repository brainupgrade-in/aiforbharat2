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
