const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017';
const dbName = 'ElSoloDb';

mongoose.connect(`${url}/${dbName}`);

exports.Cat = mongoose.model('cats', { name: String });
exports.Users = mongoose.model('users', { login: String, password: String, type: Number });
