const router  = require('express').Router();
const passport = require('passport');
const {isProd} = require("../config/passport-setup");

router.get('/google-login/success', (req, res) => {
        if (req.user) {
            res.json({
                authenticated: true,
                cookies: req.cookies,
                user: req.user.userName
            });
        }
        else {
            res.json({
                authenticated: false,
                cookies: req.cookies,
                user: ''
            });

        }
    }
);

router.get('/google-login', (req, res,next) => {
    /*set the uri of the origin request the auth and sate that in the state object to be shared trough
     all the oauth flow*/
    const state = req.get('referrer');
    const authenticator = passport.authenticate('google', {
        scope: ['profile', 'email'],
        display: 'popup',
        prompt: 'select_account',
        state
    })
    authenticator(req, res, next);
});

router. get('/google-login/redirect' ,passport.authenticate('google'),(req,res)=>{
    res.redirect(`${req.query.state}popup-redirect`);
})

router.get('/logout',(req,res)=> {
    req.logOut();
    res.redirect(req.get('referrer'));
});

module.exports = router;
