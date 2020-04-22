const express = require('express');
const router = express.Router();
const  fetch = require('node-fetch');
const NodeCache = require('node-cache');
const ttl = 1000*60*60*24;
const dataCache = new NodeCache();
const apiConstants = require('../config/server-constants').api;
const  getDataFromApi = async  (url) => {
    const res = await fetch(url);
    const fetchedData = await res.json();
    return fetchedData;
}


function getInfographicForNewsflash(id){
    const  urlAsKey = apiConstants.infographicsQuery + id;
    fetch(urlAsKey).then(res=>res.json()).catch(err=>console.log('error fetching url: ' + urlAsKey + ': ' + err)).
    then(jsonObj=>dataCache.set(urlAsKey,jsonObj));
}

function setInfographicData(newsFlashIds){
newsFlashIds.forEach(newsId=>getInfographicForNewsflash(newsId));

}
setInterval(()=>dataCache.flushAll(),ttl);

    function getData(urlAsKey,fetchData){
    let dataFromCache;
    dataFromCache = dataCache.get(urlAsKey);
    if(!dataFromCache){
        dataFromCache =   fetchData(urlAsKey);
    }
    return dataFromCache;
}

router.get('/news-flash' , async function (req,res){
    const url = `${apiConstants.baseUrl}${req.url}`;
        const dateToSend =  await  getData(url,   async(urlAsKey)=>{
        const newFlashObjects =await    getDataFromApi(urlAsKey);
        dataCache.set(urlAsKey,newFlashObjects);
        const newsFlashIds = newFlashObjects.map(newsFlash=>newsFlash.id);
        setInfographicData(newsFlashIds,dataCache);
        return newFlashObjects
    });
    res.send(dateToSend);
});


router.get('/infographics_data', async function (req,res) {
    const url = `${apiConstants.baseUrl}${req.url}`;
    const dataToSend =    await getData(url,  (urlAsKey)=>{
        const dataFromServer =  getDataFromApi(urlAsKey);
        dataCache.set(urlAsKey,dataFromServer);
        return dataFromServer;
        });
    res.send(dataToSend);
});


module.exports= router;
