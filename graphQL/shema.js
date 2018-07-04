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
         type Cat {
          _id: String!
          name: String!
        }
        type Query {
          allCats: [Cat!]!
          allUsers (login: String): [Users]!
        }
        type Mutation {
          createCat(name: String!): Cat!
          createUser(login: String!, password: String!): Users!
          singIn(login: String!, password: String!): SigninPayload!
        }
`
