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

router.get('/google-login',passport.authenticate('google', {
    scope:['profile'],
    display: 'popup',
    prompt: 'select_account'
}));

router. get('/google-login/redirect',(req,res,next)=> {
    next();
}, passport.authenticate('google'),(req,res)=>{
    res.redirect(`${process.env.APP_URL}/popup-redirect`);
})

router.get('/logout',(req,res)=> {
    req.logOut();
    res.redirect(req.get('referrer'));
});

module.exports = router;
