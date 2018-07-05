'use strict';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const { graphiqlExpress, graphqlExpress } =   require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {typeDefs} = require('./graphQL/shema');
const {resolvers} = require('./resolver/index');
const {Cat, Users} = require('./db/collections');
const assert = require('assert');

const app = express();

const checkJwt = jwt({ secret: 'shhhhhhared-secret'}).unless({path: ['/api','/console']})

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const loggingMiddleware = (req, res, next) => {
    // console.log(req)
    // if(!req.headers.cookie){
    //     throw new Error('Aunthenication!')
    // }
    console.log('ip:', req.ip);
    const authHeader = req.headers;
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    // console.log(authHeader.cookie)
    next();
}

const root = {
    ip: (args, request) => {
        console.log(`IP IS A ${request.ip}`)
        return request.ip;
    }
};
app.use(loggingMiddleware);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(checkJwt);
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', bodyParser.json(), graphqlExpress((req, res) => ({
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
app.use('/console', graphiqlExpress({ endpointURL: '/api' }));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
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
