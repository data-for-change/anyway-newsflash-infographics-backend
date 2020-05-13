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

router.get('/google-login',(req,res,next)=> {
    req.appOrigin = req.get('referrer');
    next();
},passport.authenticate('google', {
    scope:['profile']
}));

router. get('/google-login/redirect', passport.authenticate('google'),(req,res)=>{
    console.log(`redirect back to app origin ${req.appOrigin}`);
    res.redirect(req.appOrigin);
})

router.get('/logout',(req,res)=> {
    req.logOut();
    console.log(`redirect back to ${req.get('referrer')}`);
    res.redirect(req.get('referrer'));
});

module.exports = router;
