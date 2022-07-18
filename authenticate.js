var passport = require('passport');
var LocalStratergy = require('passport-local').Strategy;
var User = require('./models/user');

exports.local = passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());