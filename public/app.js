
const GetFetch = url => {
    let authHeader = 'Basic ' + btoa(`${loginInput.value}:${passwordInput.value}`);
    const headers = new Headers();
    headers.append('Authorization', authHeader);   
    
    return fetch(url, {method: 'GET', headers}).then(response => {
        if (response.status < 400) {
            return response.json();
        } else throw 'auth error';
    });
};

latestMarketDataBtn.addEventListener('click', () => {
    GetFetch('/api/btcuah').then(data => {
        latestMarketDataPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});

orderBookBtn.addEventListener('click', () => {
    GetFetch('/api/orderbook').then(data => {
        orderBookPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});

tradesBtn.addEventListener('click', () => {
    GetFetch('/api/trades').then(data => {
        tradesPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});

myInfoBtn.addEventListener('click', () => {
    GetFetch('/api/myinfo').then(data => {
        myInfoPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});

myHistoryBtn.addEventListener('click', () => {
    GetFetch('/api/myhistory').then(data => {
        myHistoryPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});
