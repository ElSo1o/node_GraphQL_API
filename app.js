'use strict';
const createError = require('http-errors'),
 express = require('express'),
 path = require('path'),
 cookieParser = require('cookie-parser'),
 logger = require('morgan'),
 jwt = require('express-jwt'),
 bodyParser = require('body-parser'),
 { graphiqlExpress, graphqlExpress } =   require('apollo-server-express'),
 { makeExecutableSchema } = require('graphql-tools'),
 indexRouter = require('./routes/index'),
 usersRouter = require('./routes/users'),
 {typeDefs} = require('./graphQL/shema'),
 {resolvers} = require('./resolver/index'),
 {Cat, Users} = require('./db/collections'),
 assert = require('assert'),
 cors = require('cors')

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
app.use(cors())
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

// Access-Control-Allow
app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://elsolo.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
