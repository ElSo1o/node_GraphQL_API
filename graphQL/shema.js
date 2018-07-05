exports.typeDefs =
`       type Users {
          _id: String!
          login: String!
          password: String!
          type: Int!
        }
        type SigninPayload {
            token: String
            user: Users
        }
        type Query {
          allUsers (login: String): [Users]!
        }
        type Mutation {
          createUser(login: String!, password: String!, type: Int!): Users!
          singIn(login: String!, password: String!): SigninPayload!
        }
`
