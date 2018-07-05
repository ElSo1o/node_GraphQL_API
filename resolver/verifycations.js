const jsonwebtoken = require('jsonwebtoken')

exports.token = (token) => {
    const result = jsonwebtoken.verify(token, 'shhhhh-secret', (err, decoded) => {
        if (err) {
            console.log(err)
            return {value: null, err: err}
        } else {
            return {value: decoded, err: null}
        }
    })
    return result
}