
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
    GetFetch('/api/btcuah').then(linkToPre(latestMarketDataPre));
});

orderBookBtn.addEventListener('click', () => {
    GetFetch('/api/orderbook').then(linkToPre(orderBookPre));
});

tradesBtn.addEventListener('click', () => {
    GetFetch('/api/trades').then(linkToPre(tradesPre));
});

myInfoBtn.addEventListener('click', () => {
    GetFetch('/api/myinfo').then(linkToPre(myInfoPre));
});

deleteOrderBtn.addEventListener('click', () => {
    PostFetch('/api/deleteorder', {id: deleteOrderInput.value}).then(linkToPre(deleteOrderPre));
});

myOrdersBtn.addEventListener('click', () => {
    GetFetch('/api/myorders').then(linkToPre(myOrdersPre));
});

myHistoryBtn.addEventListener('click', () => {
    GetFetch('/api/myhistory').then(linkToPre(myHistoryPre));
});
