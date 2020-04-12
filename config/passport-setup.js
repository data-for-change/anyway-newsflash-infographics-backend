const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys').google;
const fs = require('fs');
let dataFromDB = require('./db.json');
passport.serializeUser((user,done)=>{
   done(null,user.userId);
});

passport.deserializeUser((id,done)=>{
    const users = JSON.parse(fs.readFileSync('../config/db.json'));
    const fetchedUser = users.find((user)=> user.id === id);
    done(null,fetchedUser);
})


passport.use(new GoogleStrategy({
        callbackURL: 'http://localhost:3000/auth/google-login/redirect',
        clientID: keys.clientId,
        clientSecret: keys.clientSecret
    },(accessToken,refreshToken,profile,done ) => {
       /* //let data = JSON.parse(fs.readFileSync('../config/db.json').toString('utf-8'));
        let usersArray;
        if(!Array.isArray(dataFromDB)){
            usersArray = [];
            usersArray.push(dataFromDB);
        }
        else {
            usersArray = dataFromDB;
        }*/
        const userFromDB = dataFromDB.find((user)=> user.id === profile.id);
        if(userFromDB!== undefined){
            done(null,userFromDB);
        }
        else{
            const newUser= {userId:profile.id,
                userName:profile.displayName};
            dataFromDB.push(newUser);
            fs.writeFileSync('../config/db.json',JSON.stringify(dataFromDB));
            done(null,newUser)

        }
    })
);
