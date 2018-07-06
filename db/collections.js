const mongoose = require('mongoose')
// const url = 'mongodb://ElSolo:Inbeatwetrust1710919856@ds227481.mlab.com:27481';
/***dev**/
// const dbName = 'ElSoloDb';
// const url = 'mongodb://localhost:27017';
/***production**/
const url = 'mongodb://ElSolo:Inbeatwetrust1710919856@ds227481.mlab.com:27481';
const dbName = 'elsolodb';
mongoose.connect(`${url}/${dbName}`);

exports.Cat = mongoose.model('cats', { name: String });
exports.Users = mongoose.model('users', { login: String, password: String, type: Number });
