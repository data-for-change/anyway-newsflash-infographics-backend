const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');
let dataFromDB = require('./../config/db.json');
const keys = !isProd()?require('./keys').google :undefined;

function isProd() {
    return process.env.NODE_ENV === 'production';
}

passport.serializeUser((user,done)=>{
   done(null,user.userId);
});

passport.deserializeUser((id, done) => {
    const users = JSON.parse(fs.readFileSync('../config/db.json'));
    const fetchedUser =  users.find((user)=> user.userId === id)
    done(null,fetchedUser);

});


passport.use(new GoogleStrategy({
        callbackURL: `${process.env.BASE_URL}:${process.env.PORT}/auth/google-login/redirect`,
        clientID: isProd()? process.env.GOOGLE_ID: keys.clientId,
        clientSecret:  isProd()? process.env.GOOGLE_SECRET: keys.clientSecret
    },(accessToken,refreshToken,profile,done ) => {
        const userFromDB = dataFromDB.find((user)=> user.userId === profile.id);
        if(userFromDB!== undefined){
            return done(null,userFromDB);
        }
        else{
            const newUser= {userId:profile.id,
                userName:profile.displayName};
            dataFromDB.push(newUser);
            fs.writeFileSync('../config/db.json',JSON.stringify(dataFromDB));
            return done(null,newUser)
        }
    })
);
