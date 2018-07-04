const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

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
            // console.log(parent)
            // console.log(args)

            console.log(get_cookies(req)['access_token'])
            if(!req.headers.cookie){
                throw new Error('Not Token')
            }
            console.log('test')
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
                user.token = null
                return [user]
                // console.log(user)
                // return [user]
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
            // console.log(Users)
            const us = await new Users(args).save();
            us._id = us._id.toString();
            return us;
        },
        singIn: async (parent, args, { Users, req, res }) => {
            // console.log(req)
            // console.log(res)
            console.log(Users)
            if(args.login && args.password){
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

                const token = jsonwebtoken.sign(
                    {
                    id: user._id,
                    email: user.login
                    },
                    'somesuperdupersecret',
                    { expiresIn: '1h' })
                // console.log(user)
                res.cookie('access_token', token)
                return {token,user}
            } else {
                throw new Error('Password or Login not empty')
            }
        },
    }
}