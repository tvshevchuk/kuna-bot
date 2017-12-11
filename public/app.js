
const GetFetch = url => {
    let authHeader = 'Basic ' + btoa(`${loginInput.value}:${passwordInput.value}`);
    const headers = new Headers();
    headers.append('Authorization', authHeader);   
    
    return fetch(url, {method: 'GET', headers});
};

latestMarketDataBtn.addEventListener('click', () => {
    GetFetch('/btcuah').then((response) => {
        return response.json();
    }).then(e => console.log(e));
});

myInfoBtn.addEventListener('click', () => {
    GetFetch('/myinfo').then((response) => {
        console.log(response);
    });
});
