const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {token, get_cookies} = require('./verifycations')

// const get_cookies = function(request) {
//     let cookies = {};
//     request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
//         let parts = cookie.match(/(.*?)=(.*)$/)
//         cookies[ parts[1].trim() ] = (parts[2] || '').trim();
//     });
//     return cookies;
// };
exports.query = {
        allUsers: async (parent, args, { Users, req, res }) => {
        let result,tokenStr
        console.log(args)
        // console.log(get_cookies(req.headers.cookie)
        if(!req.headers.cookie){
            // throw new Error('Not Token')
            tokenStr = req.headers.authentication
        } else {
            tokenStr = get_cookies(req).access_token
        }
        if(!tokenStr){
            throw new Error('Not Token')
        } else {
            // console.log(req.headers.cookie)
            // console.log(get_cookies(req))
            console.log(token(tokenStr))
            const verify = token(tokenStr)

            // console.log(verifyToken.token(token))

            if(verify.value === null || verify.err !== null) {
                throw new Error('Invalid Token')
            } else {
                console.log(typeof verify.value.type)
                if(verify.value.type === 3){
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
                } else {
                    throw new Error('Not access denied')
                }
            }
            return result
        }
    }
}