const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const get_cookies = function(request) {
    let cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
        let parts = cookie.match(/(.*?)=(.*)$/)
        cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
};


exports.resolvers = {
    Query: {
        allCats: async (parent, args, { Cat, req }) => {
            // { _id: 123123, name: "whatever"}
            console.log(parent.ip)
            // console.log(args)
            // console.log(Cat)
            const cats = await Cat.find();
            return cats.map((x) => {
                x._id = x._id.toString();
                return x;
            });
        },
        allUsers: async (parent, args, { Users, req, res }) => {
            console.log(args)
            // console.log(get_cookies(req.headers.cookie)
            if(!req.headers.cookie){
                throw new Error('Not Token')
            } else {
                // console.log(req.headers.cookie)
                // console.log(get_cookies(req))
                const t = get_cookies(req).access_token
                console.log(t)

                const result = jsonwebtoken.verify(t, 'shhhhh-secret',  async (err, decoded) => {
                    let result
                    if(err){
                        console.log(err)
                        throw new Error('Invalid Token')
                    } else {
                        console.log(decoded);
                        if(args.login){
                            const user = await Users.findOne({
                                login: args.login
                            });
                            if (!user) {
                                throw new Error('No user with that login')
                            }
                            // const valid = await bcrypt.compare(args.password, user.password)
                            //
                            // if (!valid) {
                            //     throw new Error('Incorrect password')
                            // }
                            // console.log(user)
                            result = [user]
                        }
                        else {
                            // console.log(Users)
                            const user = await Users.find();
                            result = user.map((x) => {
                                console.log(x.type)
                                x._id = x._id.toString();
                                return x;
                            });
                        }
                    }
                    return result
                });
                return result
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
}