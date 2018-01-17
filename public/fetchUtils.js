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

export { GetFetch, PostFetch };