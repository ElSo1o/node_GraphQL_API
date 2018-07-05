const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017';
/***dev**/
// const dbName = 'ElSoloDb';
/***production**/
const dbName = 'elsolodb';
mongoose.connect(`${url}/${dbName}`);

exports.Cat = mongoose.model('cats', { name: String });
exports.Users = mongoose.model('users', { login: String, password: String, type: Number });
