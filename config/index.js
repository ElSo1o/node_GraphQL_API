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
        allUsers: async (parent, args, { Users, user }) => {
            console.log(parent)
            console.log(args)
            console.log(user)
            const users = await Users.find();
            return users.map(x => {
                x._id = x._id.toString();
                return x;
            });
        }
    },
    Mutation: {
        createCat: async (parent, args, { Cat }) => {
            // { _id: 123123, name: "whatever"}
            const kitty = await new Cat(args).save();
            kitty._id = kitty._id.toString();
            return kitty;
        },
        createUser: async (parent, args, { Users }) => {
            console.log(args)
            console.log(Users)
            const us = await new Users(args).save();
            us._id = us._id.toString();
            return us;
        },
    }
}