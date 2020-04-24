const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/profile/error');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.send('you are logged in, this is your profile - ' + req.user.userName);
});

router.get('/error',(req,res)=>{
    res.end('error! please  login!');
})


module.exports = router;
