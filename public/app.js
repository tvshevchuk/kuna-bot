
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
    GetFetch('/btcuah').then(data => {
        latestMarketDataPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});

myInfoBtn.addEventListener('click', () => {
    GetFetch('/myinfo').then(data => {
        myInfoPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});

myHistoryBtn.addEventListener('click', () => {
    GetFetch('/myhistory').then(data => {
        myHistoryPre.innerHTML = JSON.stringify(data, undefined, 2);
    });
});
