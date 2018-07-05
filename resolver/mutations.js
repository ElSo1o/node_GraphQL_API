exports.mutations = {
    createCat: async (parent, args, { Cat }) => {
        // { _id: 123123, name: "whatever"}
        const kitty = await new Cat(args).save();
        kitty._id = kitty._id.toString();
        return kitty;
    },
        createUser: async (parent, args, { Users }) => {
        console.log(args)
        // console.log(Users)
        const us = await new Users(args).save();
        us._id = us._id.toString();
        return us;
    },
        singIn: async (parent, args, { Users, req, res }) => {
        if(args.login && args.password){
            const user = await Users.findOne({
                login: args.login,
                password: args.password
            });
            if (!user) {
                throw new Error('No user with that login')
            }
            console.log(args)
            console.log(user)
            // const hash = bcrypt.hashSync(user.password);
            // console.log(hash)
            // const hash = bcrypt.hashSync(args.password, 10);
            //
            // bcrypt.compare(user.password, hash, function(err, res) {
            //     // res == true
            //     console.log(res)
            //     console.log(err)
            // });
            // const valid = await bcrypt.compare(args.password, user.password)
            // console.log(valid)
            // if (!valid) {
            //     throw new Error('Incorrect password')
            // }

            const token = jsonwebtoken.sign({
                    id: user._id,
                    login: user.login,
                    type: user.type
                },
                'shhhhh-secret',
                {
                    expiresIn: '1h'
                })
            // console.log(user)
            // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.cookie('access_token', token)

            return {token,user}
        } else {
            throw new Error('Password or Login not empty')
        }
    },
}