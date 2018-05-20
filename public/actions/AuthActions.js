const setUsername = (username) => ({
    type: 'SET_USERNAME',
    username
});

const setPassword = (password) => ({
    type: 'SET_PASSWORD',
    password
});

const openRegisterDialog = () => ({
    type: 'OPEN_REGISTER_DIALOG'
});

const closeRegisterDialog = () => ({
    type: 'CLOSE_REGISTER_DIALOG'
});

const openLoginDialog = () => ({
    type: 'OPEN_LOGIN_DIALOG'
});

const closeLoginDialog = () => ({
    type: 'CLOSE_LOGIN_DIALOG'
});

export {
    setUsername,
    setPassword,
    openRegisterDialog,
    closeRegisterDialog,
    openLoginDialog,
    closeLoginDialog
}