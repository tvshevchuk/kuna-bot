const defaulAuthState = {
    username: '',
    password: '',
    isRegisterDialogOpened: false,
    isLoginDialogOpened: false
}

const AuthReducer = (state = defaulAuthState, action) => {
    switch (action.type) {
        case 'SET_USERNAME': 
            return Object.assign({}, state, { username: action.username });
        case 'SET_PASSWORD': 
            return Object.assign({}, state, { password: action.password });
        case 'OPEN_REGISTER_DIALOG':
            return Object.assign({}, state, { isRegisterDialogOpened: true });
        case 'CLOSE_REGISTER_DIALOG': 
            return Object.assign({}, state, { isRegisterDialogOpened: false });
        case 'OPEN_LOGIN_DIALOG': 
            return Object.assign({}, state, { isLoginDialogOpened: true });
        case 'CLOSE_LOGIN_DIALOG': 
            return Object.assign({}, state, { isLoginDialogOpened: false });
        default:
            return state;
    }
}

export default AuthReducer;