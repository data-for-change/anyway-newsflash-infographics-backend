const router  = require('express').Router();
const passport = require('passport');

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
)

router.get('/google-login',passport.authenticate('google', {
    scope:['profile'],
}));

router. get('/google-login/redirect', passport.authenticate('google',{
    successRedirect: process.env.APP_URL,
    failureRedirect:'/'
}));

router.get('/logout',(req,res)=>{
req.logOut();
res.redirect('/');
});
module.exports = router;
