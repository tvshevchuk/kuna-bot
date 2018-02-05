const GetFetch = (url, params) => {
    const headers = new Headers();
    addAuthorizationHeader(headers);

    url += addParamsToUrl(params);
    
    return fetch(url, {method: 'GET', headers}).then(response => {
        if (response.status < 400) {
            return response.json();
        } else throw 'auth error';
    });
};

const PostFetch = (url, body) => {
    const headers = new Headers();
    addAuthorizationHeader(header);
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

const addAuthorizationHeader = headers => {
    if (window.loginInput && window.passwordInput) {
        const authHeader = 'Basic ' + btoa(`${loginInput.value}:${passwordInput.value}`);
        headers.append('Authorization', authHeader);   
    }
}

const addParamsToUrl = (params) => {
    let urlProps = [];
    for (let prop in params) {
        urlProps.push(`${prop}=${params[prop]}`);
    }
    return urlProps.length ? `?${urlProps.join('&')}` : '';
}

export { GetFetch, PostFetch };