const router  = require('express').Router();
const passport = require('passport');

router.get('/google-login',passport.authenticate('google', {
    scope:['profile']
}));


router.get('/google-login/redirect', passport.authenticate('google'), (req, res) => {
    console.log('redirect URI ');
    res.send('user has been logged in!')
});


module.exports = router;
