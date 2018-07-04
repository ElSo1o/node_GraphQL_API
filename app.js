'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('express-jwt')
const bodyParser = require('body-parser')

const { graphiqlExpress, graphqlExpress } =   require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const mongoose = require('mongoose')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {typeDefs} = require('./graphQL/shema')
const {resolvers} = require('./config/index')



const app = express();

const assert = require('assert');

// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'ElSoloDb';
// view engine setup

const checkJwt = jwt({ secret: 'shhhhhhared-secret'}).unless({path: ['/graphql','/graphiql']})
app.use(checkJwt);


const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

function loggingMiddleware(req, res, next) {
    console.log('ip:', req.ip);
    const authHeader = req.headers;
    // console.log(authHeader)
    next();
}

const root = {
    ip: (args, request) => {
        console.log(`IP IS A ${request.ip}`)
        return request.ip;
    }
};
app.use(loggingMiddleware);

mongoose.connect(`${url}/${dbName}`);

const Cat = mongoose.model('cats', { name: String });
const Users = mongoose.model('users', { login: String, password: String });

app.use('/graphql', bodyParser.json(), graphqlExpress((req, res) => ({
    schema: schema,
    rootValue: root,
    context: {
        Cat: Cat,
        Users: Users,
        req: req,
        res: res
    },
    pretty: true,
    graphiql: true
})));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//
// app.use('/graphql', jwt({
//     secret: 'shhhhhhared-secret',
//     requestProperty: 'auth',
//     credentialsRequired: false,
// }));


// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
// }));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// MongoClient.connect(url, (err, client) => {
//     if (err) {
//         throw err;
//     }
//     const db = client.db(dbName);
//     db.collection('users').find().toArray((err, result) => {
//         if (err) {
//             throw err;
//         }
//         console.log(result);
//     });
//     client.close()
// });

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
