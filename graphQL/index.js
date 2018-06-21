const { buildSchema } = require('graphql');
exports.schema = buildSchema(`
      type Query {
        post(_id: String): Post
        posts: [Post]
        comment(_id: String): Comment
      }
      type Post {
        _id: String
        title: String
        content: String
        comments: [Comment]
      }
      type Comment {
        _id: String
        postId: String
        content: String
        post: Post
      }
      type Mutation {
        createPost(title: String, content: String): Post
        createComment(postId: String, content: String): Comment
      }
      schema {
        query: Query
        mutation: Mutation
      }
    `);

const prepare = (o) => {
    o._id = o._id.toString()
    return o
}

exports.root = {
    Query: {
        post: async (root, {_id}) => {
            return prepare(await Posts.findOne(ObjectId(_id)))
        }
    },
    Post: {
        comments: async ({_id}) => {
            return (await Comments.find({postId: _id}).toArray()).map(prepare)
        }
    },
    Comment: {
        post: async ({postId}) => {
            return prepare(await Posts.findOne(ObjectId(postId)))
        }
    },
    Mutation: {
        createPost: async (root, args, context, info) => {
            const res = await Posts.insert(args)
            return prepare(await Posts.findOne({_id: res.insertedIds[1]}))
        },
        createComment: async (root, args) => {
            const res = await Comments.insert(args)
            return prepare(await Comments.findOne({_id: res.insertedIds[1]}))
        },
    },
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