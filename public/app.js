
const GetFetch = url => {
    const authHeader = 'Basic ' + btoa(`${loginInput.value}:${passwordInput.value}`);
    const headers = new Headers();
    headers.append('Authorization', authHeader);   
    
    return fetch(url, {method: 'GET', headers}).then(response => {
        if (response.status < 400) {
            return response.json();
        } else throw 'auth error';
    });
};

const PostFetch = (url, body) => {
    const authHeader = 'Basic ' + btoa(`${loginInput.value}:${passwordInput.value}`);
    const headers = new Headers();
    headers.append('Authorization', authHeader);   
    headers.append('Content-type', 'application/json');
    
    return fetch(url, { 
        method: 'post', 
        headers, 
        body: JSON.stringify(body) })
            .then(response => {
                if (response.status < 400) {
                    return response.json();
                } else throw 'auth error';
            });
}

const linkToPre = pre => {
    return data => {
        pre.innerHTML = JSON.stringify(data, undefined, 2);
    }
}

latestMarketDataBtn.addEventListener('click', () => {
    GetFetch(`/api/tickers/${marketSelect.value}`).then(linkToPre(latestMarketDataPre));
});

orderBookBtn.addEventListener('click', () => {
    GetFetch(`/api/orderbook/${marketSelect.value}`).then(linkToPre(orderBookPre));
});

tradesBtn.addEventListener('click', () => {
    GetFetch(`/api/trades/${marketSelect.value}`).then(linkToPre(tradesPre));
});

myInfoBtn.addEventListener('click', () => {
    GetFetch('/api/myinfo').then(linkToPre(myInfoPre));
});

buyOrderBtn.addEventListener('click', () => {
    PostFetch('/api/postorder', {
        side: 'buy',
        volume: uahVolumeInput.value / btcPriceInput.value,
        market: marketSelect.value,
        price: parseInt(btcPriceInput.value)
    }).then(linkToPre(postOrderPre));
});

sellOrderBtn.addEventListener('click', () => {
    PostFetch('/api/postorder', {
        side: 'sell',
        volume: uahVolumeInput.value / btcPriceInput.value,
        market: marketSelect.value,
        price: parseInt(btcPriceInput.value)
    }).then(linkToPre(postOrderPre));
});

deleteOrderBtn.addEventListener('click', () => {
    PostFetch('/api/deleteorder', {id: deleteOrderInput.value}).then(linkToPre(deleteOrderPre));
});

myOrdersBtn.addEventListener('click', () => {
    GetFetch(`/api/myorders/${marketSelect.value}`).then(linkToPre(myOrdersPre));
});

myHistoryBtn.addEventListener('click', () => {
    GetFetch(`/api/myhistory/${marketSelect.value}`).then(linkToPre(myHistoryPre));
});

startBtcBotBtn.addEventListener('click', () => {
    PostFetch('/api/startbot/btcuah', {
        uahBudget: uahBudgetForBtcInput.value
    }).then(linkToPre(btcBotStatusPre));
});

stopBtcBotBtn.addEventListener('click', () => {
    GetFetch('/api/stopbot/btcuah').then(linkToPre(btcBotStatusPre));
});

startEthBotBtn.addEventListener('click', () => {
    PostFetch('/api/startbot/ethuah', {
        uahBudget: uahBudgetForBtcInput.value
    }).then(linkToPre(ethBotStatusPre));
});

stopEthBotBtn.addEventListener('click', () => {
    GetFetch('/api/stopbot/ethuah').then(linkToPre(ethBotStatusPre));
});
