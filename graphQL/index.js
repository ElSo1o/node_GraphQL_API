exports.typeDefs = `
         type Cat {
          _id: String!
          name: String!
        }
        type Users {
          _id: String!
          name: String!
          password: String!
        }
        type Query {
          allCats: [Cat!]!
          allUsers: [Users!]!
        }
        type Mutation {
          createCat(name: String!): Cat!
        }
    `

exports.resolvers = {
    Query: {
        allCats: async (parent, args, { Cat }) => {
            // { _id: 123123, name: "whatever"}
            console.log(parent)
            console.log(args)
            // console.log(Cat)
            const cats = await Cat.find();
            return cats.map((x) => {
                x._id = x._id.toString();
                return x;
            });
        },
        allUsers: async (parent, args, { Users }) => {
            console.log(parent)
            console.log(args)
            console.log(Users)
            const users = await Users.find();
            return users.map((x) => {
                x._id = x._id.toString();
                return x;
            });
        },
    },
    Mutation: {
        createCat: async (parent, args, { Cat }) => {
            // { _id: 123123, name: "whatever"}
            const kitty = await new Cat(args).save();
            kitty._id = kitty._id.toString();
            return kitty;
        },
    }
}
