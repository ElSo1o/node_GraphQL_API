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
        allUsers: async (parent, args, { Users, req }) => {
            console.log(parent)
            console.log(args)
            console.log(req)
            if(args.login){
                const users = await Users.findOne({
                    login: args.login
                });
                console.log(users)
                return [users]
            }
            else {
                const user = await Users.find();
                return user.map((x) => {
                    x._id = x._id.toString();
                    return x;
                });
            }
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