const router  = require('express').Router();
const passport = require('passport');

router.get('/google-login',passport.authenticate('google', {
    scope:['profile']
}));


router.get('/google-login/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});


module.exports = router;
