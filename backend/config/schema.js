const { buildSchema } = require("graphql"); // вытаскиваем схему графкуэль

// Схема GraphQL
const schema = buildSchema(`
    type User {
    id: ID!
    email: String!
    name: String
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type RefreshTokenPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): RefreshTokenPayload!
    deleteUser(id: ID!): User
    logout: Boolean! # Новая мутация для удаления refresh-токенов
  }
`);

module.exports = schema;
