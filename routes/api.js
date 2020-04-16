const express = require('express');
const router = express.Router();
const  fetch = require('node-fetch');
const NodeCache = require('node-cache');
const ttl = 1000*60*60*24;
const dataCache = new NodeCache();
const apiConstants = require('../config/server-constants').api;
const  getDataFromApi = (url) => {
    return fetch(url)
        .then((realServerRes)=>realServerRes.json()).catch(err=>console.log(err));
};

function getInfographicForNewsflash(id){
    const  urlAsKey = apiConstants.infographicsQuery + id;
    fetch(urlAsKey).then(res=>res.json()).then(jsonObj=>dataCache.set(urlAsKey,jsonObj));
}

function setInfographicData(newsFlashIds){
newsFlashIds.forEach(newsId=>getInfographicForNewsflash(newsId));

}
setInterval(()=>dataCache.flushAll(),ttl);

 async function getData(urlAsKey,fetchData){
    let dataFromCache;
    dataFromCache = dataCache.get(urlAsKey);
    if(!dataFromCache){
        dataFromCache = await fetchData(urlAsKey);
    }
    return dataFromCache;
}

router.get('/news-flash' ,async function (req,res){
    const url = `${apiConstants.baseUrl}${req.url}`;
    const dateToSend = await  getData(url,(urlAsKey)=>{
        const newFlashObjects =  getDataFromApi(urlAsKey,dataCache);
        dataCache.set(urlAsKey,newFlashObjects);
        const newsFlashIds = newFlashObjects.map(newsFlash=>newsFlash.id);
        setInfographicData(newsFlashIds,dataCache);
    });
    res.send(dateToSend);
});


router.get('/infographics_data',async (req,res)=>{
    const url = `${apiConstants.baseUrl}${req.url}`;
    const dataToSend = await getData(url, (urlAsKey)=>{
        const dataFromServer =  getDataFromApi(urlAsKey);
        dataCache.set(urlAsKey,dataFromServer);
        return dataFromServer;
        });
    res.send(dataToSend);
});


module.exports= router;
