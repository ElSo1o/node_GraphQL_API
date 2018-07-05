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
exports.get_cookies = (request) => {
    let cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
        let parts = cookie.match(/(.*?)=(.*)$/)
        cookies[ parts[1].trim() ] = (parts[2] || '').trim();
    });
    return cookies;
};