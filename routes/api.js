const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiController');

router.get('/news-flash', async function (req, res) {
    let dateToSend = null;
    try {
        dateToSend = await controller.getData(req.url, 'newsFlash');
    } catch (err) {
        console.log(err)
    }

    res.send(dateToSend);
});


router.get('/infographics_data', async function (req, res) {
    let dataToSend = null;
    try {
        dataToSend = await controller.getData(req.url, 'infographic');
    } catch (err) {
        console.log(err)
    }
    res.send(dataToSend);
});

router.get('/clear-cache', (req, res) => {
    controller.clearAPICache();
    res.send('Cache Has Been Clear And Reset!');
})


module.exports = router;
