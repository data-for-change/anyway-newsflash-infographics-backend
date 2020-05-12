const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
let usersList = new Map();
const keys = !isProd()?require('./keys').google :undefined;


function isProd() {
    return process.env.NODE_ENV === 'production';
}

passport.serializeUser((user,done)=>{
   done(null,user.userId);
});

passport.deserializeUser((id, done) => {
    const fetchedUser =  usersList.get(id)
    done(null,fetchedUser);

});


passport.use(new GoogleStrategy({
        callbackURL: `${process.env.BASE_URL}/auth/google-login/redirect`,
        clientID: isProd()? process.env.GOOGLE_ID: keys.clientId,
        clientSecret:  isProd()? process.env.GOOGLE_SECRET: keys.clientSecret
    },(accessToken,refreshToken,profile,done ) => {
        const userFromList = usersList.get(profile.id)
        if(userFromList){
            return done(null,userFromList);
        }
        else{
            const newUser= {
                userId:profile.id,
                userName:profile.displayName};
            usersList.set(profile.id, newUser);
            return done(null,newUser);
        }
    })
);

module.exports.isProd = isProd;