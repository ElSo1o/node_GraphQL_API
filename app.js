const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('express-jwt')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {schema, root} = require('./graphQL/index')
const mongoose = require('mongoose')
const app = express();

const assert = require('assert');

// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'ElSoloDb';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/graphql', jwt({
    secret: 'shhhhhhared-secret',
    requestProperty: 'auth',
    credentialsRequired: false,
}));


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
function loggingMiddleware(req, res, next) {
    console.log('ip:', req.ip);
    next();
}


app.use(loggingMiddleware);

MongoClient.connect(url, (err, client) => {
    if (err) {
        throw err;
    }
    const db = client.db(dbName);
    db.collection('users').find().toArray((err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
    });
    client.close()
});

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
