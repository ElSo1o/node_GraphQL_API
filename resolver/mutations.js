const jsonwebtoken = require('jsonwebtoken')
const {token, get_cookies} = require('./verifycations')
exports.mutations = {
        createUser: async (parent, args, { Users, req, res  }) => {
            let result,tokenStr
            console.log(args)
            if(!req.headers.cookie){
                // throw new Error('Not Token')
                tokenStr = req.headers.authorization
            } else {
                tokenStr = get_cookies(req).access_token
            }
            console.log(tokenStr)
            if(!tokenStr) {
                throw new Error('Not Token')
            } else {
                const verify = token(tokenStr)
                if(verify.value === null || verify.err !== null) {
                    throw new Error('Invalid Token')
                } else {
                    if(verify.value.type === 3){
                        if(!args.login || !args.password){
                            throw new Error('fields must not be empty')
                        } else {
                            result = await new Users(args).save();
                            result._id = result._id.toString();
                        }
                    } else {
                        throw new Error('Not access denied')
                    }
                }
            }
        return result;
    },
        singIn: async (parent, args, { Users, req, res }) => {
            console.log(req.headers.cookie)
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
                res.setHeader('authorization', token);
                res.cookie('access_token', token)

                return {token,user}
            } else {
                throw new Error('Password or Login not empty')
            }
    },
}