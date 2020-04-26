const NodeCache = require('node-cache');
const ttl = 1000 * 60 * 60 * 24;
const dataCache = new NodeCache();
const fetch = require('node-fetch');
const apiConstants = require('../config/server-constants').api;


setInterval(() => dataCache.flushAll(), ttl);

const getDataFromApi = (url) => {
    return fetch(url).then(res => res.json()).catch(err => console.log('Error at getDataFromFetch:', err));
}


/**
 * get infographic data for a single news-flash
 * @param id
 * @param yearPeriod
 */
function getInfographicForNewsflash(id, yearPeriod) {
    const timeRangeQuaryParam = yearPeriod != 0 ? apiConstants.yearsAgo + yearPeriod : '';
    const urlAsKey = apiConstants.infographicsQuery + id + timeRangeQuaryParam;
    if(!dataCache.get(urlAsKey)) {
        fetch(urlAsKey).then(res => res.json()).catch(err => console.log('error fetching url: ' + urlAsKey + ': ' + err))
            .then(jsonObj => {
                dataCache.set(urlAsKey, jsonObj);

            })
    };
}

/**
 * get infographic data for each time range in the app
 * @param newsFlashIds
 */
function setInfographicData(newsFlashIds) {
    const yearsAgoList = apiConstants.infographicTimeRange;
    yearsAgoList.forEach(yearsAgo => newsFlashIds.forEach(newsId => getInfographicForNewsflash(newsId, yearsAgo)));
}


/**
 * retrieved data from cache if data not exist then fetch the an store in cache
 * if request of news flash type, then fetch also the infographic data of it
 * @param urlAsKey
 * @param requestType
 * @returns a resolved promise
 */
async function getData(urlAsKey, requestType) {
    const url = `${apiConstants.baseUrl}${urlAsKey}`;
    let dataFromCache;
    dataFromCache = dataCache.get(url);
    if (!dataFromCache) {
        dataFromCache = await getDataFromApi(url);
        dataCache.set(url, dataFromCache);

        if (requestType === 'newsFlash') {
            const newsFlashIds = dataFromCache.map(newsFlash => newsFlash.id);
            setInfographicData(newsFlashIds, dataCache);
        }
    }

    return dataFromCache;
}

function clearCache() {
    dataCache.flushAll();
}

module.exports.getData = getData;
module.exports.clearAPICache = clearCache;