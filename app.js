// --- Importing required modules ---
const express               = require('express'),
      app                   = express(),
      http                  = require('http').createServer(app),
      request               = require('request'),
      bodyParser            = require('body-parser'),
      db                    = require('mongoose'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      Auth0Strategy         = require('passport-auth0'),
      methodOverride        = require('method-override'),
      cookieParser          = require('cookie-parser'),
      session               = require('express-session'),
      dotenv                = require('dotenv'),
      io                    = require('socket.io')(http);

dotenv.config();

// --- Route folders ---
var authRouter    = require('./routes/auth'),
    indexRouter   = require('./routes/index'),
    projectRouter = require('./routes/projectRoutes'),
    usersRouter   = require('./routes/users');

var strategy = new Auth0Strategy({
   domain:       process.env.AUTH_DOMAIN,
   clientID:     process.env.AUTH_CLIENT,
   clientSecret: process.env.AUTH_SECRET,
   callbackURL:  '/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// --- App configuration ---
app.use(require('express-session')({
	secret: process.env.EXPRESS_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
	cookie: { maxAge: 60000, secure: true },
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use((req,res,next) => {
	res.locals.user = req.user;
	next();
});
app.use('/', authRouter);
app.use('/', projectRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

// --- Connect to Mongoose database ---
db.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to Bug Tracker Mongoose database');
}).catch(err => {
  console.log('Mogoose error: ', err.message);
});

// --- Temp location for routes ---
app.get('/auth_config.json', (req,res) =>{
  res.sendFile(__dirname+'/auth_config.json')
});

// || ------------------- ||
//     Start Application
// || ------------------- ||
http.listen(process.env.PORT, () => {
  console.log('-- Bug Tracker server has started --');
});
