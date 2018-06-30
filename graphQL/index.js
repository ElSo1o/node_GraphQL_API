const { buildSchema } = require('graphql');

exports.typeDefs = `
         type Cat {
      _id: String!
      name: String!
    }
    type Query {
      allCats: [Cat!]!
    }
    type Mutation {
      createCat(name: String!): Cat!
    }
    `

exports.resolvers = {
    Query: {
        allCats: async (parent, args, { Cat }) => {
            // { _id: 123123, name: "whatever"}
            const cats = await Cat.find();
            return cats.map((x) => {
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

// exports.root = {
//     hello: async () => {
//         return await 'Hello Elsolo';
//     },
//     rollDice: function ({numDice, numSides}) {
//         let output = [];
//         for (let i = 0; i < numDice; i++) {
//             output.push(1 + Math.floor(Math.random() * (numSides || 6)));
//         }
//         return output;
//     }
// };

// const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers
// })